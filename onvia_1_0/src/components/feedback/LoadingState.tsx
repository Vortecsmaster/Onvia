import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "../primitives/Text";
import { t } from "../../locales";
import { theme } from "../../theme";
export function LoadingState() {
  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator color={theme.colors.primary} />
      <Text muted>{t("common.loading")}</Text>
    </View>
  );
}
