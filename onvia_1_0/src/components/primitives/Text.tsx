import React from "react";
import { Text as NativeText, TextProps } from "react-native";
import { theme } from "../../theme";
export interface AppTextProps extends TextProps {
  muted?: boolean;
  weight?: "body" | "medium" | "bold";
  size?: number;
}
export function Text({
  muted,
  weight = "body",
  size = 15,
  style,
  ...props
}: AppTextProps) {
  return (
    <NativeText
      {...props}
      style={[
        {
          fontFamily: theme.fonts[weight],
          fontSize: size,
          lineHeight: size * 1.5,
          color: muted ? theme.colors.muted : theme.colors.ink,
        },
        style,
      ]}
    />
  );
}
