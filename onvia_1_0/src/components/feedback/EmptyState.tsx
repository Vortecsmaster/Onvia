import React from "react";
import { Card } from "../primitives/Card";
import { Heading } from "../primitives/Heading";
import { Text } from "../primitives/Text";
import { Button } from "../primitives/Button";
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <Card>
      <Heading size={22}>{title}</Heading>
      <Text muted>{body}</Text>
      {action && <Button {...action} variant="secondary" />}
    </Card>
  );
}
