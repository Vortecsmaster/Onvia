import React from "react";
import { RecordEditorLayout } from "../shared/RecordEditorLayout";
import { ConditionForm } from "./components/ConditionForm";
import type { useConditionEditorController } from "./useConditionEditorController";
import { t } from "../../locales";
export function ConditionEditorView(
  c: ReturnType<typeof useConditionEditorController>,
) {
  return (
    <RecordEditorLayout
      {...c}
      title={t(c.editing ? "conditions.edit" : "conditions.create")}
    >
      <ConditionForm value={c.draft} onChange={c.setDraft} disabled={c.busy} />
    </RecordEditorLayout>
  );
}
