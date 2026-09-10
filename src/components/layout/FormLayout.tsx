import React from "react";
import { View } from "react-native";
export function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ width: "100%", maxWidth: 620, alignSelf: "center", gap: 16 }}
    >
      {children}
    </View>
  );
}
