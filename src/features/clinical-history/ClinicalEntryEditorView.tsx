import React from "react";
import { RecordEditorLayout } from "../shared/RecordEditorLayout";
import { ClinicalEntryForm } from "./components/ClinicalEntryForm";
import type { useClinicalEntryEditorController } from "./useClinicalEntryEditorController";
import { Button } from "../../components/primitives/Button";
import { t } from "../../locales";
export function ClinicalEntryEditorView(
  c: ReturnType<typeof useClinicalEntryEditorController>,
) {
  return (
    <RecordEditorLayout
      {...c}
      title={t(c.editing ? "history.edit" : "history.create")}
    >
      <ClinicalEntryForm
        value={c.draft}
        onChange={c.setDraft}
        disabled={c.busy}
      />
      <Button
        label={t("assistant.suggestion")}
        variant="secondary"
        icon="file-text"
        disabled={c.busy}
        onPress={c.suggest}
      />
    </RecordEditorLayout>
  );
}
