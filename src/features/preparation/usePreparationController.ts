import { useState } from "react";
import { useRouter } from "expo-router";
import { useServices } from "../../providers/ServicesProvider";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { useTask } from "../shared/useTask";
import { ModelProgress } from "../../domain/models";
export function usePreparationController() {
  const { preparation } = useServices(),
    { value, commit } = useWorkspace(),
    router = useRouter(),
    task = useTask();
  const [models, setModels] = useState<ModelProgress[]>([
    { id: "medpsy", progress: value?.prepared ? 100 : 0 },
    { id: "whisper", progress: value?.prepared ? 100 : 0 },
    { id: "voice", progress: value?.prepared ? 100 : 0 },
  ]);
  return {
    ...task,
    models,
    complete: !!value?.prepared,
    start: () =>
      task.run(async (signal) => {
        await preparation.prepare((p) => {
          if (!signal.aborted) setModels(p);
        }, signal);
        if (signal.aborted) return;
        await commit((w) => ({ ...w, prepared: true }));
      }),
    continue: () => router.replace("/onboarding"),
  };
}
