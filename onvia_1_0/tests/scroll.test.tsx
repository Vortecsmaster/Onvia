import React from "react";
import { RefreshControl, Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollArea } from "../src/components/layout/ScrollArea";
import { Screen } from "../src/components/layout/Screen";

function renderWithSafeArea(ui: React.ReactElement) {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      {ui}
    </SafeAreaProvider>,
  );
}

function scroll(testID: string, y: number) {
  fireEvent.scroll(screen.getByTestId(testID), {
    nativeEvent: {
      contentOffset: { y, x: 0 },
      contentSize: { height: 2000, width: 390 },
      layoutMeasurement: { height: 700, width: 390 },
    },
  });
}

test("scroll area renders children and exposes testID", () => {
  renderWithSafeArea(
    <ScrollArea testID="workspace-scroll">
      <Text>Contenido visible</Text>
    </ScrollArea>,
  );
  expect(screen.getByTestId("workspace-scroll")).toBeTruthy();
  expect(screen.getByText("Contenido visible")).toBeTruthy();
});

test("back to top appears after the threshold and hides below it", () => {
  renderWithSafeArea(
    <ScrollArea testID="workspace-scroll">
      <Text>Contenido visible</Text>
    </ScrollArea>,
  );
  expect(screen.queryByLabelText("Volver arriba")).toBeNull();
  scroll("workspace-scroll", 520);
  expect(screen.getByRole("button", { name: "Volver arriba" })).toBeTruthy();
  scroll("workspace-scroll", 120);
  expect(screen.queryByLabelText("Volver arriba")).toBeNull();
});

test("refresh control is present when refreshing", () => {
  const onRefresh = jest.fn();
  const view = renderWithSafeArea(
    <ScrollArea testID="workspace-scroll" refreshing onRefresh={onRefresh}>
      <Text>Contenido visible</Text>
    </ScrollArea>,
  );
  const control = view.UNSAFE_getByType(RefreshControl);
  expect(control.props.refreshing).toBe(true);
  expect(control.props.accessibilityLabel).toBe("Actualizar");
  control.props.onRefresh();
  expect(onRefresh).toHaveBeenCalledTimes(1);
});

test("screen still renders its children", () => {
  renderWithSafeArea(
    <Screen testID="profile-screen">
      <Text>Perfil</Text>
    </Screen>,
  );
  expect(screen.getByTestId("profile-screen")).toBeTruthy();
  expect(screen.getByText("Perfil")).toBeTruthy();
});
