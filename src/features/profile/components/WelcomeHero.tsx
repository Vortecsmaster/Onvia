import React from "react";
import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Badge } from "../../../components/primitives/Badge";
import { Heading } from "../../../components/primitives/Heading";
import { Text } from "../../../components/primitives/Text";
import { Button } from "../../../components/primitives/Button";
import { BrandMark } from "../../../components/layout/BrandMark";
import { t } from "../../../locales";
export function WelcomeHero({ onPress }: { onPress: () => void }) {
  const wide = useWindowDimensions().width >= 1000;
  return (
    <LinearGradient
      colors={["#E9E9FA", "#EAF0F3", "#F1ECDD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        padding: wide ? 24 : 12,
        minHeight: wide ? 220 : 132,
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <View style={{ flex: 1, gap: 8 }}>
        <Badge label={t("profile.heroLabel")} background="#FFFFFFAA" />
        <Heading size={wide ? 30 : 20} style={{ maxWidth: 450 }}>
          {t("profile.heroTitle")}
        </Heading>
        <Text muted size={14} style={{ maxWidth: 390 }}>
          {t("profile.heroBody")}
        </Text>
        <View style={{ alignSelf: "flex-start" }}>
          <Button
            label={t("profile.heroAction")}
            icon="arrow-up-right"
            variant="ghost"
            onPress={onPress}
          />
        </View>
      </View>
      {wide && (
        <View
          style={{ width: 230, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: 120,
              borderWidth: 1,
              borderColor: "#FFFFFFCC",
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 185,
              height: 185,
              borderRadius: 100,
              borderWidth: 22,
              borderColor: "#FFFFFF66",
            }}
          />
          <BrandMark symbol width={140} />
        </View>
      )}
    </LinearGradient>
  );
}
