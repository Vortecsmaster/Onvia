import { useState } from "react";
import { useServices } from "../../providers/ServicesProvider";
import { useTask } from "../shared/useTask";
import { Place } from "../../domain/models";
import { appConfig } from "../../config/app";
import { t } from "../../locales";
export type PlaceFilter = "all" | "hospital" | "pharmacy";
export function useNearbyController() {
  const { location, places } = useServices(),
    task = useTask();
  const [filter, setFilter] = useState<PlaceFilter>("all"),
    [center, setCenter] = useState<[number, number]>(appConfig.mapCenter),
    [locationLabel, setLocationLabel] = useState(t("nearby.city")),
    [selected, setSelected] = useState<Place | null>(null);
  return {
    ...task,
    filter,
    setFilter,
    center,
    locationLabel,
    selected,
    select: setSelected,
    items: places.list().filter((p) => filter === "all" || p.type === filter),
    locate: () =>
      task.run(async (signal) => {
        try {
          const position = await location.current(signal);
          if (!signal.aborted) {
            setCenter(position);
            setLocationLabel(t("nearby.current"));
          }
        } catch (e) {
          if (signal.aborted) return;
          setCenter(appConfig.mapCenter);
          setLocationLabel(
            t(
              e instanceof Error && e.message === "permission-denied"
                ? "errors.locationDenied"
                : "errors.location",
            ),
          );
        }
      }),
    directions: (place: Place) =>
      task.run(async () => {
        await places.openDirections(place);
      }),
    source: (place: Place) =>
      task.run(async () => {
        await places.openSource(place);
      }),
  };
}
