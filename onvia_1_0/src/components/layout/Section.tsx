import React from "react";
import { View } from "react-native";
import { Heading } from "../primitives/Heading";
export function Section({
  title,
  action,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      {title && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          <Heading size={20} style={{ flex: 1 }}>
            {title}
          </Heading>
          {action}
        </View>
      )}
      {children}
    </View>
  );
}
