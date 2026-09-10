import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Services } from "../domain/contracts";
import { createWorkspaceRepository } from "../services/storage/WorkspaceRepository";
import {
  simulatedPreparation,
  simulatedConversation,
  simulatedTranscription,
} from "../services/adapters/simulated";
import { deviceLocation, localPlaces } from "../services/adapters/location";
const defaults: Services = {
  workspace: createWorkspaceRepository(AsyncStorage),
  preparation: simulatedPreparation,
  conversation: simulatedConversation,
  transcription: simulatedTranscription,
  location: deviceLocation,
  places: localPlaces,
};
const Context = createContext<Services>(defaults);
export function ServicesProvider({
  children,
  services = defaults,
}: {
  children: React.ReactNode;
  services?: Services;
}) {
  return <Context.Provider value={services}>{children}</Context.Provider>;
}
export const useServices = () => useContext(Context);
