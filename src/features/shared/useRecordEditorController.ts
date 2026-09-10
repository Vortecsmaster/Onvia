import { useState } from "react";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
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
export function useRecordEditorController<K extends Collection>(kind: K) {
  const { id } = useLocalSearchParams<{ id?: string }>(),
    { value, commit } = useWorkspace(),
    router = useRouter(),
    notify = useNotify(),
    task = useTask();
  const existing = value![kind].find((r) => r.id === id);
  const [draft, setDraft] = useState<RecordMap[K]>(() =>
    existing ? JSON.parse(JSON.stringify(existing)) : emptyRecord(kind),
  );
  const missing = !!id && !existing;
  const back = () => backOrReplace(router, recordMeta[kind].path);
  return {
    ...task,
    draft,
    setDraft,
    missing,
    editing: !!id,
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
          if (id && !w[kind].some((r) => r.id === id))
            throw new Error("Record removed");
          return {
            ...w,
            [kind]: id
              ? w[kind].map((r) => (r.id === id ? draft : r))
              : [draft, ...w[kind]],
          };
        });
        if (!signal.aborted) {
          notify(t("common.saved"));
          router.replace(recordMeta[kind].path as Href);
        }
      }, "errors.save"),
  };
}
