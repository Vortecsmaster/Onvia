import React from "react";
import { RecordsView } from "../shared/RecordsView";
import type { useClinicalHistoryController } from "./useClinicalHistoryController";
export function ClinicalHistoryView(
  props: ReturnType<typeof useClinicalHistoryController>,
) {
  return <RecordsView {...props} />;
}
