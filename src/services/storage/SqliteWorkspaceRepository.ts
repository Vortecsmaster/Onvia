import type { KeyValueStorage, WorkspaceRepository } from "../../domain/contracts";
import type {
  Condition,
  Medication,
  ClinicalEntry,
  Place,
  Profile,
  Workspace,
} from "../../domain/models";
import { assertWorkspace } from "../../domain/validation";
import { appConfig } from "../../config/app";
import { createWorkspace } from "./seeds";
import { migrateLegacy } from "./migration";
import { SCHEMA } from "./schema";
import type {
  ConditionRow,
  HistoryRow,
  MedicationRow,
  MetaRow,
  PlaceRow,
  ProfileRow,
} from "./schema";
import type { SqlDatabase } from "./database";
import placesSeed from "../../data/places.json";

function emptyWorkspace(): Workspace {
  return {
    version: 2,
    profile: null,
    prepared: false,
    termsAccepted: false,
    conditions: [],
    medications: [],
    history: [],
  };
}

function metaBool(rows: MetaRow[], key: string, fallback = false) {
  const row = rows.find((r) => r.key === key);
  if (!row) return fallback;
  return row.value === "1" || row.value === "true";
}

function toWorkspace(
  rows: MetaRow[],
  profile: ProfileRow | null,
  conditions: ConditionRow[],
  medications: MedicationRow[],
  history: HistoryRow[],
): Workspace {
  return {
    version: 2,
    prepared: metaBool(rows, "prepared"),
    termsAccepted: metaBool(rows, "termsAccepted"),
    profile: profile
      ? {
          name: profile.name,
          age: profile.age,
          sex: profile.sex as Profile["sex"],
        }
      : null,
    conditions: conditions
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({
        id: r.id,
        name: r.name,
        diagnosisDate: r.diagnosis_date,
      })),
    medications: medications
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({
        id: r.id,
        name: r.name,
        prescriptionDate: r.prescription_date,
        treatment: r.lifelong
          ? { lifelong: true }
          : {
              lifelong: false,
              startDate: r.start_date || "",
              endDate: r.end_date || "",
            },
      })),
    history: history
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({
        id: r.id,
        title: r.title,
        createdDate: r.created_date,
        detail: r.detail,
      })),
  };
}

export function createSqliteWorkspaceRepository(
  db: SqlDatabase,
  kv?: KeyValueStorage,
): WorkspaceRepository & { listPlaces(): Promise<Place[]> } {
  let ready: Promise<void> | null = null;

  async function ensure() {
    if (!ready) {
      ready = (async () => {
        await db.execAsync(SCHEMA);
        const count = await db.getFirstAsync<{ n: number }>(
          "SELECT COUNT(*) as n FROM places",
        );
        if (!count || count.n === 0) {
          for (const place of placesSeed as Place[]) {
            await db.runAsync(
              "INSERT INTO places (id, name, type, latitude, longitude, source) VALUES (?, ?, ?, ?, ?, ?)",
              [
                place.id,
                place.name,
                place.type,
                place.latitude,
                place.longitude,
                place.source,
              ],
            );
          }
        }
      })();
    }
    await ready;
  }

  async function read(): Promise<Workspace | null> {
    const initialized = await db.getFirstAsync<MetaRow>(
      "SELECT key, value FROM meta WHERE key = ?",
      ["initialized"],
    );
    if (!initialized) return null;
    const [meta, profile, conditions, medications, history] = await Promise.all(
      [
        db.getAllAsync<MetaRow>("SELECT key, value FROM meta"),
        db.getFirstAsync<ProfileRow>("SELECT * FROM profile WHERE id = 1"),
        db.getAllAsync<ConditionRow>("SELECT * FROM conditions"),
        db.getAllAsync<MedicationRow>("SELECT * FROM medications"),
        db.getAllAsync<HistoryRow>("SELECT * FROM history"),
      ],
    );
    const value = toWorkspace(
      meta,
      profile,
      conditions,
      medications,
      history,
    );
    assertWorkspace(value);
    return value;
  }

  async function write(value: Workspace) {
    assertWorkspace(value);
    await db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM profile");
      await db.runAsync("DELETE FROM conditions");
      await db.runAsync("DELETE FROM medications");
      await db.runAsync("DELETE FROM history");
      await db.runAsync(
        "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
        ["initialized", "1"],
      );
      await db.runAsync(
        "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
        ["prepared", value.prepared ? "1" : "0"],
      );
      await db.runAsync(
        "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
        ["termsAccepted", value.termsAccepted ? "1" : "0"],
      );
      if (value.profile) {
        await db.runAsync(
          "INSERT INTO profile (id, name, age, sex) VALUES (1, ?, ?, ?)",
          [value.profile.name, value.profile.age, value.profile.sex],
        );
      }
      await insertConditions(db, value.conditions);
      await insertMedications(db, value.medications);
      await insertHistory(db, value.history);
    });
  }

  async function importFromKv() {
    if (!kv) return null;
    const current = await kv.getItem(appConfig.storageKey);
    if (current !== null) {
      const parsed: unknown = JSON.parse(current);
      if (
        parsed &&
        typeof parsed === "object" &&
        !("termsAccepted" in parsed)
      ) {
        (parsed as Workspace).termsAccepted = true;
      }
      assertWorkspace(parsed);
      return parsed;
    }
    const legacy = await kv.getItem(appConfig.legacyStorageKey);
    if (legacy !== null) return migrateLegacy(legacy);
    return null;
  }

  return {
    async load() {
      await ensure();
      const existing = await read();
      if (existing) return existing;
      const migrated = await importFromKv();
      const value = migrated ?? createWorkspace();
      await write(value);
      return value;
    },
    async save(value) {
      await ensure();
      await write(value);
    },
    async listPlaces() {
      await ensure();
      const rows = await db.getAllAsync<PlaceRow>(
        "SELECT * FROM places ORDER BY name",
      );
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type as Place["type"],
        latitude: r.latitude,
        longitude: r.longitude,
        source: r.source,
      }));
    },
  };
}

async function insertConditions(db: SqlDatabase, items: Condition[]) {
  for (const [i, item] of items.entries()) {
    await db.runAsync(
      "INSERT INTO conditions (id, name, diagnosis_date, sort_order) VALUES (?, ?, ?, ?)",
      [item.id, item.name, item.diagnosisDate, i],
    );
  }
}

async function insertMedications(db: SqlDatabase, items: Medication[]) {
  for (const [i, item] of items.entries()) {
    await db.runAsync(
      "INSERT INTO medications (id, name, prescription_date, lifelong, start_date, end_date, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        item.id,
        item.name,
        item.prescriptionDate,
        item.treatment.lifelong ? 1 : 0,
        item.treatment.lifelong ? null : item.treatment.startDate,
        item.treatment.lifelong ? null : item.treatment.endDate,
        i,
      ],
    );
  }
}

async function insertHistory(db: SqlDatabase, items: ClinicalEntry[]) {
  for (const [i, item] of items.entries()) {
    await db.runAsync(
      "INSERT INTO history (id, title, created_date, detail, sort_order) VALUES (?, ?, ?, ?, ?)",
      [item.id, item.title, item.createdDate, item.detail, i],
    );
  }
}

export function emptyWorkspaceForTests() {
  return emptyWorkspace();
}
