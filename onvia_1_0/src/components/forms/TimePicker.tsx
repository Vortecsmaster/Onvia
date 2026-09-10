import React, { useState } from "react";
import { View } from "react-native";
import { FormField, FieldProps } from "./FormField";
import { Select } from "./Select";
import { Button } from "../primitives/Button";
import { Text } from "../primitives/Text";
import { ModalSheet } from "../layout/ModalSheet";
import { appConfig } from "../../config/app";
import { t } from "../../locales";
import {
  timeParts,
  canonicalTime,
  formatTime,
  inRange,
} from "../../domain/dateTime";
export interface TimePickerProps extends FieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  hourCycle?: 12 | 24;
  locale?: string;
  min?: string;
  max?: string;
}
export function TimePicker({
  value,
  onChange,
  hourCycle = appConfig.hourCycle,
  locale = appConfig.locale,
  min,
  max,
  ...field
}: TimePickerProps) {
  const [open, setOpen] = useState(false),
    [parts, setParts] = useState(timeParts(value || "", hourCycle));
  const draft = canonicalTime(
    parts.hour,
    parts.minute,
    hourCycle,
    parts.period,
  );
  const valid = inRange(draft, min, max);
  return (
    <FormField {...field}>
      <Button
        testID={field.testID}
        accessibilityLabel={field.label}
        label={value ? formatTime(value, hourCycle, locale) : t("date.time")}
        variant="secondary"
        icon="clock"
        disabled={field.disabled || field.readOnly}
        onPress={() => {
          setParts(timeParts(value || "", hourCycle));
          setOpen(true);
        }}
      />
      <ModalSheet
        visible={open}
        title={field.label}
        onClose={() => setOpen(false)}
      >
        <View style={{ gap: 16 }}>
          <Select
            label={t("date.hour")}
            value={String(parts.hour)}
            options={Array.from(
              { length: hourCycle === 12 ? 12 : 24 },
              (_, i) => ({
                value: String(hourCycle === 12 ? i + 1 : i),
                label: String(hourCycle === 12 ? i + 1 : i).padStart(2, "0"),
              }),
            )}
            onChange={(v) => setParts((p) => ({ ...p, hour: Number(v) }))}
          />
          <Select
            label={t("date.minute")}
            value={String(parts.minute)}
            options={Array.from({ length: 60 }, (_, i) => ({
              value: String(i),
              label: String(i).padStart(2, "0"),
            }))}
            onChange={(v) => setParts((p) => ({ ...p, minute: Number(v) }))}
          />
          {hourCycle === 12 && (
            <Select
              label={t("date.period")}
              value={parts.period}
              options={[
                { value: "AM", label: "AM" },
                { value: "PM", label: "PM" },
              ]}
              onChange={(period) => setParts((p) => ({ ...p, period }))}
            />
          )}
        </View>
        {!valid && <Text accessibilityRole="alert">{t("date.invalid")}</Text>}
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
        <Button
          label={t("common.cancel")}
          variant="secondary"
          onPress={() => setOpen(false)}
        />
      </ModalSheet>
    </FormField>
  );
}
