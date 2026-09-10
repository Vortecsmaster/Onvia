import React from "react";
import { View } from "react-native";
import { AssistantView } from "./AssistantView";
import { useAssistantController } from "./useAssistantController";
export default function AssistantScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AssistantView {...useAssistantController()} />
    </View>
  );
}
