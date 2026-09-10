import React from "react";
import { ConditionEditorView } from "./ConditionEditorView";
import { useConditionEditorController } from "./useConditionEditorController";
export default function ConditionEditorScreen() {
  return <ConditionEditorView {...useConditionEditorController()} />;
}
