import { useRouter } from "expo-router";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { Collection } from "../../domain/models";
export function useProfileController() {
  const { value } = useWorkspace(),
    router = useRouter();
  return {
    profile: value?.profile ?? null,
    counts: {
      conditions: value?.conditions.length ?? 0,
      medications: value?.medications.length ?? 0,
      history: value?.history.length ?? 0,
    },
    recent: value?.history.slice(0, 2) ?? [],
    edit: () => router.push("/profile/edit"),
    assistant: () => router.navigate("/assistant"),
    nearby: () => router.navigate("/nearby"),
    open: (kind: Collection) =>
      router.push(
        kind === "history"
          ? "/clinical-history"
          : kind === "conditions"
            ? "/conditions"
            : "/medications",
      ),
    openEntry: (id: string) =>
      router.push({ pathname: "/clinical-history/[id]", params: { id } }),
  };
}
