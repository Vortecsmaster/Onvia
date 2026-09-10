import { appConfig } from "../../config/app";
import type {
  KeyValueStorage,
  WorkspaceRepository,
} from "../../domain/contracts";
import type { Workspace } from "../../domain/models";
import { assertWorkspace } from "../../domain/validation";
import { createWorkspace } from "./seeds";
import { migrateLegacy } from "./migration";
export function createWorkspaceRepository(
  storage: KeyValueStorage,
): WorkspaceRepository {
  return {
    async load() {
      const current = await storage.getItem(appConfig.storageKey);
      if (current !== null) {
        const value: unknown = JSON.parse(current);
        assertWorkspace(value);
        return value;
      }
      const legacy = await storage.getItem(appConfig.legacyStorageKey);
      if (legacy !== null) {
        const value = migrateLegacy(legacy);
        await storage.setItem(appConfig.storageKey, JSON.stringify(value));
        return value;
      }
      const value = createWorkspace();
      await storage.setItem(appConfig.storageKey, JSON.stringify(value));
      return value;
    },
    async save(value: Workspace) {
      assertWorkspace(value);
      await storage.setItem(appConfig.storageKey, JSON.stringify(value));
    },
  };
}
