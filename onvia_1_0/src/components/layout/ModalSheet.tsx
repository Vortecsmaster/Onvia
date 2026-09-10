import React from "react";
import { Modal, View, ScrollView, Platform } from "react-native";
import { Heading } from "../primitives/Heading";
import { IconButton } from "../primitives/IconButton";
import { theme } from "../../theme";
import { t } from "../../locales";
export function ModalSheet({
  visible,
  title,
  onClose,
  children,
  testID,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  testID?: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0C173A70",
        }}
      >
        <View
          testID={testID}
          accessibilityViewIsModal
          style={{
            width: "100%",
            maxWidth: 540,
            maxHeight: "92%",
            borderRadius: 22,
            backgroundColor: theme.colors.background,
            overflow: "hidden",
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === "ios" ? "interactive" : "on-drag"
            }
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            contentContainerStyle={{ padding: 24, gap: 20 }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Heading size={24} style={{ flex: 1 }}>
                {title}
              </Heading>
              <IconButton
                label={t("common.close")}
                icon="x"
                onPress={onClose}
              />
            </View>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
