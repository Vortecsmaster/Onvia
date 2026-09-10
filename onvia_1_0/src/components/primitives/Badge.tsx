import React from "react";
import { View } from "react-native";
import { Text } from "./Text";
import { theme } from "../../theme";
export function Badge({
  label,
  color = theme.colors.primary,
  background = theme.colors.blueLight,
}: {
  label: string;
  color?: string;
  background?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: background,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: "flex-start",
      }}
    >
      <Text weight="medium" size={11} style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
