import React from "react";
import { View } from "react-native";
import { Input, InputProps } from "./Input";
import { IconButton } from "../primitives/IconButton";
import { t } from "../../locales";

export function DictationField({
  dictating,
  onDictate,
  dictateLabel,
  disabled,
  ...props
}: InputProps & {
  dictating: boolean;
  onDictate: () => void;
  dictateLabel: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Input {...props} disabled={disabled} />
      <View style={{ alignSelf: "flex-end" }}>
        <IconButton
          label={dictating ? t("assistant.stopDictate") : dictateLabel}
          icon={dictating ? "square" : "mic"}
          disabled={!!disabled}
          filled={dictating}
          onPress={onDictate}
        />
      </View>
    </View>
  );
}
