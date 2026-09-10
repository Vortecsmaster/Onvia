import React from "react";
import { ServicesProvider } from "./ServicesProvider";
import { WorkspaceProvider } from "./WorkspaceProvider";
import { FeedbackProvider } from "./FeedbackProvider";
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ServicesProvider>
      <WorkspaceProvider>
        <FeedbackProvider>{children}</FeedbackProvider>
      </WorkspaceProvider>
    </ServicesProvider>
  );
}
