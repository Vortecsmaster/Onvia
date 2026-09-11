import React, { useEffect, useState } from "react";
import type { Services } from "../domain/contracts";
import { ServicesProvider } from "./ServicesProvider";
import { WorkspaceProvider } from "./WorkspaceProvider";
import { FeedbackProvider } from "./FeedbackProvider";
import { LoadingState } from "../components/feedback/LoadingState";
import { ErrorState } from "../components/feedback/ErrorState";
import { Screen } from "../components/layout/Screen";
import { createAppServices } from "./createAppServices";
import { t } from "../locales";

export function AppProviders({
  children,
  services,
}: {
  children: React.ReactNode;
  services?: Services;
}) {
  const [resolved, setResolved] = useState<Services | null>(services ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (services) {
      setResolved(services);
      return;
    }
    let active = true;
    createAppServices()
      .then((value) => {
        if (active) setResolved(value);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [services]);

  if (failed)
    return (
      <Screen>
        <ErrorState message={t("errors.load")} />
      </Screen>
    );
  if (!resolved) return <LoadingState />;

  return (
    <ServicesProvider services={resolved}>
      <WorkspaceProvider>
        <FeedbackProvider>{children}</FeedbackProvider>
      </WorkspaceProvider>
    </ServicesProvider>
  );
}
