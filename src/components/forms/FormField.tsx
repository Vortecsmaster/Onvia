import React from "react";
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { theme } from "../../theme";
import { t } from "../../locales";
export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  testID?: string;
}
export function FormField({
  label,
  hint,
  error,
  required,
  children,
}: Omit<FieldProps, "label"> & { label?: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 4 }}>
      {label ? (
        <Text size={13} weight="medium">
          {label}
          {required ? ` · ${t("common.required")}` : ""}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text
          accessibilityRole="alert"
          size={12}
          style={{ color: theme.colors.error }}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text muted size={12}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
