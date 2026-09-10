import React from "react";
import { View } from "react-native";
import { Heading } from "../primitives/Heading";
import { Text } from "../primitives/Text";
import { Button } from "../primitives/Button";
import { t } from "../../locales";
export function ScreenHeader({
  title,
  description,
  action,
  onBack,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      {onBack && (
        <View style={{ alignSelf: "flex-start" }}>
          <Button
            label={t("common.back")}
            icon="arrow-left"
            variant="ghost"
            onPress={onBack}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flex: 1, minWidth: 180 }}>
          <Heading size={26}>{title}</Heading>
          {description && (
            <Text muted size={14} style={{ marginTop: 4 }}>
              {description}
            </Text>
          )}
        </View>
        {action}
      </View>
    </View>
  );
}
