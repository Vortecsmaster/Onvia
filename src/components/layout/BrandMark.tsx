import React from "react";
import { Image } from "react-native";
import { appConfig } from "../../config/app";
export function BrandMark({
  symbol = false,
  width = 145,
}: {
  symbol?: boolean;
  width?: number;
}) {
  return (
    <Image
      accessibilityLabel={appConfig.name}
      source={
        symbol
          ? require("../../../assets/symbol.png")
          : require("../../../assets/logo.png")
      }
      resizeMode="contain"
      style={{ width, height: symbol ? width * 0.8 : width * 0.302 }}
    />
  );
}
