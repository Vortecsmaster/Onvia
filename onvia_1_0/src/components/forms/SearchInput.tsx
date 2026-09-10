import React from "react";
import { Input, InputProps } from "./Input";
import { t } from "../../locales";
export function SearchInput(
  props: Omit<InputProps, "label"> & { label?: string },
) {
  return (
    <Input
      {...props}
      label={props.label ?? t("common.search")}
      placeholder={props.placeholder ?? t("common.searchPlaceholder")}
      autoCapitalize="none"
    />
  );
}
