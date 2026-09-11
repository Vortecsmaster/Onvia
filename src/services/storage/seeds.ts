import type { Workspace } from "../../domain/models";
// Fixture data is isolated from production domain models and views.
export function createWorkspace(): Workspace {
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
