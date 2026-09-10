import * as Location from "expo-location";
import { Linking } from "react-native";
import type { LocationService, PlacesService } from "../../domain/contracts";
import type { Place } from "../../domain/models";
import places from "../../data/places.json";
import { abortError } from "./simulated";
export const deviceLocation: LocationService = {
  async current(signal) {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (signal.aborted) throw abortError();
    if (permission.status !== "granted") throw new Error("permission-denied");
    const value = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    if (signal.aborted) throw abortError();
    return [value.coords.latitude, value.coords.longitude];
  },
};
export const localPlaces: PlacesService = {
  list: () => places as Place[],
  openDirections: (p) =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`,
    ),
  openSource: (p) => Linking.openURL(p.source),
};
