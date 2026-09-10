import React from "react";
import { AboutView } from "./AboutView";
import { useAboutController } from "./useAboutController";
export default function AboutScreen() {
  return <AboutView {...useAboutController()} />;
}
