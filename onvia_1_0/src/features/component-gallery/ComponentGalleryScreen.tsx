import React from "react";
import { ComponentGalleryView } from "./ComponentGalleryView";
import { useGalleryController } from "./useGalleryController";
export default function ComponentGalleryScreen() {
  return <ComponentGalleryView {...useGalleryController()} />;
}
