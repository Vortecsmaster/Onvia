import React from "react";
import { View, Pressable } from "react-native";
import { Card } from "../../../components/primitives/Card";
import { Heading } from "../../../components/primitives/Heading";
import { Text } from "../../../components/primitives/Text";
import { Button } from "../../../components/primitives/Button";
import { Icon } from "../../../components/primitives/Icon";
import { ClinicalEntry } from "../../../domain/models";
import { formatDate } from "../../../domain/dateTime";
import { t } from "../../../locales";
export function RecentHistory({
  items,
  onOpen,
  onAll,
}: {
  items: ClinicalEntry[];
  onOpen: (id: string) => void;
  onAll: () => void;
}) {
  return (
    <Card style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading size={20} style={{ flex: 1 }}>
          {t("profile.recent")}
        </Heading>
        <Button label={t("profile.all")} variant="ghost" onPress={onAll} />
      </View>
      {items.map((r) => (
        <Pressable
          key={r.id}
          accessibilityRole="button"
          onPress={() => onOpen(r.id)}
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            minHeight: 58,
          }}
        >
          <Icon name="file-text" color="#8B5B26" />
          <View style={{ flex: 1 }}>
            <Text size={14} weight="medium">
              {r.title}
            </Text>
            <Text muted size={12}>
              {formatDate(r.createdDate)}
            </Text>
          </View>
          <Icon name="chevron-right" size={17} />
        </Pressable>
      ))}
      {items.length === 0 && <Text muted>{t("common.emptyBody")}</Text>}
    </Card>
  );
}
