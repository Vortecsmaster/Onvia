import React from "react";
import { View } from "react-native";
import { Input } from "../../../components/forms/Input";
import { Button } from "../../../components/primitives/Button";
import { IconButton } from "../../../components/primitives/IconButton";
import { theme } from "../../../theme";
import { t } from "../../../locales";
export function MessageComposer({
  value,
  onChange,
  onSend,
  onDictate,
  dictating,
  busy,
}: {
  value: string;
  onChange: (text: string) => void;
  onSend: (text?: string) => void;
  onDictate: () => void;
  dictating: boolean;
  busy: boolean;
}) {
  return (
    <View
      style={{
        paddingTop: 10,
        gap: 10,
        borderTopWidth: 1,
        borderColor: theme.colors.line,
      }}
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(
          [
            ["assistant.consultation", "assistant.content.consultation"],
            ["assistant.medications", "assistant.content.medications"],
          ] as const
        ).map(([label, content]) => (
          <Button
            key={label}
            label={t(label)}
            variant="secondary"
            compact
            disabled={busy}
            onPress={() => onSend(t(content))}
            style={{ flex: 1 }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}>
        <View style={{ flex: 1 }}>
          <Input
            accessibilityLabel={t("assistant.message")}
            value={value}
            onChangeText={onChange}
            placeholder={t("assistant.placeholder")}
            minHeight={48}
          />
        </View>
        <IconButton
          label={dictating ? t("assistant.stopDictate") : t("assistant.dictate")}
          icon={dictating ? "square" : "mic"}
          disabled={busy}
          filled={dictating}
          onPress={onDictate}
        />
        <IconButton
          label={t("assistant.send")}
          icon="arrow-up"
          filled
          disabled={!value.trim() || busy || dictating}
          onPress={() => onSend()}
        />
      </View>
    </View>
  );
}
