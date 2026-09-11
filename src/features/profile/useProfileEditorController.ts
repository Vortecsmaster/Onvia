import { useState } from "react";
import { useRouter } from "expo-router";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { useNotify } from "../../providers/FeedbackProvider";
import { profileError } from "../../domain/validation";
import { Profile } from "../../domain/models";
import { ProfileDraft } from "./components/ProfileForm";
import { useTask } from "../shared/useTask";
import { backOrReplace } from "../shared/navigation";
import { t } from "../../locales";
export function useProfileEditorController(onboarding = false) {
  const { value, commit } = useWorkspace(),
    router = useRouter(),
    notify = useNotify(),
    task = useTask();
  const [draft, setDraft] = useState<ProfileDraft>({
      name: value?.profile?.name ?? "",
      age: value?.profile ? String(value.profile.age) : "",
      sex: value?.profile?.sex ?? null,
    }),
    [consent, setConsent] = useState(false);
  const profile = {
    name: draft.name.trim(),
    age: Number(draft.age),
    sex: draft.sex,
  } as Profile;
  const valid =
    !!draft.sex && /^\d+$/.test(draft.age) && !profileError(profile);
  return {
    ...task,
    draft,
    setDraft,
    consent,
    setConsent,
    valid: valid && (!onboarding || consent),
    back: () => backOrReplace(router, "/"),
    save: () =>
      task.run(async (signal) => {
        if (!valid || (onboarding && !consent)) return;
        await commit((w) => ({
          ...w,
          profile,
          termsAccepted: onboarding ? true : w.termsAccepted,
        }));
        if (!signal.aborted) {
          notify(t("common.saved"));
          router.replace("/");
        }
      }, "errors.save"),
  };
}
