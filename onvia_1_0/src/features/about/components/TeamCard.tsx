import React from "react";
import { Card } from "../../../components/primitives/Card";
import { Text } from "../../../components/primitives/Text";
import { Heading } from "../../../components/primitives/Heading";
import { Badge } from "../../../components/primitives/Badge";
import { Divider } from "../../../components/primitives/Divider";
import { BrandMark } from "../../../components/layout/BrandMark";
import { t } from "../../../locales";
export function TeamCard({
  version,
  event,
  team,
}: {
  version: string;
  event: string;
  team: string[];
}) {
  return (
    <Card style={{ alignItems: "center", padding: 20, gap: 14 }}>
      <BrandMark width={168} />
      <Heading size={22} style={{ textAlign: "center" }}>
        {t("about.tagline")}
      </Heading>
      <Text muted style={{ textAlign: "center", maxWidth: 490 }}>
        {t("about.body")}
      </Text>
      <Badge label={t("about.version", { version })} />
      <Divider />
      <Text weight="medium" style={{ textAlign: "center" }}>
        {t("about.event", { event })}
      </Text>
      {team.map((name) => (
        <Text key={name}>{name}</Text>
      ))}
    </Card>
  );
}
