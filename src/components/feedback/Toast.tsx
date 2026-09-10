import React from "react";
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { Icon } from "../primitives/Icon";
export function Toast({ message }: { message: string }) {
  return message ? (
    <View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 88,
        alignSelf: "center",
        maxWidth: "90%",
        borderRadius: 12,
        backgroundColor: "#19372F",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Icon name="check-circle" size={18} color="#fff" />
      <Text size={13} style={{ color: "#fff", flexShrink: 1 }}>
        {message}
      </Text>
    </View>
  ) : null;
}
