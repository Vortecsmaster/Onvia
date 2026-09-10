import React from "react";
import { NearbyView } from "./NearbyView";
import { useNearbyController } from "./useNearbyController";
export default function NearbyScreen() {
  return <NearbyView {...useNearbyController()} />;
}
