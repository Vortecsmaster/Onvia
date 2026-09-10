import React from "react";
import { TextProps } from "react-native";
import { Text } from "./Text";
import { theme } from "../../theme";
export function Heading({
  size = 30,
  style,
  ...props
}: TextProps & { size?: number }) {
  return (
    <Text
      accessibilityRole="header"
      {...props}
      style={[
        {
          fontFamily: theme.fonts.title,
          fontSize: size,
          lineHeight: size * 1.2,
          letterSpacing: -0.6,
        },
        style,
      ]}
    />
  );
}
