import React from "react";
import { View } from "react-native";
import { theme } from "../../theme";
export function Divider() {
  return (
    <View
      style={{ height: 1, backgroundColor: theme.colors.line, width: "100%" }}
    />
  );
}
