import React from "react";
import {
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  PressableStateCallbackType,
} from "react-native";
import { Text } from "./Text";
import { Icon, IconName } from "./Icon";
import { theme } from "../../theme";
export interface ButtonProps {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  compact?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}
export function Button({
  label,
  accessibilityLabel,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  compact = false,
  testID,
  style,
}: ButtonProps) {
  const c = theme.colors;
  const blocked = disabled || loading;
  const color = disabled
    ? c.muted
    : variant === "secondary" || variant === "ghost"
      ? c.primary
      : "#fff";
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      style={({
        pressed,
        hovered,
      }: PressableStateCallbackType & { hovered?: boolean }) => [
        {
          minHeight: compact ? 36 : 50,
          borderRadius: theme.radius.control,
          paddingHorizontal: compact ? 12 : 18,
          paddingVertical: compact ? 6 : 12,
          flexDirection: "row",
          gap: compact ? 6 : 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: disabled
            ? "#E3E4E8"
            : variant === "danger"
              ? c.error
              : variant === "secondary"
                ? c.blueLight
                : variant === "ghost"
                  ? "transparent"
                  : hovered
                    ? c.primaryDark
                    : c.primary,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : icon ? (
        <Icon name={icon} size={18} color={color} />
      ) : null}
      <Text
        size={compact ? 13 : undefined}
        weight="medium"
        style={{ color, flexShrink: 1, textAlign: "center" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
