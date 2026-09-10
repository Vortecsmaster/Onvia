import React from "react";
import { RecordsView } from "../shared/RecordsView";
import type { useConditionsController } from "./useConditionsController";
export function ConditionsView(
  props: ReturnType<typeof useConditionsController>,
) {
  return <RecordsView {...props} />;
}
