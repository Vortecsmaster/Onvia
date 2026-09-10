import React from "react";
import { MedicationEditorView } from "./MedicationEditorView";
import { useMedicationEditorController } from "./useMedicationEditorController";
export default function MedicationEditorScreen() {
  return <MedicationEditorView {...useMedicationEditorController()} />;
}
