import React from "react";
import { OnboardingView } from "./OnboardingView";
import { useOnboardingController } from "./useOnboardingController";
export default function OnboardingScreen() {
  return <OnboardingView {...useOnboardingController()} />;
}
