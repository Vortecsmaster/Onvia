import React from "react";
import { Pressable } from "react-native";
import { Icon, IconName } from "./Icon";
import { theme } from "../../theme";
export function IconButton({
  label,
  icon,
  onPress,
  disabled = false,
  color = theme.colors.primary,
  filled = false,
  testID,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  filled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        borderRadius: filled ? 24 : 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: filled
          ? disabled
            ? "#E3E4E8"
            : theme.colors.primary
          : "transparent",
        opacity: disabled && !filled ? 0.4 : pressed ? 0.6 : 1,
      })}
    >
      <Icon
        name={icon}
        size={19}
        color={filled ? (disabled ? theme.colors.muted : "#fff") : color}
      />
    </Pressable>
  );
}
