import { createWorkspaceRepository } from "../src/services/storage/WorkspaceRepository";
import { createWorkspace } from "../src/services/storage/seeds";
import { appConfig } from "../src/config/app";
import { KeyValueStorage } from "../src/domain/contracts";
const old = {
  profile: { name: "Ana", age: "34", sex: "Femenino" },
  records: {
    conditions: [{ id: "c1", name: "Rinitis", date: "2025-01-01" }],
    medications: [
      {
        id: "m1",
        name: "Medicación",
        date: "2026-09-09",
        lifelong: false,
        start: "2026-09-09",
        end: "2026-10-09",
      },
    ],
    history: [
      { id: "h1", name: "Consulta", date: "2026-09-09", detail: "Preguntas" },
    ],
  },
};
function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage: KeyValueStorage = {
    getItem: jest.fn(async (k) => data.get(k) ?? null),
    setItem: jest.fn(async (k, v) => {
      data.set(k, v);
    }),
  };
  return { data, storage };
}
test("migrates all legacy data without deleting original", async () => {
  const { data, storage } = memory({
    [appConfig.legacyStorageKey]: JSON.stringify(old),
  });
  const result = await createWorkspaceRepository(storage).load();
  expect(result.profile).toEqual({ name: "Ana", age: 34, sex: "female" });
  expect(result.history[0]).toEqual({
    id: "h1",
    title: "Consulta",
    createdDate: "2026-09-09",
    detail: "Preguntas",
  });
  expect(result.medications[0].treatment).toEqual({
    lifelong: false,
    startDate: "2026-09-09",
    endDate: "2026-10-09",
  });
  expect(data.has(appConfig.storageKey)).toBe(true);
  expect(data.has(appConfig.legacyStorageKey)).toBe(true);
});
test("empty legacy collections stay empty", async () => {
  const { storage } = memory({
    [appConfig.legacyStorageKey]: JSON.stringify({
      ...old,
      records: { conditions: [], medications: [], history: [] },
    }),
  });
  const result = await createWorkspaceRepository(storage).load();
  expect(result.conditions).toEqual([]);
  expect(result.medications).toEqual([]);
  expect(result.history).toEqual([]);
});
test("failed migration keeps legacy data and allows retry", async () => {
  const { data, storage } = memory({
    [appConfig.legacyStorageKey]: JSON.stringify(old),
  });
  const original = storage.setItem;
  storage.setItem = jest.fn().mockRejectedValue(new Error("disk full"));
  await expect(createWorkspaceRepository(storage).load()).rejects.toThrow();
  expect(data.has(appConfig.storageKey)).toBe(false);
  expect(data.has(appConfig.legacyStorageKey)).toBe(true);
  storage.setItem = original;
  await expect(
    createWorkspaceRepository(storage).load(),
  ).resolves.toHaveProperty("version", 2);
});
test("seeds only fresh storage and preserves current empty collections", async () => {
  const { storage } = memory();
  const repo = createWorkspaceRepository(storage);
  const fresh = await repo.load();
  expect(fresh.conditions).toHaveLength(10);
  await repo.save({ ...fresh, conditions: [], medications: [], history: [] });
  const result = await repo.load();
  expect(result.conditions).toEqual([]);
  expect(result.history).toEqual([]);
});
test("corrupt data fails without overwriting or seeding", async () => {
  const { data, storage } = memory({ [appConfig.storageKey]: "bad-json" });
  await expect(createWorkspaceRepository(storage).load()).rejects.toThrow();
  expect(data.get(appConfig.storageKey)).toBe("bad-json");
  expect(storage.setItem).not.toHaveBeenCalled();
});
test("invalid record shapes do not overwrite persisted state", async () => {
  const { storage } = memory();
  const repo = createWorkspaceRepository(storage);
  const fresh = await repo.load();
  await expect(
    repo.save({
      ...createWorkspace(),
      conditions: [{ id: "x", name: "", diagnosisDate: "2026-01-01" }],
    }),
  ).rejects.toThrow();
  expect(await repo.load()).toEqual(fresh);
});
