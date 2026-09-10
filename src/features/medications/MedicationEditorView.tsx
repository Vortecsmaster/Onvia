import React from "react";
import { RecordEditorLayout } from "../shared/RecordEditorLayout";
import { MedicationForm } from "./components/MedicationForm";
import type { useMedicationEditorController } from "./useMedicationEditorController";
import { t } from "../../locales";
export function MedicationEditorView(
  c: ReturnType<typeof useMedicationEditorController>,
) {
  return (
    <RecordEditorLayout
      {...c}
      title={t(c.editing ? "medications.edit" : "medications.create")}
    >
      <MedicationForm value={c.draft} onChange={c.setDraft} disabled={c.busy} />
    </RecordEditorLayout>
  );
}
