import { useCallback, useEffect, useRef, useState } from "react";
import { t, TextKey } from "../../locales";
// A controller-scoped task prevents duplicate requests and ignores stale completions.
export function useTask() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      active.current?.abort();
    };
  }, []);
  const run = useCallback(
    async (
      work: (signal: AbortSignal) => Promise<void>,
      errorKey: TextKey = "errors.generic",
    ) => {
      if (active.current) return;
      const controller = new AbortController();
      active.current = controller;
      setBusy(true);
      setError("");
      try {
        await work(controller.signal);
      } catch {
        if (mounted.current && !controller.signal.aborted)
          setError(t(errorKey));
      } finally {
        if (active.current === controller) active.current = null;
        if (mounted.current) setBusy(false);
      }
    },
    [],
  );
  return { busy, error, setError, run };
}
