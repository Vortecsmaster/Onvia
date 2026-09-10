import React from "react";
import { ClinicalHistoryView } from "./ClinicalHistoryView";
import { useClinicalHistoryController } from "./useClinicalHistoryController";
export default function ClinicalHistoryScreen() {
  return <ClinicalHistoryView {...useClinicalHistoryController()} />;
}
