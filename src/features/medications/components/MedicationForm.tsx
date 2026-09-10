import React from "react";
import { Input } from "../../../components/forms/Input";
import { DatePicker } from "../../../components/forms/DatePicker";
import { Toggle } from "../../../components/forms/Toggle";
import { Medication } from "../../../domain/models";
import { localToday } from "../../../domain/dateTime";
import { t } from "../../../locales";
export function MedicationForm({
  value,
  onChange,
  disabled,
}: {
  value: Medication;
  onChange: (value: Medication) => void;
  disabled: boolean;
}) {
  return (
    <>
      <Input
        label={t("common.name")}
        value={value.name}
        onChangeText={(name) => onChange({ ...value, name })}
        placeholder={t("common.namePlaceholder")}
        required
        disabled={disabled}
      />
      <DatePicker
        label={t("medications.date")}
        value={value.prescriptionDate}
        onChange={(prescriptionDate) =>
          onChange({ ...value, prescriptionDate: prescriptionDate || "" })
        }
        required
        disabled={disabled}
      />
      <Toggle
        label={t("medications.lifelong")}
        hint={t(
          value.treatment.lifelong
            ? "medications.permanent"
            : "medications.temporary",
        )}
        value={value.treatment.lifelong}
        onChange={(lifelong) =>
          onChange({
            ...value,
            treatment: lifelong
              ? { lifelong: true }
              : {
                  lifelong: false,
                  startDate: localToday(),
                  endDate: localToday(),
                },
          })
        }
        disabled={disabled}
      />
      {!value.treatment.lifelong && (
        <>
          <DatePicker
            label={t("medications.start")}
            value={value.treatment.startDate}
            onChange={(startDate) => {
              if (!value.treatment.lifelong)
                onChange({
                  ...value,
                  treatment: { ...value.treatment, startDate: startDate || "" },
                });
            }}
            required
            disabled={disabled}
          />
          <DatePicker
            label={t("medications.end")}
            value={value.treatment.endDate}
            min={value.treatment.startDate}
            onChange={(endDate) => {
              if (!value.treatment.lifelong)
                onChange({
                  ...value,
                  treatment: { ...value.treatment, endDate: endDate || "" },
                });
            }}
            required
            disabled={disabled}
          />
        </>
      )}
    </>
  );
}
