import React from "react";
import { ModalSheet } from "../../../components/layout/ModalSheet";
import { Text } from "../../../components/primitives/Text";
import { Button } from "../../../components/primitives/Button";
import { Place } from "../../../domain/models";
import { t } from "../../../locales";
export function PlaceDetails({
  place,
  onClose,
  onDirections,
}: {
  place: Place | null;
  onClose: () => void;
  onDirections: (p: Place) => void;
}) {
  return (
    <ModalSheet visible={!!place} title={place?.name || ""} onClose={onClose}>
      {place && (
        <>
          <Text muted>
            {t(`nearby.${place.type}`)} · {t("nearby.city")}
          </Text>
          <Button
            label={t("nearby.destination")}
            icon="navigation"
            onPress={() => onDirections(place)}
          />
        </>
      )}
    </ModalSheet>
  );
}
