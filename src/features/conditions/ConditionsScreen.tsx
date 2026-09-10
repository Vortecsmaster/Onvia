import React from "react";
import { ConditionsView } from "./ConditionsView";
import { useConditionsController } from "./useConditionsController";
export default function ConditionsScreen() {
  return <ConditionsView {...useConditionsController()} />;
}
