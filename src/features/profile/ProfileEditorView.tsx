import React from "react";
import { Screen } from "../../components/layout/Screen";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import { FormLayout } from "../../components/layout/FormLayout";
import { Card } from "../../components/primitives/Card";
import { Button } from "../../components/primitives/Button";
import { ErrorState } from "../../components/feedback/ErrorState";
import { ProfileForm } from "./components/ProfileForm";
import type { useProfileEditorController } from "./useProfileEditorController";
import { t } from "../../locales";
export function ProfileEditorView(
  c: ReturnType<typeof useProfileEditorController>,
) {
  return (
    <Screen compact>
      <FormLayout>
        <ScreenHeader
          title={t("profile.edit")}
          onBack={c.busy ? undefined : c.back}
        />
        <Card>
          <ProfileForm
            value={c.draft}
            onChange={c.setDraft}
            disabled={c.busy}
          />
        </Card>
        {c.error && <ErrorState message={c.error} />}
        <Button
          label={t("common.save")}
          loading={c.busy}
          disabled={!c.valid}
          onPress={c.save}
        />
        <Button
          label={t("common.cancel")}
          disabled={c.busy}
          variant="secondary"
          onPress={c.back}
        />
      </FormLayout>
    </Screen>
  );
}
