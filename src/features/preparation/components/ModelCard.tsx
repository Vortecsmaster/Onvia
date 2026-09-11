import React from "react";
import { View } from "react-native";
import { Card } from "../../../components/primitives/Card";
import { Text } from "../../../components/primitives/Text";
import { Icon } from "../../../components/primitives/Icon";
import { ProgressBar } from "../../../components/feedback/ProgressBar";
import { ModelProgress } from "../../../domain/models";
import { theme } from "../../../theme";
import { t } from "../../../locales";
export function ModelCard({
  models,
  busy,
  complete,
}: {
  models: ModelProgress[];
  busy: boolean;
  complete: boolean;
}) {
  return (
    <Card style={{ gap: 8, padding: 12 }}>
      {models.map((m) => (
        <View key={m.id} style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon
              name={
                m.id === "medpsy" ? "cpu" : m.id === "whisper" ? "mic" : "volume-2"
              }
              size={16}
              color={theme.colors.primary}
            />
            <Text weight="medium" size={13} style={{ flex: 1 }}>
              {t(`preparation.${m.id}`)}
            </Text>
            <Text muted size={11}>
              {t(
                complete
                  ? "preparation.complete"
                  : busy
                    ? "preparation.working"
                    : "preparation.pending",
              )}
            </Text>
            <Text weight="bold" size={13} style={{ color: theme.colors.primary }}>
              {m.progress}%
            </Text>
          </View>
          <ProgressBar value={m.progress} label={t(`preparation.${m.id}`)} />
        </View>
      ))}
    </Card>
  );
}
