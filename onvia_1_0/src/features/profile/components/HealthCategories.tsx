import React from "react";
import {
  View,
  Pressable,
  useWindowDimensions,
  PressableStateCallbackType,
} from "react-native";
import { Heading } from "../../../components/primitives/Heading";
import { Text } from "../../../components/primitives/Text";
import { Icon } from "../../../components/primitives/Icon";
import { Collection } from "../../../domain/models";
import { recordMeta } from "../../shared/recordPresentation";
import { theme } from "../../../theme";
import { t, countText } from "../../../locales";
export function HealthCategories({
  counts,
  onOpen,
}: {
  counts: Record<Collection, number>;
  onOpen: (kind: Collection) => void;
}) {
  const wide = useWindowDimensions().width >= 1000;
  return (
    <View style={{ flexDirection: wide ? "row" : "column", gap: 12 }}>
      {(Object.keys(recordMeta) as Collection[]).map((kind) => {
        const meta = recordMeta[kind];
        return (
          <Pressable
            key={kind}
            accessibilityRole="button"
            accessibilityLabel={t(`${meta.prefix}.title`)}
            onPress={() => onOpen(kind)}
            style={({
              hovered,
            }: PressableStateCallbackType & { hovered?: boolean }) => ({
              flex: wide ? 1 : undefined,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: hovered ? meta.color : theme.colors.line,
            })}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: meta.background,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name={meta.icon} color={meta.color} />
              </View>
              <Icon
                name="arrow-up-right"
                size={18}
                color={theme.colors.muted}
              />
            </View>
            <Heading size={18} style={{ marginTop: 12 }}>
              {t(`${meta.prefix}.title`)}
            </Heading>
            <Text muted size={12} style={{ marginTop: 4 }}>
              {t(`${meta.prefix}.description`)}
            </Text>
            <Text weight="bold" style={{ color: meta.color, marginTop: 10 }}>
              {countText("record", counts[kind])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
