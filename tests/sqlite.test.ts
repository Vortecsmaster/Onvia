import { createMemoryDatabase } from "../src/services/storage/memoryDatabase";
import { createSqliteWorkspaceRepository } from "../src/services/storage/SqliteWorkspaceRepository";
import { createWorkspace } from "../src/services/storage/seeds";
import { appConfig } from "../src/config/app";

test("sqlite seeds demo records and panama places once", async () => {
  const db = createMemoryDatabase();
  const repo = createSqliteWorkspaceRepository(db);
  const first = await repo.load();
  expect(first.conditions).toHaveLength(0);
  expect(first.medications).toHaveLength(0);
  expect(first.history).toHaveLength(0);
  expect(first.termsAccepted).toBe(false);
  const places = await repo.listPlaces();
  expect(places).toHaveLength(16);
  await repo.save({ ...first, conditions: [], prepared: true, termsAccepted: true });
  const second = await repo.load();
  expect(second.conditions).toEqual([]);
  expect(second.prepared).toBe(true);
  expect(second.termsAccepted).toBe(true);
  expect(await repo.listPlaces()).toHaveLength(16);
});

test("saving a medication does not create conditions", async () => {
  const db = createMemoryDatabase();
  const repo = createSqliteWorkspaceRepository(db);
  const base = await repo.load();
  await repo.save({
    ...base,
    medications: [
      {
        id: "m1",
        name: "Losartán",
        prescriptionDate: "2026-01-10",
        treatment: { lifelong: true },
      },
    ],
  });
  const saved = await repo.load();
  expect(saved.medications).toHaveLength(1);
  expect(saved.conditions).toEqual([]);
  expect(saved.history).toEqual([]);
});

test("sqlite roundtrips create edit and delete for all collections", async () => {
  const db = createMemoryDatabase();
  const repo = createSqliteWorkspaceRepository(db);
  const base = await repo.load();
  const condition = {
    id: "c-new",
    name: "Asma",
    diagnosisDate: "2024-03-01",
  };
  const lifelong = {
    id: "m-life",
    name: "Losartán",
    prescriptionDate: "2026-01-10",
    treatment: { lifelong: true as const },
  };
  const timed = {
    id: "m-temp",
    name: "Amoxicilina",
    prescriptionDate: "2026-02-01",
    treatment: {
      lifelong: false as const,
      startDate: "2026-02-01",
      endDate: "2026-02-10",
    },
  };
  const note = {
    id: "h-new",
    title: "Consulta",
    createdDate: "2026-03-01",
    detail: "Dolor de cabeza desde ayer.",
  };
  await repo.save({
    ...base,
    conditions: [condition],
    medications: [lifelong, timed],
    history: [note],
  });
  const saved = await repo.load();
  expect(saved.conditions).toEqual([condition]);
  expect(saved.medications).toEqual([lifelong, timed]);
  expect(saved.history).toEqual([note]);
  await repo.save({
    ...saved,
    conditions: [{ ...condition, name: "Asma alérgica" }],
    medications: [{ ...lifelong, name: "Losartán 50 mg" }],
    history: [{ ...note, detail: "Mejoró con descanso." }],
  });
  const edited = await repo.load();
  expect(edited.conditions[0].name).toBe("Asma alérgica");
  expect(edited.medications).toHaveLength(1);
  expect(edited.medications[0].treatment).toEqual({ lifelong: true });
  expect(edited.history[0].detail).toContain("Mejoró");
  await repo.save({
    ...edited,
    conditions: [],
    medications: [],
    history: [],
  });
  const empty = await repo.load();
  expect(empty.conditions).toEqual([]);
  expect(empty.medications).toEqual([]);
  expect(empty.history).toEqual([]);
});

test("sqlite migrates async storage workspace into tables", async () => {
  const db = createMemoryDatabase();
  const kv = {
    getItem: jest.fn(async (key: string) =>
      key === appConfig.storageKey
        ? JSON.stringify({
            ...createWorkspace(),
            profile: { name: "Ana", age: 34, sex: "female" },
            prepared: true,
            termsAccepted: true,
            conditions: [],
          })
        : null,
    ),
    setItem: jest.fn(async () => undefined),
  };
  const repo = createSqliteWorkspaceRepository(db, kv);
  const value = await repo.load();
  expect(value.profile?.name).toBe("Ana");
  expect(value.conditions).toEqual([]);
  const again = await repo.load();
  expect(kv.getItem).toHaveBeenCalledTimes(1);
  expect(again.profile?.name).toBe("Ana");
});
