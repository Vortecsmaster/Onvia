import React from "react";
import { View } from "react-native";
import { Input } from "../../../components/forms/Input";
import { Select } from "../../../components/forms/Select";
import { Sex } from "../../../domain/models";
import { t } from "../../../locales";
export interface ProfileDraft {
  name: string;
  age: string;
  sex: Sex | null;
}
export const sexOptions = () => [
  { value: "female" as const, label: t("onboarding.female") },
  { value: "male" as const, label: t("onboarding.male") },
  { value: "unspecified" as const, label: t("onboarding.unspecified") },
];
export function ProfileForm({
  value,
  onChange,
  disabled,
}: {
  value: ProfileDraft;
  onChange: (value: ProfileDraft) => void;
  disabled?: boolean;
}) {
  return (
    <View style={{ gap: 14 }}>
      <Input
        label={t("onboarding.name")}
        value={value.name}
        onChangeText={(name) => onChange({ ...value, name })}
        placeholder={t("onboarding.namePlaceholder")}
        required
        disabled={disabled}
      />
      <Input
        label={t("onboarding.age")}
        value={value.age}
        onChangeText={(age) =>
          onChange({ ...value, age: age.replace(/\D/g, "").slice(0, 3) })
        }
        placeholder={t("onboarding.agePlaceholder")}
        keyboardType="number-pad"
        required
        disabled={disabled}
      />
      <Select
        label={t("onboarding.sex")}
        value={value.sex}
        onChange={(sex) => onChange({ ...value, sex })}
        options={sexOptions()}
        required
        disabled={disabled}
      />
    </View>
  );
}
