import React from "react";
import { Redirect } from "expo-router";
import ComponentGalleryScreen from "../features/component-gallery/ComponentGalleryScreen";
export default function GalleryRoute() {
  return __DEV__ ? <ComponentGalleryScreen /> : <Redirect href="/" />;
}
