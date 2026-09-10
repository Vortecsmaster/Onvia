import React from "react";
import { View, ViewProps } from "react-native";
import { theme } from "../../theme";
export function Card({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.line,
          borderRadius: theme.radius.card,
          padding: 16,
          gap: 12,
        },
        style,
      ]}
    />
  );
}
