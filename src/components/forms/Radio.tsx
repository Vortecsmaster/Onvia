import React from "react";
import { Pressable } from "react-native";
import { Text } from "../primitives/Text";
import { Icon } from "../primitives/Icon";
import { theme } from "../../theme";
export function Radio({
  label,
  selected,
  onPress,
  disabled = false,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 50,
        padding: 12,
        borderRadius: 12,
        backgroundColor: selected
          ? theme.colors.blueLight
          : theme.colors.background,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon
        name={selected ? "check-circle" : "circle"}
        color={theme.colors.primary}
      />
      <Text style={{ flex: 1 }}>{label}</Text>
    </Pressable>
  );
}
