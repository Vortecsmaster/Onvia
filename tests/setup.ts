jest.mock("@expo/vector-icons/Feather", () => "Icon");
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");
jest.mock("expo-audio", () => ({
  useAudioRecorder: () => ({
    prepareToRecordAsync: jest.fn(),
    record: jest.fn(),
    stop: jest.fn(),
    uri: "file://audio.wav",
  }),
  requestRecordingPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setAudioModeAsync: jest.fn(async () => undefined),
  createAudioPlayer: jest.fn(() => ({ play: jest.fn(), remove: jest.fn() })),
  RecordingPresets: { HIGH_QUALITY: {} },
}));
jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file://cache/",
  EncodingType: { Base64: "base64" },
  writeAsStringAsync: jest.fn(async () => undefined),
}));
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));
jest.mock("@maplibre/maplibre-react-native", () => {
  const Mock = () => null;
  return {
    Map: Mock,
    Camera: Mock,
    Marker: Mock,
    GeoJSONSource: Mock,
    Layer: Mock,
  };
});
jest.mock("../src/services/adapters/qvacSdk", () => {
  const loadModel = jest.fn();
  const completion = jest.fn();
  const transcribe = jest.fn();
  const textToSpeech = jest.fn();
  const cancel = jest.fn();
  return {
    loadModel,
    completion,
    transcribe,
    textToSpeech,
    cancel,
    createAudioPlayer: jest.fn(() => ({ play: jest.fn() })),
    getQvacSdk: jest.fn(async () => ({
      loadModel,
      completion,
      transcribe,
      textToSpeech,
      cancel,
      HEALTHCARE_1_7B_MEDICAL_Q4_K_M: {
        name: "HEALTHCARE_1_7B_MEDICAL_Q4_K_M",
        src: "registry://hf/qvac/MedPsy-1.7B-GGUF/medpsy-1.7b-q4_k_m-imat.gguf",
      },
      TTS_MULTILINGUAL_SUPERTONIC3_Q4_0: { name: "tts" },
      WHISPER_SPANISH_TINY_Q8_0: { name: "whisper" },
    })),
  };
});
