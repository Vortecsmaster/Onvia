import fs from "node:fs";
import { createLocalPlaces } from "../src/services/adapters/location";
import places from "../src/data/places.json";
import { Place } from "../src/domain/models";

test("places adapter never opens google maps", () => {
  const source = fs.readFileSync("src/services/adapters/location.ts", "utf8");
  expect(source).not.toMatch(/google\.com/i);
  const list = createLocalPlaces(() => places as Place[]).list();
  expect(list).toHaveLength(16);
});

test("nearby map and controller stay on openstreetmap data", () => {
  const map = fs.readFileSync(
    "src/features/nearby/components/PlacesMap.tsx",
    "utf8",
  );
  const controller = fs.readFileSync(
    "src/features/nearby/useNearbyController.ts",
    "utf8",
  );
  expect(map).not.toMatch(/leaflet|webview|google\.com|unpkg/i);
  expect(controller).not.toMatch(/google\.com/i);
  expect(map).toMatch(/maplibre/i);
  expect(map).toMatch(/openfreemap/i);
  const style = fs.readFileSync(
    "src/features/nearby/components/mapStyle.ts",
    "utf8",
  );
  expect(style).toMatch(/tiles\.openfreemap\.org\/styles\/liberty/);
});
