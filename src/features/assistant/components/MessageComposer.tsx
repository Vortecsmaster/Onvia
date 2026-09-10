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
  onSuggest,
  busy,
}: {
  value: string;
  onChange: (text: string) => void;
  onSend: (text?: string) => void;
  onSuggest: () => void;
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
        {(["assistant.consultation", "assistant.medications"] as const).map(
          (key) => (
            <Button
              key={key}
              label={t(key)}
              variant="secondary"
              compact
              disabled={busy}
              onPress={() => onSend(t(key))}
              style={{ flex: 1 }}
            />
          ),
        )}
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
          label={t("assistant.dictate")}
          icon="mic"
          disabled={busy}
          onPress={onSuggest}
        />
        <IconButton
          label={t("assistant.send")}
          icon="arrow-up"
          filled
          disabled={!value.trim() || busy}
          onPress={() => onSend()}
        />
      </View>
    </View>
  );
}
