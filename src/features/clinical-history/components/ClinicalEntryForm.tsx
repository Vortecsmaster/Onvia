import React from "react";
import { DictationField } from "../../../components/forms/DictationField";
import { DatePicker } from "../../../components/forms/DatePicker";
import { ClinicalEntry } from "../../../domain/models";
import { t } from "../../../locales";
export function ClinicalEntryForm({
  value,
  onChange,
  disabled,
  dictating,
  onDictate,
}: {
  value: ClinicalEntry;
  onChange: (value: ClinicalEntry) => void;
  disabled: boolean;
  dictating: "title" | "detail" | null;
  onDictate: (field: "title" | "detail") => void;
}) {
  return (
    <>
      <DictationField
        label={t("common.title")}
        value={value.title}
        onChangeText={(title) => onChange({ ...value, title })}
        placeholder={t("history.titlePlaceholder")}
        required
        disabled={disabled}
        dictating={dictating === "title"}
        dictateLabel={t("history.dictateTitle")}
        onDictate={() => onDictate("title")}
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
      <DictationField
        label={t("common.detail")}
        value={value.detail}
        onChangeText={(detail) => onChange({ ...value, detail })}
        placeholder={t("common.detailPlaceholder")}
        required
        disabled={disabled}
        multiline
        minHeight={140}
        dictating={dictating === "detail"}
        dictateLabel={t("history.dictateDetail")}
        onDictate={() => onDictate("detail")}
      />
    </>
  );
}
