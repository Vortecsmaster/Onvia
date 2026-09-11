import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Services } from "../domain/contracts";
import { createSqliteWorkspaceRepository } from "../services/storage/SqliteWorkspaceRepository";
import { openAppDatabase } from "../services/storage/database";
import { createQvacServices } from "../services/adapters/qvac";
import { deviceLocation, createLocalPlaces } from "../services/adapters/location";

export async function createAppServices(): Promise<Services> {
  const db = await openAppDatabase();
  const workspace = createSqliteWorkspaceRepository(db, AsyncStorage);
  const places = await workspace.listPlaces();
  const qvac = createQvacServices();
  return {
    workspace,
    preparation: qvac.preparation,
    conversation: qvac.conversation,
    transcription: qvac.transcription,
    speech: qvac.speech,
    location: deviceLocation,
    places: createLocalPlaces(() => places),
  };
}
