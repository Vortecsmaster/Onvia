import React, { useState } from "react";
import { FormField, FieldProps } from "./FormField";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { Button } from "../primitives/Button";
import { ModalSheet } from "../layout/ModalSheet";
import { Text } from "../primitives/Text";
import { LocalDateTime } from "../../domain/models";
import {
  validDate,
  validTime,
  formatDate,
  formatTime,
  inRange,
} from "../../domain/dateTime";
import { appConfig } from "../../config/app";
import { t } from "../../locales";
export interface DateTimePickerProps extends FieldProps {
  value: LocalDateTime | null;
  onChange: (value: LocalDateTime | null) => void;
  hourCycle?: 12 | 24;
  locale?: string;
  min?: LocalDateTime;
  max?: LocalDateTime;
}
const comparable = (v: LocalDateTime) => `${v.date}T${v.time}`;
export function DateTimePicker({
  value,
  onChange,
  hourCycle = appConfig.hourCycle,
  locale = appConfig.locale,
  min,
  max,
  ...field
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState<LocalDateTime>({ date: "", time: "" });
  const valid =
    validDate(draft.date) &&
    validTime(draft.time) &&
    inRange(comparable(draft), min && comparable(min), max && comparable(max));
  return (
    <FormField {...field}>
      <Button
        testID={field.testID}
        accessibilityLabel={field.label}
        label={
          value
            ? `${formatDate(value.date, locale)} · ${formatTime(value.time, hourCycle, locale)}`
            : t("date.datetime")
        }
        variant="secondary"
        icon="calendar"
        disabled={field.disabled || field.readOnly}
        onPress={() => {
          setDraft(value ? { ...value } : { date: "", time: "" });
          setOpen(true);
        }}
      />
      <ModalSheet
        visible={open}
        title={field.label}
        onClose={() => setOpen(false)}
      >
        <DatePicker
          label={t("date.dateLabel")}
          value={draft.date || null}
          onChange={(date) => setDraft((d) => ({ ...d, date: date || "" }))}
          min={min?.date}
          max={max?.date}
          locale={locale}
          required
        />
        <TimePicker
          label={t("date.timeLabel")}
          value={draft.time || null}
          onChange={(time) => setDraft((d) => ({ ...d, time: time || "" }))}
          hourCycle={hourCycle}
          locale={locale}
          min={draft.date === min?.date ? min.time : undefined}
          max={draft.date === max?.date ? max.time : undefined}
          required
        />
        {!valid && <Text accessibilityRole="alert">{t("date.invalid")}</Text>}
        <Button
          label={t("common.confirm")}
          disabled={!valid}
          onPress={() => {
            onChange({ ...draft });
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
