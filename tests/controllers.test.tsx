import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import {
  WorkspaceProvider,
  useWorkspace,
} from "../src/providers/WorkspaceProvider";
import { useTask } from "../src/features/shared/useTask";
import { useRecordEditorController } from "../src/features/shared/useRecordEditorController";
import { createWorkspace } from "../src/services/storage/seeds";
import { Workspace } from "../src/domain/models";
const mockReplace = jest.fn(),
  mockNotify = jest.fn();
const mockRepository = { load: jest.fn(), save: jest.fn() };
jest.mock("../src/providers/ServicesProvider", () => ({
  useServices: () => ({ workspace: mockRepository }),
}));
jest.mock("../src/providers/FeedbackProvider", () => ({
  useNotify: () => mockNotify,
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, canGoBack: () => false }),
  useLocalSearchParams: () => ({}),
}));
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WorkspaceProvider>{children}</WorkspaceProvider>
);
beforeEach(() => {
  jest.clearAllMocks();
  mockRepository.load.mockResolvedValue({
    ...createWorkspace(),
    profile: { name: "Ana", age: 34, sex: "female" },
    prepared: true,
  });
  mockRepository.save.mockResolvedValue(undefined);
});
test("workspace publishes changes only after storage confirms and serializes concurrent writes", async () => {
  let release: () => void = () => undefined;
  mockRepository.save.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      }),
  );
  const { result } = renderHook(() => useWorkspace(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  let first: Promise<void>, second: Promise<void>;
  act(() => {
    first = result.current.commit((w) => ({ ...w, conditions: [] }));
    second = result.current.commit((w) => ({ ...w, history: [] }));
  });
  await waitFor(() => expect(mockRepository.save).toHaveBeenCalledTimes(1));
  expect(result.current.value!.conditions).toHaveLength(10);
  await act(async () => {
    release();
    await first;
    await second;
  });
  expect(result.current.value!.conditions).toHaveLength(0);
  expect(result.current.value!.history).toHaveLength(0);
  expect(
    (mockRepository.save.mock.calls[1][0] as Workspace).conditions,
  ).toEqual([]);
});
test("failed save retains state and next commit can succeed", async () => {
  mockRepository.save.mockRejectedValueOnce(new Error("storage full"));
  const { result } = renderHook(() => useWorkspace(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    await expect(
      result.current.commit((w) => ({ ...w, conditions: [] })),
    ).rejects.toThrow();
  });
  expect(result.current.value!.conditions).toHaveLength(10);
  await act(async () => {
    await result.current.commit((w) => ({ ...w, conditions: [] }));
  });
  expect(result.current.value!.conditions).toEqual([]);
});
test("editor retains draft and does not notify or navigate when persistence fails", async () => {
  mockRepository.save.mockRejectedValueOnce(new Error("full"));
  const host = renderHook(() => useWorkspace(), { wrapper });
  await waitFor(() => expect(host.result.current.loading).toBe(false));
  host.unmount();
  const readyWrapper = ({ children }: { children: React.ReactNode }) => (
    <WorkspaceProvider>
      <Ready>{children}</Ready>
    </WorkspaceProvider>
  );
  function Ready({ children }: { children: React.ReactNode }) {
    return useWorkspace().value ? <>{children}</> : null;
  }
  const { result } = renderHook(() => useRecordEditorController("conditions"), {
    wrapper: readyWrapper,
  });
  await waitFor(() => expect(result.current).not.toBeNull());
  act(() =>
    result.current.setDraft((d) => ({ ...d, name: "Registro conservado" })),
  );
  await act(async () => {
    await result.current.save();
  });
  expect(result.current.draft.name).toBe("Registro conservado");
  expect(result.current.error).toContain("No se pudo guardar");
  expect(mockNotify).not.toHaveBeenCalled();
  expect(mockReplace).not.toHaveBeenCalled();
  await act(async () => {
    await result.current.save();
  });
  expect(mockNotify).toHaveBeenCalledTimes(1);
  expect(mockReplace).toHaveBeenCalledWith("/conditions");
});
test("controller tasks reject duplicates and abort on unmount", async () => {
  let signal: AbortSignal | undefined;
  let finish: () => void = () => undefined;
  const work = jest.fn((s: AbortSignal) => {
    signal = s;
    return new Promise<void>((r) => {
      finish = r;
    });
  });
  const { result, unmount } = renderHook(() => useTask());
  act(() => {
    void result.current.run(work);
    void result.current.run(work);
  });
  expect(work).toHaveBeenCalledTimes(1);
  unmount();
  expect(signal?.aborted).toBe(true);
  await act(async () => finish());
});
