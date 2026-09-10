import React from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { Text } from "../../../components/primitives/Text";
import { Icon } from "../../../components/primitives/Icon";
import { Place } from "../../../domain/models";
import { theme } from "../../../theme";
import { t } from "../../../locales";
export function PlaceList({
  items,
  onSelect,
}: {
  items: Place[];
  onSelect: (place: Place) => void;
}) {
  const wide = useWindowDimensions().width >= 1000;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {items.map((p) => (
        <Pressable
          key={p.id}
          accessibilityRole="button"
          accessibilityLabel={p.name}
          onPress={() => onSelect(p)}
          style={{
            width: wide ? "48.8%" : "100%",
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.line,
            borderRadius: 14,
            backgroundColor: "#fff",
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Icon
            name={p.type === "hospital" ? "plus-square" : "plus"}
            color={
              p.type === "hospital" ? theme.colors.primary : theme.colors.teal
            }
          />
          <View style={{ flex: 1 }}>
            <Text size={14} weight="medium">
              {p.name}
            </Text>
            <Text size={12} muted>
              {t(`nearby.${p.type}`)} · {t("nearby.city")}
            </Text>
          </View>
          <Icon name="chevron-right" size={17} />
        </Pressable>
      ))}
    </View>
  );
}
