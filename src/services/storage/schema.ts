export const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS conditions (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  diagnosis_date TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  prescription_date TEXT NOT NULL,
  lifelong INTEGER NOT NULL,
  start_date TEXT,
  end_date TEXT,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS history (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  created_date TEXT NOT NULL,
  detail TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  source TEXT NOT NULL
);
`;

export type MetaRow = { key: string; value: string };
export type ProfileRow = { id: number; name: string; age: number; sex: string };
export type ConditionRow = {
  id: string;
  name: string;
  diagnosis_date: string;
  sort_order: number;
};
export type MedicationRow = {
  id: string;
  name: string;
  prescription_date: string;
  lifelong: number;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
};
export type HistoryRow = {
  id: string;
  title: string;
  created_date: string;
  detail: string;
  sort_order: number;
};
export type PlaceRow = {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  source: string;
};
