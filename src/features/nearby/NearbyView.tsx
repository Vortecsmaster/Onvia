import React from "react";
import { View } from "react-native";
import { Screen } from "../../components/layout/Screen";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import { Section } from "../../components/layout/Section";
import { Button } from "../../components/primitives/Button";
import { Text } from "../../components/primitives/Text";
import { ErrorState } from "../../components/feedback/ErrorState";
import { PlacesMap } from "./components/PlacesMap";
import { PlaceList } from "./components/PlaceList";
import { PlaceDetails } from "./components/PlaceDetails";
import { useNearbyController, PlaceFilter } from "./useNearbyController";
import { t, countText } from "../../locales";
export function NearbyView(c: ReturnType<typeof useNearbyController>) {
  return (
    <Screen compact>
      <ScreenHeader title={t("nearby.title")} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["all", "hospital", "pharmacy"] as PlaceFilter[]).map((f) => (
            <Button
              key={f}
              label={t(
                f === "all"
                  ? "nearby.all"
                  : f === "hospital"
                    ? "nearby.hospitals"
                    : "nearby.pharmacies",
              )}
              variant={c.filter === f ? "primary" : "secondary"}
              compact
              onPress={() => c.setFilter(f)}
            />
          ))}
        </View>
        <Button
          label={t(c.busy ? "nearby.locating" : "nearby.locate")}
          icon="navigation"
          variant="secondary"
          disabled={c.busy}
          onPress={c.locate}
        />
      </View>
      <Text muted size={12}>
        {c.locationLabel}
      </Text>
      <Text muted size={12}>
        {t("nearby.internet")}
      </Text>
      {c.error && <ErrorState message={c.error} />}
      <PlacesMap items={c.items} center={c.center} onSelect={c.select} />
      <Section
        title={t("nearby.list")}
        action={
          <Text muted size={12}>
            {countText("place", c.items.length)}
          </Text>
        }
      >
        <PlaceList items={c.items} onSelect={c.select} />
      </Section>
      <Text muted size={11}>
        {t("nearby.attribution")}
      </Text>
      <PlaceDetails
        place={c.selected}
        onClose={() => c.select(null)}
        onDirections={c.directions}
      />
    </Screen>
  );
}
