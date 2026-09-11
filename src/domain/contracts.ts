import type {
  Workspace,
  Message,
  ModelProgress,
  Place,
  ClinicalContext,
} from "./models";
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
  reply(
    message: string,
    context: ClinicalContext,
    signal: AbortSignal,
  ): Promise<Message>;
}
export interface TranscriptionService {
  readonly mode: "microphone";
  transcribeAudio(uri: string, signal: AbortSignal): Promise<string>;
}
export interface SpeechService {
  speak(text: string, signal: AbortSignal): Promise<void>;
}
export interface LocationService {
  current(signal: AbortSignal): Promise<[number, number]>;
}
export interface PlacesService {
  list(): Place[];
}
export interface Services {
  workspace: WorkspaceRepository;
  preparation: PreparationService;
  conversation: ConversationService;
  transcription: TranscriptionService;
  speech: SpeechService;
  location: LocationService;
  places: PlacesService;
}
