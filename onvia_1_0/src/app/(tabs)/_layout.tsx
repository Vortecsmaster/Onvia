import React from "react";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { flex: 1 } }}
      tabBar={() => null}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="assistant" />
      <Tabs.Screen name="nearby" />
      <Tabs.Screen name="about" />
    </Tabs>
  );
}
