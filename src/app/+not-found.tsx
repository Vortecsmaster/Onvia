import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "../components/layout/Screen";
import { EmptyState } from "../components/feedback/EmptyState";
import { t } from "../locales";
export default function NotFound() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState
        title={t("common.notFound")}
        body={t("common.notFoundBody")}
        action={{ label: t("common.back"), onPress: () => router.replace("/") }}
      />
    </Screen>
  );
}
