import React from "react";
import { View } from "react-native";
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
  return (
    <Screen compact>
      <View
        style={{
          width: "100%",
          maxWidth: 470,
          alignSelf: "center",
          gap: 10,
        }}
      >
        <View style={{ gap: 6 }}>
          <Badge label={t("preparation.step")} />
          <Heading size={22}>{t("preparation.title")}</Heading>
          <Text muted size={13}>
            {t("preparation.body")}
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#EFEEE7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandMark symbol width={40} />
        </View>
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
        <Text muted size={11} style={{ textAlign: "center" }}>
          {t("preparation.footer")}
        </Text>
      </View>
    </Screen>
  );
}
