import React, { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque/700Bold";
import { AppProviders } from "../providers/AppProviders";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { AppShell } from "../components/layout/AppShell";
import { LoadingState } from "../components/feedback/LoadingState";
import { ErrorState } from "../components/feedback/ErrorState";
import { Screen } from "../components/layout/Screen";
import { t } from "../locales";
export { ErrorBoundary } from "expo-router";

function Navigator() {
  const { value, loading, failed, reload } = useWorkspace();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading || failed || !value) return;
    if (!value.prepared && path !== "/preparation") {
      router.replace("/preparation");
      return;
    }
    if (
      value.prepared &&
      !value.profile &&
      path !== "/onboarding" &&
      path !== "/preparation"
    ) {
      router.replace("/onboarding");
      return;
    }
    if (value.profile && (path === "/onboarding" || path === "/preparation")) {
      router.replace("/");
    }
  }, [failed, loading, path, router, value]);

  if (loading) return <LoadingState />;
  if (failed || !value)
    return (
      <Screen>
        <ErrorState message={t("errors.load")} onRetry={reload} />
      </Screen>
    );

  return (
    <AppShell>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#FAF8F1" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="preparation" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="conditions/index" />
        <Stack.Screen name="conditions/new" />
        <Stack.Screen name="conditions/[id]" />
        <Stack.Screen name="medications/index" />
        <Stack.Screen name="medications/new" />
        <Stack.Screen name="medications/[id]" />
        <Stack.Screen name="clinical-history/index" />
        <Stack.Screen name="clinical-history/new" />
        <Stack.Screen name="clinical-history/[id]" />
        <Stack.Screen name="component-gallery" />
      </Stack>
    </AppShell>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    BricolageGrotesque_700Bold,
  });
  if (!loaded && !error) return <LoadingState />;
  return (
    <AppProviders>
      <Navigator />
    </AppProviders>
  );
}
