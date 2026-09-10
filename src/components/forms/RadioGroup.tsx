import React from "react";
import { View } from "react-native";
import { Radio } from "./Radio";
import { FormField, FieldProps } from "./FormField";
export interface Option<T extends string = string> {
  label: string;
  value: T;
}
export interface RadioGroupProps<T extends string> extends FieldProps {
  value: T | null;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
}
export function RadioGroup<T extends string>({
  value,
  options,
  onChange,
  ...field
}: RadioGroupProps<T>) {
  return (
    <FormField {...field}>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={field.label}
        style={{ gap: 8 }}
      >
        {options.map((o) => (
          <Radio
            key={o.value}
            label={o.label}
            selected={value === o.value}
            disabled={field.disabled || field.readOnly}
            onPress={() => onChange(o.value)}
            testID={field.testID ? `${field.testID}-${o.value}` : undefined}
          />
        ))}
      </View>
    </FormField>
  );
}
