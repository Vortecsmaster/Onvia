import { useRecordEditorController } from "../shared/useRecordEditorController";
import { useServices } from "../../providers/ServicesProvider";
import { useTask } from "../shared/useTask";
export function useClinicalEntryEditorController() {
  const editor = useRecordEditorController("history"),
    suggestion = useTask(),
    { transcription } = useServices();
  return {
    ...editor,
    busy: editor.busy || suggestion.busy,
    error: editor.error || suggestion.error,
    suggest: () =>
      suggestion.run(async (signal) => {
        const text = await transcription.transcribe(signal);
        if (!signal.aborted)
          editor.setDraft((d) => ({
            ...d,
            detail: d.detail ? `${d.detail}\n${text}` : text,
          }));
      }),
  };
}
