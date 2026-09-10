import React, { useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import { FormField, FieldProps } from "./FormField";
import { theme } from "../../theme";
export interface InputProps extends Omit<FieldProps, "label"> {
  label?: string;
  accessibilityLabel?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  maxLength?: number;
  multiline?: boolean;
  minHeight?: number;
}
export function Input({
  label,
  hint,
  error,
  required,
  disabled,
  readOnly,
  testID,
  accessibilityLabel,
  value,
  onChangeText,
  multiline,
  minHeight = 52,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <TextInput
        {...props}
        testID={testID}
        accessibilityLabel={accessibilityLabel ?? label ?? props.placeholder}
        accessibilityState={{ disabled: !!disabled }}
        editable={!disabled && !readOnly}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#797B82"
        style={{
          minHeight,
          borderWidth: focused ? 2 : 1,
          borderColor: error
            ? theme.colors.error
            : focused
              ? theme.colors.primary
              : "#92928B",
          borderRadius: 12,
          padding: 14,
          fontFamily: theme.fonts.body,
          fontSize: 15,
          color: theme.colors.ink,
          backgroundColor: disabled ? "#F0EFE9" : "#fff",
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
    </FormField>
  );
}
