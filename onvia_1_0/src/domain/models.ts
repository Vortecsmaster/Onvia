export type Sex = "female" | "male" | "unspecified";
export interface Profile {
  name: string;
  age: number;
  sex: Sex;
}
export interface Condition {
  id: string;
  name: string;
  diagnosisDate: string;
}
export type Treatment =
  { lifelong: true } | { lifelong: false; startDate: string; endDate: string };
export interface Medication {
  id: string;
  name: string;
  prescriptionDate: string;
  treatment: Treatment;
}
export interface ClinicalEntry {
  id: string;
  title: string;
  createdDate: string;
  detail: string;
}
export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}
export interface Place {
  id: string;
  name: string;
  type: "hospital" | "pharmacy";
  latitude: number;
  longitude: number;
  source: string;
}
export interface Workspace {
  version: 2;
  profile: Profile | null;
  prepared: boolean;
  conditions: Condition[];
  medications: Medication[];
  history: ClinicalEntry[];
}
export type Collection = "conditions" | "medications" | "history";
export interface RecordMap {
  conditions: Condition;
  medications: Medication;
  history: ClinicalEntry;
}
export type HealthRecord = RecordMap[Collection];
export interface LocalDateTime {
  date: string;
  time: string;
}
export interface ModelProgress {
  id: "medpsy" | "whisper";
  progress: number;
}
