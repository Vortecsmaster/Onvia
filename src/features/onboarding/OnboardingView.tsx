import React, { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/layout/Screen";
import { Card } from "../../components/primitives/Card";
import { Badge } from "../../components/primitives/Badge";
import { Heading } from "../../components/primitives/Heading";
import { Text } from "../../components/primitives/Text";
import { Button } from "../../components/primitives/Button";
import { Checkbox } from "../../components/forms/Checkbox";
import { ErrorState } from "../../components/feedback/ErrorState";
import { ModalSheet } from "../../components/layout/ModalSheet";
import { ProfileForm } from "../profile/components/ProfileForm";
import type { useProfileEditorController } from "../profile/useProfileEditorController";
import { t } from "../../locales";
export function OnboardingView(
  c: ReturnType<typeof useProfileEditorController>,
) {
  const [terms, setTerms] = useState(false);
  return (
    <Screen compact>
      <View
        style={{ width: "100%", maxWidth: 470, alignSelf: "center", gap: 10 }}
      >
        <View style={{ gap: 4 }}>
          <Badge label={t("onboarding.step")} />
          <Heading size={22}>{t("onboarding.title")}</Heading>
          <Text muted size={13}>
            {t("onboarding.body")}
          </Text>
        </View>
        <Card style={{ gap: 10, padding: 12 }}>
          <ProfileForm
            value={c.draft}
            onChange={c.setDraft}
            disabled={c.busy}
          />
          <Checkbox
            label={t("onboarding.consent")}
            value={c.consent}
            onChange={c.setConsent}
            disabled={c.busy}
          />
          <Button
            label={t("onboarding.termsTitle")}
            variant="ghost"
            compact
            onPress={() => setTerms(true)}
          />
        </Card>
        <ModalSheet
          visible={terms}
          title={t("onboarding.termsTitle")}
          onClose={() => setTerms(false)}
        >
          <Text muted size={14}>
            {t("onboarding.termsBody")}
          </Text>
        </ModalSheet>
        {c.error && <ErrorState message={c.error} />}
        <Button
          label={t("onboarding.action")}
          icon="arrow-right"
          disabled={!c.valid}
          loading={c.busy}
          onPress={c.save}
        />
      </View>
    </Screen>
  );
}
