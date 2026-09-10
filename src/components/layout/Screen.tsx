import React from "react";
import { View, useWindowDimensions } from "react-native";
import { ScrollArea, ScrollAreaProps } from "./ScrollArea";

export function Screen({
  children,
  testID,
  showProgress,
  onRefresh,
  refreshing,
  compact = false,
}: {
  children: React.ReactNode;
  testID?: string;
  showProgress?: boolean;
  onRefresh?: ScrollAreaProps["onRefresh"];
  refreshing?: boolean;
  compact?: boolean;
}) {
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  return (
    <ScrollArea
      testID={testID}
      showProgress={showProgress}
      onRefresh={onRefresh}
      refreshing={refreshing}
      contentContainerStyle={{
        padding: wide ? (compact ? 28 : 40) : compact ? 16 : 22,
        paddingBottom: compact ? 20 : 32,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 1080,
          alignSelf: "center",
          gap: compact ? 16 : 26,
        }}
      >
        {children}
      </View>
    </ScrollArea>
  );
}
