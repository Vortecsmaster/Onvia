import React from "react";
import { View, Switch } from "react-native";
import { Text } from "../primitives/Text";
import { theme } from "../../theme";
import { CheckProps } from "./Checkbox";
export function Toggle({
  label,
  value,
  onChange,
  disabled,
  readOnly,
  testID,
  hint,
}: CheckProps & { hint?: string }) {
  return (
    <View
      style={{
        minHeight: 48,
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text>{label}</Text>
        {hint && (
          <Text muted size={12}>
            {hint}
          </Text>
        )}
      </View>
      <Switch
        testID={testID}
        accessibilityLabel={label}
        disabled={disabled || readOnly}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#C5C6CA", true: theme.colors.primary }}
      />
    </View>
  );
}
