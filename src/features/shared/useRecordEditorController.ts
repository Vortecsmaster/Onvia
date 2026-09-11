import { useState } from "react";
import { useRouter, useLocalSearchParams, usePathname, Href } from "expo-router";
import { Collection, RecordMap } from "../../domain/models";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { useNotify } from "../../providers/FeedbackProvider";
import { useTask } from "./useTask";
import { recordMeta } from "./recordPresentation";
import { t } from "../../locales";
import {
  conditionError,
  medicationError,
  historyError,
} from "../../domain/validation";
import { localToday } from "../../domain/dateTime";
import { backOrReplace } from "./navigation";
export function resolveEditorId(pathname: string, id?: string | string[]) {
  if (pathname.endsWith("/new")) return undefined;
  const value = Array.isArray(id) ? id[0] : id;
  return value && value !== "new" ? value : undefined;
}

function emptyRecord<K extends Collection>(kind: K): RecordMap[K] {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date = localToday();
  return (
    kind === "conditions"
      ? { id, name: "", diagnosisDate: date }
      : kind === "medications"
        ? {
            id,
            name: "",
            prescriptionDate: date,
            treatment: { lifelong: false, startDate: date, endDate: date },
          }
        : { id, title: "", createdDate: date, detail: "" }
  ) as RecordMap[K];
}
function nextCollection<T extends { id: string }>(
  records: T[],
  draft: T,
  recordId?: string,
) {
  if (recordId) return records.map((r) => (r.id === recordId ? draft : r));
  return [draft, ...records];
}

export function useRecordEditorController<K extends Collection>(kind: K) {
  const params = useLocalSearchParams<{ id?: string | string[] }>(),
    pathname = usePathname(),
    { value, commit } = useWorkspace(),
    router = useRouter(),
    notify = useNotify(),
    task = useTask();
  const recordId = resolveEditorId(pathname, params.id);
  const existing = recordId
    ? value![kind].find((r) => r.id === recordId)
    : undefined;
  const [draft, setDraft] = useState<RecordMap[K]>(() =>
    existing ? JSON.parse(JSON.stringify(existing)) : emptyRecord(kind),
  );
  const missing = !!recordId && !existing;
  const back = () => backOrReplace(router, recordMeta[kind].path);
  return {
    ...task,
    draft,
    setDraft,
    missing,
    editing: !!recordId,
    back,
    save: () =>
      task.run(async (signal) => {
        const validate = {
          conditions: conditionError,
          medications: medicationError,
          history: historyError,
        }[kind] as (r: RecordMap[K]) => ReturnType<typeof conditionError>;
        const validation = validate(draft);
        if (validation) {
          task.setError(t(validation));
          return;
        }
        await commit((w) => {
          if (recordId && !w[kind].some((r) => r.id === recordId))
            throw new Error("Record removed");
          if (kind === "conditions")
            return {
              ...w,
              conditions: nextCollection(w.conditions, draft as never, recordId),
            };
          if (kind === "medications")
            return {
              ...w,
              medications: nextCollection(
                w.medications,
                draft as never,
                recordId,
              ),
            };
          return {
            ...w,
            history: nextCollection(w.history, draft as never, recordId),
          };
        });
        if (!signal.aborted) {
          notify(t("common.saved"));
          router.replace(recordMeta[kind].path as Href);
        }
      }, "errors.save"),
  };
}
