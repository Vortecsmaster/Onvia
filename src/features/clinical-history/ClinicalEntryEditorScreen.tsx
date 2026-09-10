import React from "react";
import { ClinicalEntryEditorView } from "./ClinicalEntryEditorView";
import { useClinicalEntryEditorController } from "./useClinicalEntryEditorController";
export default function ClinicalEntryEditorScreen() {
  return <ClinicalEntryEditorView {...useClinicalEntryEditorController()} />;
}
