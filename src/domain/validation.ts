import type {
  Profile,
  Condition,
  Medication,
  ClinicalEntry,
  Workspace,
} from "./models";
import { validDate } from "./dateTime";
export type ValidationCode =
  | "validation.profile"
  | "validation.required"
  | "validation.date"
  | "validation.interval"
  | "validation.detail";
export function profileError(p: Profile): ValidationCode | undefined {
  if (
    p.name.trim().length < 2 ||
    !Number.isInteger(p.age) ||
    p.age < 18 ||
    p.age > 120 ||
    !["female", "male", "unspecified"].includes(p.sex)
  )
    return "validation.profile";
}
export function conditionError(r: Condition): ValidationCode | undefined {
  if (!r.name.trim()) return "validation.required";
  if (!validDate(r.diagnosisDate)) return "validation.date";
}
export function medicationError(r: Medication): ValidationCode | undefined {
  if (!r.name.trim()) return "validation.required";
  if (!validDate(r.prescriptionDate)) return "validation.date";
  if (
    !r.treatment.lifelong &&
    (!validDate(r.treatment.startDate) ||
      !validDate(r.treatment.endDate) ||
      r.treatment.endDate < r.treatment.startDate)
  )
    return "validation.interval";
}
export function historyError(r: ClinicalEntry): ValidationCode | undefined {
  if (!r.title.trim()) return "validation.required";
  if (!validDate(r.createdDate)) return "validation.date";
  if (!r.detail.trim()) return "validation.detail";
}
export function assertWorkspace(value: unknown): asserts value is Workspace {
  const w = value as Workspace;
  if (
    !w ||
    w.version !== 2 ||
    typeof w.prepared !== "boolean" ||
    (w.profile !== null &&
      (!w.profile ||
        typeof w.profile.name !== "string" ||
        profileError(w.profile)))
  )
    throw new Error("Invalid workspace");
  const validators = {
    conditions: conditionError,
    medications: medicationError,
    history: historyError,
  };
  for (const key of ["conditions", "medications", "history"] as const) {
    if (!Array.isArray(w[key])) throw new Error("Invalid collection");
    const ids = new Set<string>();
    for (const record of w[key]) {
      if (
        !record ||
        typeof record.id !== "string" ||
        !record.id ||
        ids.has(record.id)
      )
        throw new Error("Invalid record");
      ids.add(record.id);
      try {
        if ((validators[key] as (r: typeof record) => unknown)(record))
          throw new Error("Invalid record");
      } catch {
        throw new Error("Invalid record");
      }
    }
  }
}
