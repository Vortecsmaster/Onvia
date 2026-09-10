import React from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { theme } from "../../theme";
import { Text } from "../primitives/Text";
import { Icon, IconName } from "../primitives/Icon";
import { IconButton } from "../primitives/IconButton";
import { BrandMark } from "./BrandMark";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { t } from "../../locales";
const navigation = [
  { path: "/" as const, key: "nav.profile" as const, icon: "user" },
  {
    path: "/assistant" as const,
    key: "nav.assistant" as const,
    icon: "message-circle",
  },
  { path: "/nearby" as const, key: "nav.nearby" as const, icon: "map-pin" },
  { path: "/about" as const, key: "nav.about" as const, icon: "info" },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions(),
    wide = width >= 1000,
    path = usePathname(),
    router = useRouter();
  const { value } = useWorkspace();
  const setup = path === "/preparation" || path === "/onboarding";
  const active =
    navigation.find((n) => n.path !== "/" && path.startsWith(n.path)) ??
    navigation[0];
  const nav = navigation.map((n) => (
    <Pressable
      key={n.path}
      accessibilityRole="tab"
      accessibilityLabel={t(n.key)}
      accessibilityState={{ selected: active.path === n.path }}
      onPress={() => router.navigate(n.path)}
      style={{
        minHeight: 54,
        padding: wide ? 13 : 6,
        borderRadius: 12,
        flex: wide ? undefined : 1,
        flexDirection: wide ? "row" : "column",
        alignItems: "center",
        justifyContent: wide ? "flex-start" : "center",
        gap: wide ? 12 : 4,
        backgroundColor:
          wide && active.path === n.path
            ? theme.colors.blueLight
            : "transparent",
      }}
    >
      <Icon
        name={n.icon as IconName}
        color={
          active.path === n.path ? theme.colors.primary : theme.colors.muted
        }
        size={21}
      />
      <Text
        size={wide ? 14 : 10}
        weight={active.path === n.path ? "bold" : "medium"}
        style={{
          color:
            active.path === n.path ? theme.colors.primary : theme.colors.muted,
        }}
      >
        {t(n.key)}
      </Text>
    </Pressable>
  ));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {wide && !setup && (
          <View
            style={{
              width: 244,
              padding: 26,
              borderRightWidth: 1,
              borderColor: theme.colors.line,
              backgroundColor: "#F8F7F1",
            }}
          >
            <BrandMark />
            <Text
              muted
              size={10}
              style={{ letterSpacing: 1, marginTop: 48, marginBottom: 18 }}
            >
              {t("nav.eyebrow")}
            </Text>
            <View style={{ gap: 8 }}>{nav}</View>
            <View style={{ flex: 1 }} />
            <View
              style={{
                padding: 18,
                borderRadius: 16,
                backgroundColor: "#EFEEE5",
                gap: 10,
              }}
            >
              <Icon name="shield" color={theme.colors.teal} />
              <Text size={13} weight="medium">
                {t("nav.noteTitle")}
              </Text>
              <Text size={12} muted>
                {t("nav.noteBody")}
              </Text>
            </View>
            <View style={{ marginTop: 24 }}>
              <Text size={13} weight="medium">
                {value?.profile?.name}
              </Text>
              <Text size={11} muted>
                {t("nav.personal")}
              </Text>
            </View>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: wide ? 72 : 58,
              borderBottomWidth: setup ? 0 : 1,
              borderColor: theme.colors.line,
              paddingHorizontal: wide ? 40 : 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {wide && !setup ? (
              <Text muted size={12}>
                {t("nav.space")} › {t(active.key)}
              </Text>
            ) : (
              <BrandMark width={setup ? 132 : 102} />
            )}
            {!setup && (
              <IconButton
                label={t("nav.profile")}
                icon="user"
                onPress={() => router.navigate("/")}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>{children}</View>
          {!wide && !setup && (
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 7,
                borderTopWidth: 1,
                borderColor: theme.colors.line,
                backgroundColor: "#fff",
              }}
            >
              {nav}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
