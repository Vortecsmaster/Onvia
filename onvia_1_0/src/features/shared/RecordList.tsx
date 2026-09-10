import React from "react";
import { View } from "react-native";
import { Card } from "../../components/primitives/Card";
import { Text } from "../../components/primitives/Text";
import { Icon } from "../../components/primitives/Icon";
import { IconButton } from "../../components/primitives/IconButton";
import { Collection, HealthRecord } from "../../domain/models";
import { recordMeta, recordName, recordSubtitle } from "./recordPresentation";
import { formatDate } from "../../domain/dateTime";
import { t } from "../../locales";
import { theme } from "../../theme";
export function RecordList({
  kind,
  records,
  onEdit,
  onDelete,
}: {
  kind: Collection;
  records: HealthRecord[];
  onEdit: (id: string) => void;
  onDelete: (r: HealthRecord) => void;
}) {
  const meta = recordMeta[kind];
  return (
    <View style={{ gap: 12 }}>
      {records.map((r) => (
        <Card key={r.id} style={{ padding: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Icon name={meta.icon} color={meta.color} />
            <View style={{ flex: 1 }}>
              <Text weight="medium">{recordName(r)}</Text>
              <Text muted size={12}>
                {recordSubtitle(kind, r)}
              </Text>
              {"treatment" in r && (
                <Text size={11} style={{ color: theme.colors.teal }}>
                  {r.treatment.lifelong
                    ? t("medications.lifelong")
                    : `${formatDate(r.treatment.startDate)} → ${formatDate(r.treatment.endDate)}`}
                </Text>
              )}
            </View>
            <IconButton
              label={`${t("common.edit")} ${recordName(r)}`}
              icon="edit-2"
              onPress={() => onEdit(r.id)}
            />
            <IconButton
              label={`${t("common.delete")} ${recordName(r)}`}
              icon="trash-2"
              color={theme.colors.error}
              onPress={() => onDelete(r)}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}
