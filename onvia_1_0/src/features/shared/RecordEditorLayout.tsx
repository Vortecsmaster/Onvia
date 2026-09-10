import React from "react";
import { Screen } from "../../components/layout/Screen";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import { FormLayout } from "../../components/layout/FormLayout";
import { Card } from "../../components/primitives/Card";
import { Button } from "../../components/primitives/Button";
import { ErrorState } from "../../components/feedback/ErrorState";
import { EmptyState } from "../../components/feedback/EmptyState";
import { t } from "../../locales";
export function RecordEditorLayout({
  title,
  children,
  busy,
  error,
  missing,
  back,
  save,
}: {
  title: string;
  children: React.ReactNode;
  busy: boolean;
  error: string;
  missing: boolean;
  back: () => void;
  save: () => void;
}) {
  return (
    <Screen compact>
      <FormLayout>
        <ScreenHeader title={title} onBack={busy ? undefined : back} />
        {missing ? (
          <EmptyState
            title={t("common.notFound")}
            body={t("common.notFoundBody")}
            action={{ label: t("common.back"), onPress: back }}
          />
        ) : (
          <>
            <Card>{children}</Card>
            {error && <ErrorState message={error} />}
            <Button
              label={t("common.save")}
              icon="check"
              loading={busy}
              onPress={save}
            />
            <Button
              label={t("common.cancel")}
              variant="secondary"
              disabled={busy}
              onPress={back}
            />
          </>
        )}
      </FormLayout>
    </Screen>
  );
}
