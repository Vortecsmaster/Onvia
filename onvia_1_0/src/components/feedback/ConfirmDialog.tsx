import React from "react";
import { ModalSheet } from "../layout/ModalSheet";
import { Text } from "../primitives/Text";
import { Button } from "../primitives/Button";
import { ErrorState } from "./ErrorState";
import { t } from "../../locales";
export function ConfirmDialog({
  visible,
  name,
  onCancel,
  onConfirm,
  busy,
  error,
}: {
  visible: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  error?: string;
}) {
  return (
    <ModalSheet
      visible={visible}
      title={t("common.deleteTitle")}
      onClose={() => {
        if (!busy) onCancel();
      }}
    >
      <Text>{t("common.deleteBody", { name })}</Text>
      {error && <ErrorState message={error} />}
      <Button
        label={t("common.delete")}
        variant="danger"
        loading={busy}
        onPress={onConfirm}
      />
      <Button
        label={t("common.keep")}
        variant="secondary"
        disabled={busy}
        onPress={onCancel}
      />
    </ModalSheet>
  );
}
