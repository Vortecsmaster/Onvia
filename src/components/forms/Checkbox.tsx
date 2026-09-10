import React from "react";
import { Pressable } from "react-native";
import { Text } from "../primitives/Text";
import { Icon } from "../primitives/Icon";
import { theme } from "../../theme";
export interface CheckProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  testID?: string;
}
export function Checkbox({
  label,
  value,
  onChange,
  disabled,
  readOnly,
  testID,
}: CheckProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled || readOnly}
      onPress={() => onChange(!value)}
      style={{
        minHeight: 48,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon
        name={value ? "check-square" : "square"}
        color={theme.colors.primary}
      />
      <Text size={13} style={{ flex: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}
