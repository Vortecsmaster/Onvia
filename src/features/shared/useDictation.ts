import { useState } from "react";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useServices } from "../../providers/ServicesProvider";
import { useTask } from "./useTask";
import { t } from "../../locales";

const recordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  sampleRate: 16000,
  numberOfChannels: 1,
  android: {
    ...RecordingPresets.HIGH_QUALITY.android,
    sampleRate: 16000,
    numberOfChannels: 1,
    outputFormat: "mpeg4" as const,
    audioEncoder: "aac" as const,
  },
};

export function useDictation(onText: (text: string) => void) {
  const recorder = useAudioRecorder(recordingOptions);
  const { transcription } = useServices();
  const task = useTask();
  const [recording, setRecording] = useState(false);

  return {
    recording,
    busy: task.busy,
    error: task.error,
    toggle: () => {
      if (recording) {
        return task.run(async (signal) => {
          await recorder.stop();
          setRecording(false);
          const uri = recorder.uri;
          if (!uri) throw new Error("missing-audio");
          const text = await transcription.transcribeAudio(uri, signal);
          if (!signal.aborted && text) onText(text);
        }, "errors.dictation");
      }
      return task.run(async () => {
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) {
          task.setError(t("errors.microphone"));
          return;
        }
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync();
        recorder.record();
        setRecording(true);
      }, "errors.dictation");
    },
  };
}
