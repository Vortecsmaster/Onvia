import React from "react";
import { RecordsView } from "../shared/RecordsView";
import type { useMedicationsController } from "./useMedicationsController";
export function MedicationsView(
  props: ReturnType<typeof useMedicationsController>,
) {
  return <RecordsView {...props} />;
}
