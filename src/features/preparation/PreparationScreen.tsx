import React from "react";
import { PreparationView } from "./PreparationView";
import { usePreparationController } from "./usePreparationController";
export default function PreparationScreen() {
  return <PreparationView {...usePreparationController()} />;
}
