export const appConfig = {
  name: "ONVIA",
  version: "1.0.0",
  locale: "es-PA",
  hourCycle: 12 as 12 | 24,
  event: "Hackathon ISD 2026",
  team: ["Jaime Villafane", "Roberto J. Cerrud", "Mario Rios"],
  storageKey: "onvia.workspace.v2",
  legacyStorageKey: "onvia.demo.v1",
  sqliteFile: "onvia.db",
  mapCenter: [8.987, -79.521] as [number, number],
  mapBounds: {
    west: -83.05,
    south: 7.05,
    east: -77.15,
    north: 9.75,
  },
};
