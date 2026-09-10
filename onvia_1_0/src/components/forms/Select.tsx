import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { FormField, FieldProps } from "./FormField";
import { Option } from "./RadioGroup";
import { Radio } from "./Radio";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";
import { theme } from "../../theme";
import { t } from "../../locales";
export interface SelectProps<T extends string> extends FieldProps {
  value: T | null;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
}
export function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  ...field
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <FormField {...field}>
      <Pressable
        testID={field.testID}
        accessibilityRole="button"
        accessibilityLabel={`${field.label}: ${options.find((o) => o.value === value)?.label ?? t("common.select")}`}
        accessibilityState={{ expanded: open, disabled: field.disabled }}
        disabled={field.disabled || field.readOnly}
        onPress={() => setOpen(!open)}
        style={{
          minHeight: 52,
          borderWidth: 1,
          borderColor: field.error ? theme.colors.error : "#92928B",
          borderRadius: 12,
          padding: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <Text>
          {options.find((o) => o.value === value)?.label ??
            placeholder ??
            t("common.select")}
        </Text>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={18} />
      </Pressable>
      {open && (
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.line,
            borderRadius: 12,
            padding: 8,
            backgroundColor: "#fff",
          }}
        >
          <ScrollView nestedScrollEnabled style={{ maxHeight: 240 }}>
            {options.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                selected={value === option.value}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </FormField>
  );
}
