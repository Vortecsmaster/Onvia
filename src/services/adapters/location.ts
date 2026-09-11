import * as Location from "expo-location";
import type { LocationService, PlacesService } from "../../domain/contracts";
import type { Place } from "../../domain/models";
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

export function createLocalPlaces(list: () => Place[]): PlacesService {
  return { list };
}
