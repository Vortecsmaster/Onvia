import React from "react";
import { Input } from "../../../components/forms/Input";
import { TextArea } from "../../../components/forms/TextArea";
import { DatePicker } from "../../../components/forms/DatePicker";
import { ClinicalEntry } from "../../../domain/models";
import { t } from "../../../locales";
export function ClinicalEntryForm({
  value,
  onChange,
  disabled,
}: {
  value: ClinicalEntry;
  onChange: (value: ClinicalEntry) => void;
  disabled: boolean;
}) {
  return (
    <>
      <Input
        label={t("common.title")}
        value={value.title}
        onChangeText={(title) => onChange({ ...value, title })}
        placeholder={t("history.titlePlaceholder")}
        required
        disabled={disabled}
      />
      <DatePicker
        label={t("history.date")}
        value={value.createdDate}
        onChange={(createdDate) =>
          onChange({ ...value, createdDate: createdDate || "" })
        }
        required
        disabled={disabled}
      />
      <TextArea
        label={t("common.detail")}
        value={value.detail}
        onChangeText={(detail) => onChange({ ...value, detail })}
        placeholder={t("common.detailPlaceholder")}
        required
        disabled={disabled}
      />
    </>
  );
}
