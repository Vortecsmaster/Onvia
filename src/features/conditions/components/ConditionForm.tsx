import React from "react";
import { Input } from "../../../components/forms/Input";
import { DatePicker } from "../../../components/forms/DatePicker";
import { Condition } from "../../../domain/models";
import { t } from "../../../locales";
export function ConditionForm({
  value,
  onChange,
  disabled,
}: {
  value: Condition;
  onChange: (value: Condition) => void;
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
        label={t("conditions.date")}
        value={value.diagnosisDate}
        onChange={(diagnosisDate) =>
          onChange({ ...value, diagnosisDate: diagnosisDate || "" })
        }
        required
        disabled={disabled}
      />
    </>
  );
}
