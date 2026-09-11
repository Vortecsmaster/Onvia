import {
  validDate,
  validTime,
  canonicalTime,
  timeParts,
  formatTime,
  inRange,
  toLocalISODate,
} from "../src/domain/dateTime";
import {
  conditionError,
  medicationError,
  historyError,
  profileError,
} from "../src/domain/validation";
import { es } from "../src/locales/es";
import { t, countText } from "../src/locales";
import { createWorkspace } from "../src/services/storage/seeds";
import {
  suggestedText,
  simulatedConversation,
} from "../src/services/adapters/simulated";
import places from "../src/data/places.json";
test("calendar rejects impossible dates and handles leap years", () => {
  expect(validDate("2024-02-29")).toBe(true);
  for (const s of ["2025-02-29", "2026-04-31", "", "2026-13-01", "1969-12-31"])
    expect(validDate(s)).toBe(false);
  expect(toLocalISODate(new Date(2026, 8, 10, 23, 30))).toBe("2026-09-10");
  expect(toLocalISODate(new Date(0))).toBe("");
});
test("time rejects invalid minutes and hours", () => {
  for (const s of ["24:00", "12:60", "-1:00", "1:00", ""])
    expect(validTime(s)).toBe(false);
  expect(validTime("00:00")).toBe(true);
});
test("12/24 presentation preserves midnight and noon", () => {
  expect(canonicalTime(12, 0, 12, "AM")).toBe("00:00");
  expect(canonicalTime(12, 0, 12, "PM")).toBe("12:00");
  expect(canonicalTime(1, 30, 12, "PM")).toBe("13:30");
  expect(timeParts("00:00", 12)).toEqual({ hour: 12, minute: 0, period: "AM" });
  expect(timeParts("12:00", 12)).toEqual({ hour: 12, minute: 0, period: "PM" });
  expect(formatTime("00:00", 24)).toBe("00:00");
  expect(inRange("13:30", "09:00", "13:30")).toBe(true);
  expect(inRange("08:59", "09:00")).toBe(false);
});
test("profile validation requires an adult and complete fields", () => {
  for (const age of [17, 121, NaN, 20.5])
    expect(profileError({ name: "Ana", age, sex: "female" })).toBeDefined();
  expect(profileError({ name: "Ana", age: 34, sex: "female" })).toBeUndefined();
});
test("records validate names dates and treatment boundaries", () => {
  expect(
    conditionError({ id: "1", name: "", diagnosisDate: "2026-09-09" }),
  ).toBeDefined();
  expect(
    historyError({
      id: "1",
      title: "Consulta",
      createdDate: "2026-09-09",
      detail: " ",
    }),
  ).toBeDefined();
  expect(
    medicationError({
      id: "1",
      name: "Medicación",
      prescriptionDate: "2026-09-09",
      treatment: { lifelong: true },
    }),
  ).toBeUndefined();
  expect(
    medicationError({
      id: "1",
      name: "Medicación",
      prescriptionDate: "2026-09-09",
      treatment: {
        lifelong: false,
        startDate: "2026-09-10",
        endDate: "2026-09-09",
      },
    }),
  ).toBeDefined();
});
test("visible catalog and seed data have no prototype labels", () => {
  expect(
    JSON.stringify([
      es,
      createWorkspace(),
      suggestedText,
      simulatedConversation.initialMessages(),
    ]),
  ).not.toMatch(/\bdemo\b|\bdemostraci[oó]n\b|de ejemplo|\bsimulad[oa]\b/i);
  expect(t("profile.greeting", { name: "Ana" })).toBe("Hola, Ana");
  expect(countText("record", 1)).toBe("1 registro");
  expect(countText("record", 2)).toBe("2 registros");
});
test("geographic fixtures have unique ids and verified OSM source shape", () => {
  expect(places).toHaveLength(16);
  expect(new Set(places.map((p) => p.id)).size).toBe(16);
  for (const p of places) {
    expect(p.latitude).toBeGreaterThan(8.9);
    expect(p.latitude).toBeLessThan(9.1);
    expect(p.longitude).toBeGreaterThan(-79.6);
    expect(p.longitude).toBeLessThan(-79.4);
    expect(p.source).toMatch(
      /^https:\/\/www.openstreetmap.org\/(node|way|relation)\/\d+$/,
    );
  }
});
