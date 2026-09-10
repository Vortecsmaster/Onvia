import React from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { Heading } from "../../components/primitives/Heading";
import { Text } from "../../components/primitives/Text";
import { Icon } from "../../components/primitives/Icon";
import { ErrorState } from "../../components/feedback/ErrorState";
import { MessageList } from "./components/MessageList";
import { MessageComposer } from "./components/MessageComposer";
import type { useAssistantController } from "./useAssistantController";
import { appConfig } from "../../config/app";
import { theme } from "../../theme";
import { t } from "../../locales";
export function AssistantView(c: ReturnType<typeof useAssistantController>) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Heading size={24}>
          {t("assistant.name", { name: appConfig.name })}
        </Heading>
        <MessageList messages={c.messages} busy={c.busy} />
        {c.error && <ErrorState message={c.error} />}
        <MessageComposer
          value={c.input}
          onChange={c.setInput}
          onSend={c.send}
          onSuggest={c.suggest}
          busy={c.busy}
        />
        <View
          style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}
        >
          <Icon name="shield" size={16} color={theme.colors.teal} />
          <Text muted size={12} style={{ flex: 1 }}>
            {t("assistant.footer", { name: appConfig.name })}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
