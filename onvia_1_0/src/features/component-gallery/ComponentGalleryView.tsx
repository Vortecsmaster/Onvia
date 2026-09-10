import { appConfig } from "../../config/app";
import React from "react";
import { View } from "react-native";
import { Screen } from "../../components/layout/Screen";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import { ScrollArea } from "../../components/layout/ScrollArea";
import { Section } from "../../components/layout/Section";
import { Card } from "../../components/primitives/Card";
import { Badge } from "../../components/primitives/Badge";
import { Button } from "../../components/primitives/Button";
import { Text } from "../../components/primitives/Text";
import { Divider } from "../../components/primitives/Divider";
import {
  Input,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  Toggle,
  DatePicker,
  TimePicker,
  DateTimePicker,
  SearchInput,
} from "../../components/forms";
import { ProgressBar } from "../../components/feedback/ProgressBar";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import type { useGalleryController } from "./useGalleryController";
import { theme } from "../../theme";
import { t } from "../../locales";
export function ComponentGalleryView(
  c: ReturnType<typeof useGalleryController>,
) {
  const options = [
    { value: "a", label: t("gallery.optionA") },
    { value: "b", label: t("gallery.optionB") },
  ];
  return (
    <Screen>
      <ScreenHeader
        title={t("gallery.title")}
        description={t("gallery.body", { name: appConfig.name })}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {[
          theme.colors.primary,
          theme.colors.sand,
          theme.colors.background,
          theme.colors.ink,
        ].map((color) => (
          <View key={color} style={{ gap: 8 }}>
            <View
              style={{
                width: 80,
                height: 55,
                borderRadius: 12,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: theme.colors.line,
              }}
            />
            <Text size={12}>{color}</Text>
          </View>
        ))}
      </View>
      <Card>
        <Badge label={t("about.tagline")} />
        <Input
          label={t("gallery.input")}
          value={c.text}
          onChangeText={c.setText}
          required
        />
        <Input
          label={t("gallery.disabled")}
          value={c.text}
          onChangeText={c.setText}
          disabled
        />
        <TextArea
          label={t("gallery.textarea")}
          value={c.longText}
          onChangeText={c.setLongText}
        />
        <SearchInput value={c.text} onChangeText={c.setText} />
        <Select
          label={t("gallery.select")}
          options={options}
          value={c.option}
          onChange={c.setOption}
        />
        <Checkbox
          label={t("gallery.checkbox")}
          value={c.checked}
          onChange={c.setChecked}
        />
        <Toggle
          label={t("gallery.toggle")}
          value={c.enabled}
          onChange={c.setEnabled}
        />
        <RadioGroup
          label={t("gallery.radio")}
          value={c.radio}
          options={options}
          onChange={c.setRadio}
        />
        <Divider />
        <DatePicker
          label={t("gallery.date")}
          value={c.date}
          onChange={c.setDate}
        />
        <TimePicker
          label={t("gallery.time12")}
          value={c.time}
          onChange={c.setTime}
          hourCycle={12}
        />
        <TimePicker
          label={t("gallery.time24")}
          value={c.time}
          onChange={c.setTime}
          hourCycle={24}
        />
        <DateTimePicker
          label={t("gallery.datetime")}
          value={c.datetime}
          onChange={c.setDatetime}
        />
        {(["primary", "secondary", "ghost", "danger"] as const).map(
          (variant) => (
            <Button
              key={variant}
              label={t(`gallery.${variant}`)}
              variant={variant}
              onPress={c.action}
            />
          ),
        )}
        <Button label={t("gallery.disabled")} disabled onPress={c.action} />
        <Button label={t("common.saving")} loading onPress={c.action} />
        <ProgressBar value={65} label={t("preparation.working")} />
      </Card>
      <Section title={t("gallery.scroll")}>
        <Text muted>{t("gallery.scrollBody")}</Text>
        <ScrollArea
          testID="gallery-scroll"
          showProgress
          refreshing={c.refreshing}
          onRefresh={c.refresh}
          style={{
            height: 280,
            borderRadius: theme.radius.card,
            borderWidth: 1,
            borderColor: theme.colors.line,
            backgroundColor: theme.colors.surface,
          }}
          contentContainerStyle={{ padding: 18, gap: 14 }}
        >
          {Array.from({ length: 18 }, (_, index) => (
            <Text key={index}>{t("gallery.scrollItem", { n: index + 1 })}</Text>
          ))}
        </ScrollArea>
      </Section>
      <EmptyState title={t("common.emptyTitle")} body={t("common.emptyBody")} />
      <ErrorState message={t("errors.generic")} onRetry={c.action} />
    </Screen>
  );
}
