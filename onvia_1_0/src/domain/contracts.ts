import type { Workspace, Message, ModelProgress, Place } from "./models";
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
export interface WorkspaceRepository {
  load(): Promise<Workspace>;
  save(value: Workspace): Promise<void>;
}
export interface PreparationService {
  prepare(
    onProgress: (models: ModelProgress[]) => void,
    signal: AbortSignal,
  ): Promise<void>;
}
export interface ConversationService {
  initialMessages(): Message[];
  reply(message: string, signal: AbortSignal): Promise<Message>;
}
export interface TranscriptionService {
  readonly mode: "suggestion" | "microphone";
  transcribe(signal: AbortSignal): Promise<string>;
}
export interface LocationService {
  current(signal: AbortSignal): Promise<[number, number]>;
}
export interface PlacesService {
  list(): Place[];
  openDirections(place: Place): Promise<void>;
  openSource(place: Place): Promise<void>;
}
export interface Services {
  workspace: WorkspaceRepository;
  preparation: PreparationService;
  conversation: ConversationService;
  transcription: TranscriptionService;
  location: LocationService;
  places: PlacesService;
}
