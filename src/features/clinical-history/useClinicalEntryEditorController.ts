import { useRef } from "react";
import { useRecordEditorController } from "../shared/useRecordEditorController";
import { useDictation } from "../shared/useDictation";

export function useClinicalEntryEditorController() {
  const editor = useRecordEditorController("history");
  const field = useRef<"title" | "detail">("detail");
  const dictation = useDictation((text) => {
    const target = field.current;
    editor.setDraft((draft) =>
      target === "title"
        ? { ...draft, title: text }
        : {
            ...draft,
            detail: draft.detail ? `${draft.detail}\n${text}` : text,
          },
    );
  });
  return {
    ...editor,
    busy: editor.busy || dictation.busy,
    error: editor.error || dictation.error,
    dictating: dictation.recording ? field.current : null,
    dictate: (target: "title" | "detail") => {
      field.current = target;
      return dictation.toggle();
    },
  };
}
