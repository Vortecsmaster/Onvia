import React, { useState } from "react";
import { Platform, View } from "react-native";
import NativePicker from "@react-native-community/datetimepicker";
import { FormField, FieldProps } from "./FormField";
import { Button } from "../primitives/Button";
import { ModalSheet } from "../layout/ModalSheet";
import { Text } from "../primitives/Text";
import { t } from "../../locales";
import {
  validDate,
  inRange,
  formatDate,
  localToday,
  toLocalISODate,
} from "../../domain/dateTime";
import { appConfig } from "../../config/app";
export interface DatePickerProps extends FieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  min?: string;
  max?: string;
  locale?: string;
}

function pickerDate(value: string) {
  const iso = validDate(value) ? value : localToday();
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  locale = appConfig.locale,
  ...field
}: DatePickerProps) {
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState("");
  const valid = validDate(draft) && inRange(draft, min, max);

  const applyNative = (event: { type?: string }, date?: Date) => {
    if (event.type === "dismissed") {
      setOpen(false);
      return;
    }
    if (!date) return;
    const iso = toLocalISODate(date);
    if (!iso || !inRange(iso, min, max)) return;
    if (Platform.OS === "android") {
      onChange(iso);
      setOpen(false);
      return;
    }
    setDraft(iso);
  };

  return (
    <FormField {...field}>
      <Button
        testID={field.testID}
        accessibilityLabel={field.label}
        label={value ? formatDate(value, locale) : t("date.select")}
        variant="secondary"
        icon="calendar"
        disabled={field.disabled || field.readOnly}
        onPress={() => {
          setDraft(value || localToday());
          setOpen(true);
        }}
      />
      {Platform.OS === "android" && open ? (
        <NativePicker
          testID="native-date-picker"
          mode="date"
          display="default"
          value={pickerDate(value || localToday())}
          minimumDate={min ? pickerDate(min) : undefined}
          maximumDate={max ? pickerDate(max) : undefined}
          onChange={applyNative}
        />
      ) : (
        <ModalSheet
          visible={open}
          title={field.label}
          onClose={() => setOpen(false)}
        >
          {Platform.OS === "web" ? (
            React.createElement("input", {
              type: "date",
              "aria-label": field.label,
              value: draft,
              min,
              max,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft(e.target.value),
              style: {
                height: 52,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #92928B",
                fontSize: 16,
                width: "100%",
                boxSizing: "border-box",
              },
            })
          ) : (
            <NativePicker
              testID="native-date-picker"
              mode="date"
              display="inline"
              value={pickerDate(draft)}
              minimumDate={min ? pickerDate(min) : undefined}
              maximumDate={max ? pickerDate(max) : undefined}
              onChange={applyNative}
            />
          )}
          {!valid && (
            <Text accessibilityRole="alert">{t("date.invalid")}</Text>
          )}
          <Button
            label={t("common.confirm")}
            disabled={!valid}
            onPress={() => {
              onChange(draft);
              setOpen(false);
            }}
          />
          {!field.required && (
            <Button
              label={t("common.clear")}
              variant="ghost"
              onPress={() => {
                onChange(null);
                setOpen(false);
              }}
            />
          )}
          <View>
            <Button
              label={t("common.cancel")}
              variant="secondary"
              onPress={() => setOpen(false)}
            />
          </View>
        </ModalSheet>
      )}
    </FormField>
  );
}
