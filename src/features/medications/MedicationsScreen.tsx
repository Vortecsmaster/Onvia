import React from "react";
import { MedicationsView } from "./MedicationsView";
import { useMedicationsController } from "./useMedicationsController";
export default function MedicationsScreen() {
  return <MedicationsView {...useMedicationsController()} />;
}
