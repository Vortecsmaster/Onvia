import React from "react";
import { View } from "react-native";
import { theme } from "../../theme";
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const progress = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: progress }}
      style={{
        height: 6,
        borderRadius: 8,
        backgroundColor: theme.colors.blueLight,
      }}
    >
      <View
        style={{
          height: 6,
          borderRadius: 8,
          backgroundColor: theme.colors.primary,
          width: `${progress}%`,
        }}
      />
    </View>
  );
}
