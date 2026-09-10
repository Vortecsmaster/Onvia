import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Screen } from "../../components/layout/Screen";
import { Section } from "../../components/layout/Section";
import { Heading } from "../../components/primitives/Heading";
import { Text } from "../../components/primitives/Text";
import { Button } from "../../components/primitives/Button";
import { Card } from "../../components/primitives/Card";
import { Icon } from "../../components/primitives/Icon";
import { WelcomeHero } from "./components/WelcomeHero";
import { HealthCategories } from "./components/HealthCategories";
import { RecentHistory } from "./components/RecentHistory";
import { sexOptions } from "./components/ProfileForm";
import type { useProfileController } from "./useProfileController";
import { Profile } from "../../domain/models";
import { theme } from "../../theme";
import { t } from "../../locales";
type ProfileController = ReturnType<typeof useProfileController>;
export function ProfileView(
  c: Omit<ProfileController, "profile"> & { profile: Profile },
) {
  const wide = useWindowDimensions().width >= 1000;
  return (
    <Screen compact>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text muted size={10} weight="medium" style={{ letterSpacing: 1 }}>
            {t("profile.eyebrow")}
          </Text>
          <Heading size={wide ? 34 : 26} style={{ marginTop: 4 }}>
            {t("profile.greeting", { name: c.profile.name.split(" ")[0] })} ✳
          </Heading>
          <Text muted size={14} style={{ marginTop: 4 }}>
            {t("profile.body")}
          </Text>
          <Text muted size={12} style={{ marginTop: 4 }}>
            {t("profile.summary", {
              age: c.profile.age,
              sex: sexOptions().find((o) => o.value === c.profile.sex)!.label,
            })}
          </Text>
        </View>
        {wide && (
          <Button
            label={t("profile.edit")}
            icon="edit-2"
            variant="secondary"
            onPress={c.edit}
          />
        )}
      </View>
      <WelcomeHero onPress={c.assistant} />
      <Section title={t("profile.information")}>
        <HealthCategories counts={c.counts} onOpen={c.open} />
      </Section>
      <View style={{ flexDirection: wide ? "row" : "column", gap: 12 }}>
        <RecentHistory
          items={c.recent}
          onOpen={c.openEntry}
          onAll={() => c.open("history")}
        />
        <Card
          style={{ width: wide ? 290 : undefined, backgroundColor: "#F0EFE6" }}
        >
          <Icon name="map-pin" color={theme.colors.teal} />
          <Heading size={21}>{t("profile.nearbyTitle")}</Heading>
          <Text muted size={13}>
            {t("profile.nearbyBody")}
          </Text>
          <Button
            label={t("profile.nearbyAction")}
            variant="ghost"
            icon="arrow-right"
            onPress={c.nearby}
          />
        </Card>
      </View>
      {!wide && (
        <Button
          label={t("profile.edit")}
          variant="secondary"
          icon="edit-2"
          onPress={c.edit}
        />
      )}
      <Text muted size={11} style={{ textAlign: "center" }}>
        {t("profile.footer")}
      </Text>
    </Screen>
  );
}
