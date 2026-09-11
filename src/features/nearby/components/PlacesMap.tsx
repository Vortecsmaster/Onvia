import React, { useState } from "react";
import { View } from "react-native";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  Marker,
} from "@maplibre/maplibre-react-native";
import { Place } from "../../../domain/models";
import { Text } from "../../../components/primitives/Text";
import {
  OPENFREEMAP_STYLE,
  panamaBounds,
  panamaStyle,
} from "./mapStyle";
import outline from "../../../data/panama-outline.json";
import { theme } from "../../../theme";

export function PlacesMap({
  items,
  center,
  onSelect,
}: {
  items: Place[];
  center: [number, number];
  onSelect: (place: Place) => void;
}) {
  const [style, setStyle] = useState<typeof OPENFREEMAP_STYLE | typeof panamaStyle>(
    OPENFREEMAP_STYLE,
  );
  const offline = style !== OPENFREEMAP_STYLE;
  return (
    <View
      style={{
        height: 340,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#DDDCD5",
      }}
    >
      <Map
        mapStyle={style}
        style={{ flex: 1 }}
        onDidFailLoadingMap={() => setStyle(panamaStyle)}
      >
        <Camera
          center={[center[1], center[0]]}
          zoom={12}
          minZoom={6}
          maxZoom={18}
          maxBounds={panamaBounds}
        />
        {offline ? (
          <GeoJSONSource id="panama" data={outline as GeoJSON.GeoJSON}>
            <Layer
              id="land"
              type="fill"
              paint={{ "fill-color": "#cfdccb", "fill-opacity": 1 }}
            />
            <Layer
              id="border"
              type="line"
              paint={{ "line-color": "#167468", "line-width": 1.4 }}
            />
          </GeoJSONSource>
        ) : null}
        {items.map((place) => (
          <Marker
            key={place.id}
            id={place.id}
            lngLat={[place.longitude, place.latitude]}
            onPress={() => onSelect(place)}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  place.type === "hospital"
                    ? theme.colors.primary
                    : theme.colors.teal,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <Text size={12} weight="bold" style={{ color: "#fff" }}>
                {place.type === "hospital" ? "+" : "✚"}
              </Text>
            </View>
          </Marker>
        ))}
      </Map>
    </View>
  );
}
