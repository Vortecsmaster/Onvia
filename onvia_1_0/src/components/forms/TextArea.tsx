import React from "react";
import { Input, InputProps } from "./Input";
export function TextArea(props: Omit<InputProps, "multiline">) {
  return <Input {...props} multiline minHeight={props.minHeight ?? 140} />;
}
