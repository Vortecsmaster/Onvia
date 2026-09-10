import React from "react";
import { Card } from "../primitives/Card";
import { Text } from "../primitives/Text";
import { Button } from "../primitives/Button";
import { theme } from "../../theme";
import { t } from "../../locales";
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card style={{ backgroundColor: theme.colors.errorLight }}>
      <Text accessibilityRole="alert" style={{ color: theme.colors.error }}>
        {message}
      </Text>
      {onRetry && (
        <Button
          label={t("common.retry")}
          variant="secondary"
          onPress={onRetry}
        />
      )}
    </Card>
  );
}
