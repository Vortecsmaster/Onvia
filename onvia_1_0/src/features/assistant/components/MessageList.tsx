import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../../../components/primitives/Text";
import { Message } from "../../../domain/models";
import { appConfig } from "../../../config/app";
import { theme } from "../../../theme";
import { t } from "../../../locales";
export function MessageList({
  messages,
  busy,
}: {
  messages: Message[];
  busy: boolean;
}) {
  const ref = useRef<ScrollView>(null);
  return (
    <ScrollView
      ref={ref}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: true })}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingVertical: 8, gap: 14 }}
    >
      {messages.map((m) => (
        <View
          key={m.id}
          style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "90%",
            gap: 7,
          }}
        >
          <Text muted size={10}>
            {m.role === "user" ? t("assistant.you") : appConfig.name}
          </Text>
          <View
            style={{
              padding: 18,
              borderRadius: 16,
              backgroundColor:
                m.role === "user" ? theme.colors.sand : "#F5F6F9",
            }}
          >
            <Text size={14}>{m.text}</Text>
          </View>
        </View>
      ))}
      {busy && (
        <Text accessibilityLiveRegion="polite" muted size={12}>
          {t("assistant.replying")}
        </Text>
      )}
    </ScrollView>
  );
}
