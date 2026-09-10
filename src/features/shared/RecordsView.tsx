import React from "react";
import { Screen } from "../../components/layout/Screen";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import { Button } from "../../components/primitives/Button";
import { SearchInput } from "../../components/forms/SearchInput";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { RecordList } from "./RecordList";
import type { useRecordsController } from "./useRecordsController";
import { recordMeta, recordName } from "./recordPresentation";
import { t, countText } from "../../locales";
export function RecordsView(c: ReturnType<typeof useRecordsController>) {
  return (
    <Screen compact>
      <ScreenHeader
        title={t(`${recordMeta[c.kind].prefix}.title`)}
        description={countText("record", c.count)}
        onBack={c.back}
        action={<Button label={t("common.add")} icon="plus" onPress={c.add} />}
      />
      <SearchInput value={c.query} onChangeText={c.setQuery} />
      {c.records.length ? (
        <RecordList
          kind={c.kind}
          records={c.records}
          onEdit={c.edit}
          onDelete={c.selectDelete}
        />
      ) : (
        <EmptyState
          title={t(c.query ? "common.noResults" : "common.emptyTitle")}
          body={t(c.query ? "common.noResultsBody" : "common.emptyBody")}
        />
      )}
      <ConfirmDialog
        visible={!!c.selected}
        name={c.selected ? recordName(c.selected) : ""}
        onCancel={c.cancelDelete}
        onConfirm={c.remove}
        busy={c.busy}
        error={c.error}
      />
    </Screen>
  );
}
