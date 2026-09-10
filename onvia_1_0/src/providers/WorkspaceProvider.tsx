import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { Workspace } from "../domain/models";
import { useServices } from "./ServicesProvider";
interface State {
  value: Workspace | null;
  loading: boolean;
  failed: boolean;
}
type Action =
  { type: "load" } | { type: "error" } | { type: "value"; value: Workspace };
export function workspaceReducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return { ...state, loading: true, failed: false };
    case "error":
      return { ...state, loading: false, failed: true };
    case "value":
      return { value: action.value, loading: false, failed: false };
  }
}
interface ContextValue extends State {
  reload: () => void;
  commit: (update: (w: Workspace) => Workspace) => Promise<void>;
}
const Context = createContext<ContextValue | null>(null);
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { workspace } = useServices();
  const [state, dispatch] = useReducer(workspaceReducer, {
    value: null,
    loading: true,
    failed: false,
  });
  const latest = useRef<Workspace | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const alive = useRef(true);
  const reload = useCallback(() => {
    dispatch({ type: "load" });
    workspace
      .load()
      .then((value) => {
        if (alive.current) {
          latest.current = value;
          dispatch({ type: "value", value });
        }
      })
      .catch(() => {
        if (alive.current) dispatch({ type: "error" });
      });
  }, [workspace]);
  useEffect(() => {
    alive.current = true;
    reload();
    return () => {
      alive.current = false;
    };
  }, [reload]);
  const commit = useCallback(
    (update: (w: Workspace) => Workspace) => {
      const operation = queue.current.then(async () => {
        if (!latest.current) throw new Error("Workspace not loaded");
        const next = update(latest.current);
        await workspace.save(next);
        latest.current = next;
        if (alive.current) dispatch({ type: "value", value: next });
      });
      queue.current = operation.catch(() => undefined);
      return operation;
    },
    [workspace],
  );
  return (
    <Context.Provider value={{ ...state, reload, commit }}>
      {children}
    </Context.Provider>
  );
}
export function useWorkspace() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("WorkspaceProvider missing");
  return ctx;
}
