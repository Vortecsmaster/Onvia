import {
  Collection,
  HealthRecord,
  Condition,
  Medication,
  ClinicalEntry,
} from "../../domain/models";
import { theme } from "../../theme";
import { IconName } from "../../components/primitives/Icon";
import { TextKey, t } from "../../locales";
import { formatDate } from "../../domain/dateTime";
export const recordMeta: Record<
  Collection,
  {
    prefix: "conditions" | "medications" | "history";
    icon: IconName;
    color: string;
    background: string;
    path: "/conditions" | "/medications" | "/clinical-history";
  }
> = {
  conditions: {
    prefix: "conditions",
    icon: "heart",
    color: theme.colors.primary,
    background: theme.colors.blueLight,
    path: "/conditions",
  },
  medications: {
    prefix: "medications",
    icon: "plus-square",
    color: theme.colors.teal,
    background: theme.colors.tealLight,
    path: "/medications",
  },
  history: {
    prefix: "history",
    icon: "file-text",
    color: "#8B5B26",
    background: "#F4EAD7",
    path: "/clinical-history",
  },
};
export function recordName(record: HealthRecord) {
  return "title" in record ? record.title : record.name;
}
export function recordDate(kind: Collection, record: HealthRecord) {
  return kind === "conditions"
    ? (record as Condition).diagnosisDate
    : kind === "medications"
      ? (record as Medication).prescriptionDate
      : (record as ClinicalEntry).createdDate;
}
export function recordSubtitle(kind: Collection, record: HealthRecord) {
  return `${t(`${recordMeta[kind].prefix}.datePrefix` as TextKey)} · ${formatDate(recordDate(kind, record))}`;
}
