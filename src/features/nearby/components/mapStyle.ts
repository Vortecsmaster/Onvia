import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import { appConfig } from "../../../config/app";

export const OPENFREEMAP_STYLE =
  "https://tiles.openfreemap.org/styles/liberty";

export const panamaBounds: [number, number, number, number] = [
  appConfig.mapBounds.west,
  appConfig.mapBounds.south,
  appConfig.mapBounds.east,
  appConfig.mapBounds.north,
];

export const panamaStyle: StyleSpecification = {
  version: 8,
  name: "ONVIA Panamá",
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#e7ece7" },
    },
  ],
};
