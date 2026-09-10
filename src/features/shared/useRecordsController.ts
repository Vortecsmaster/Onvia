import { useState } from "react";
import { useRouter, Href } from "expo-router";
import { Collection, HealthRecord } from "../../domain/models";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { useNotify } from "../../providers/FeedbackProvider";
import { useTask } from "./useTask";
import { recordName, recordMeta } from "./recordPresentation";
import { backOrReplace } from "./navigation";
import { t } from "../../locales";
export function useRecordsController(kind: Collection) {
  const { value, commit } = useWorkspace(),
    router = useRouter(),
    notify = useNotify(),
    task = useTask();
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState<HealthRecord | null>(null);
  const records = value![kind];
  return {
    ...task,
    kind,
    query,
    setQuery,
    records: records.filter((r) =>
      recordName(r).toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    ),
    count: records.length,
    selected,
    selectDelete: (r: HealthRecord) => {
      task.setError("");
      setSelected(r);
    },
    cancelDelete: () => {
      if (!task.busy) setSelected(null);
    },
    back: () => backOrReplace(router, "/"),
    add: () => router.push(`${recordMeta[kind].path}/new` as Href),
    edit: (id: string) => router.push(`${recordMeta[kind].path}/${id}` as Href),
    remove: () =>
      task.run(async (signal) => {
        if (!selected) return;
        const id = selected.id;
        await commit((w) => ({
          ...w,
          [kind]: w[kind].filter((r) => r.id !== id),
        }));
        if (!signal.aborted) {
          setSelected(null);
          notify(t("common.deleted"));
        }
      }, "errors.save"),
  };
}
