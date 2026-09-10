import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { theme } from "../../theme";
export type IconName = React.ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 22,
  color = theme.colors.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Feather name={name} size={size} color={color} />;
}
