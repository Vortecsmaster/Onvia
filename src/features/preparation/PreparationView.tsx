import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { Screen } from "../../components/layout/Screen";
import { Badge } from "../../components/primitives/Badge";
import { Heading } from "../../components/primitives/Heading";
import { Text } from "../../components/primitives/Text";
import { Button } from "../../components/primitives/Button";
import { BrandMark } from "../../components/layout/BrandMark";
import { ErrorState } from "../../components/feedback/ErrorState";
import { ModelCard } from "./components/ModelCard";
import type { usePreparationController } from "./usePreparationController";
import { t } from "../../locales";
export function PreparationView(
  c: ReturnType<typeof usePreparationController>,
) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: -6,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);
  return (
    <Screen compact>
      <View
        style={{
          width: "100%",
          maxWidth: 470,
          alignSelf: "center",
          gap: 16,
        }}
      >
        <View style={{ gap: 10 }}>
          <Badge label={t("preparation.step")} />
          <Heading size={30}>{t("preparation.title")}</Heading>
          <Text muted size={14}>
            {t("preparation.body")}
          </Text>
        </View>
        <Animated.View
          style={{
            alignSelf: "center",
            transform: [{ translateY: pulse }],
            width: 112,
            height: 112,
            borderRadius: 56,
            backgroundColor: "#EFEEE7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandMark symbol width={72} />
        </Animated.View>
        <ModelCard models={c.models} busy={c.busy} complete={c.complete} />
        {c.error && <ErrorState message={c.error} />}
        <Button
          label={t(
            c.complete
              ? "common.continue"
              : c.busy
                ? "preparation.working"
                : "preparation.action",
          )}
          loading={c.busy}
          onPress={c.complete ? c.continue : c.start}
          icon={c.complete ? "arrow-right" : "arrow-down"}
        />
        <Text muted size={12} style={{ textAlign: "center" }}>
          {t("preparation.footer")}
        </Text>
      </View>
    </Screen>
  );
}
