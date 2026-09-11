import type { Workspace, Sex } from "../../domain/models";
import { assertWorkspace } from "../../domain/validation";
interface LegacyRecord {
  id: string;
  name: string;
  date: string;
  detail?: string;
  lifelong?: boolean;
  start?: string;
  end?: string;
}
interface LegacyWorkspace {
  profile: { name: string; age: string; sex: string };
  records: {
    conditions: LegacyRecord[];
    medications: LegacyRecord[];
    history: LegacyRecord[];
  };
}
export function migrateLegacy(raw: string): Workspace {
  const old = JSON.parse(raw) as LegacyWorkspace;
  const sexes: Record<string, Sex> = {
    Femenino: "female",
    Masculino: "male",
    "Prefiero no decirlo": "unspecified",
  };
  const value: Workspace = {
    version: 2,
    prepared: true,
    termsAccepted: true,
    profile: {
      name: old.profile.name,
      age: Number(old.profile.age),
      sex: sexes[old.profile.sex],
    },
    conditions: old.records.conditions.map((r) => ({
      id: r.id,
      name: r.name,
      diagnosisDate: r.date,
    })),
    medications: old.records.medications.map((r) => ({
      id: r.id,
      name: r.name,
      prescriptionDate: r.date,
      treatment: r.lifelong
        ? { lifelong: true }
        : { lifelong: false, startDate: r.start!, endDate: r.end! },
    })),
    history: old.records.history.map((r) => ({
      id: r.id,
      title: r.name,
      createdDate: r.date,
      detail: r.detail!,
    })),
  };
  assertWorkspace(value);
  return value;
}
