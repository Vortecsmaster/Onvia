import React from "react";
import { Screen } from "../../components/layout/Screen";
import { Heading } from "../../components/primitives/Heading";
import { Card } from "../../components/primitives/Card";
import { Text } from "../../components/primitives/Text";
import { TeamCard } from "./components/TeamCard";
import type { useAboutController } from "./useAboutController";
import { t } from "../../locales";
export function AboutView(c: ReturnType<typeof useAboutController>) {
  return (
    <Screen compact>
      <Heading size={26}>{t("about.title")}</Heading>
      <TeamCard {...c} />
      <Card>
        <Heading size={20}>{t("about.privacyTitle")}</Heading>
        <Text muted size={14}>
          {t("about.privacyBody")}
        </Text>
      </Card>
    </Screen>
  );
}
