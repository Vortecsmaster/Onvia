import { createAudioPlayer, getQvacSdk } from "./qvacSdk";
import { cacheDirectory, EncodingType, writeAsStringAsync } from "expo-file-system/legacy";
import { t } from "../../locales";
import type {
  ConversationService,
  PreparationService,
  SpeechService,
  TranscriptionService,
} from "../../domain/contracts";
import type {
  ClinicalContext,
  Message,
  ModelId,
  ModelProgress,
} from "../../domain/models";
import { abortError } from "./simulated";
import { bytesToBase64, pcmToWav, TTS_SAMPLE_RATE } from "../audio/wav";
import { clipForSpeech, stripThinking } from "../../features/shared/stripThinking";

const MEDPSY_HF_GGUF =
  "https://huggingface.co/qvac/MedPsy-1.7B-GGUF/resolve/main/medpsy-1.7b-q4_k_m-imat.gguf";

type Loaded = Partial<Record<ModelId, string>>;

function progressOf(
  current: Record<ModelId, number>,
): ModelProgress[] {
  return (Object.keys(current) as ModelId[]).map((id) => ({
    id,
    progress: current[id],
  }));
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw abortError();
}

function rethrowAbort(error: unknown, signal: AbortSignal) {
  if (signal.aborted || (error instanceof Error && error.name === "AbortError"))
    throw error;
}

async function loadMedpsy(
  qvac: Awaited<ReturnType<typeof getQvacSdk>>,
  onPct: (n: number) => void,
  signal: AbortSignal,
) {
  const options = {
    modelSrc: qvac.HEALTHCARE_1_7B_MEDICAL_Q4_K_M,
    fallbackSrc: MEDPSY_HF_GGUF,
    modelType: "llamacpp-completion" as const,
    onProgress: (p: { percentage?: number }) => onPct(p.percentage ?? 0),
  };
  const attempts: Array<Record<string, unknown>> = [
    { ctx_size: 2048, device: "gpu", reasoning_budget: 0 },
    { ctx_size: 2048, device: "gpu" },
    { ctx_size: 2048, device: "cpu", reasoning_budget: 0 },
    { ctx_size: 2048, device: "cpu" },
  ];
  let last: unknown;
  for (const modelConfig of attempts) {
    try {
      return await qvac.loadModel({ ...options, modelConfig });
    } catch (error) {
      rethrowAbort(error, signal);
      last = error;
      console.warn("ONVIA medpsy load attempt failed", modelConfig, error);
    }
  }
  throw last instanceof Error ? last : new Error("errors.medpsyDownload");
}

async function loadTracked(
  id: ModelId,
  work: (onProgress: (n: number) => void) => Promise<string>,
  current: Record<ModelId, number>,
  onProgress: (models: ModelProgress[]) => void,
  signal: AbortSignal,
) {
  throwIfAborted(signal);
  const modelId = await work((n) => {
    if (signal.aborted) return;
    current[id] = Math.max(current[id], Math.min(100, Math.round(n)));
    onProgress(progressOf(current));
  });
  throwIfAborted(signal);
  current[id] = 100;
  onProgress(progressOf(current));
  return modelId;
}

function contextPrompt(context: ClinicalContext) {
  const profile = context.profile
    ? `${context.profile.name}, ${context.profile.age} años.`
    : "Perfil aún no completado.";
  const conditions =
    context.conditions.map((c) => c.name).join(", ") || "ninguna registrada";
  const medications =
    context.medications.map((m) => m.name).join(", ") || "ninguno registrado";
  const history = context.history
    .slice(0, 3)
    .map((h) => `${h.title}: ${h.detail.slice(0, 140)}`)
    .join("\n") || "sin notas";
  return [
    t("assistant.system"),
    `Persona: ${profile}`,
    `Enfermedades: ${conditions}.`,
    `Medicamentos: ${medications}.`,
    `Historial reciente:\n${history}`,
  ].join("\n\n");
}

export function createQvacServices() {
  const loaded: Loaded = {};

  const preparation: PreparationService = {
    async prepare(onProgress, signal) {
      const current: Record<ModelId, number> = {
        medpsy: loaded.medpsy ? 100 : 0,
        whisper: loaded.whisper ? 100 : 0,
        voice: loaded.voice ? 100 : 0,
      };
      onProgress(progressOf(current));
      const qvac = await getQvacSdk();
      if (!loaded.medpsy) {
        try {
          loaded.medpsy = await loadTracked(
            "medpsy",
            (onPct) => loadMedpsy(qvac, onPct, signal),
            current,
            onProgress,
            signal,
          );
        } catch (error) {
          rethrowAbort(error, signal);
          console.warn("ONVIA medpsy download failed", error);
          throw new Error("errors.medpsyDownload");
        }
      }
      if (!loaded.whisper) {
        try {
          loaded.whisper = await loadTracked(
            "whisper",
            (onPct) =>
              qvac.loadModel({
                modelSrc: qvac.WHISPER_SPANISH_TINY_Q8_0,
                modelConfig: { language: "es" },
                onProgress: (p) => onPct(p.percentage ?? 0),
              }),
            current,
            onProgress,
            signal,
          );
        } catch (error) {
          rethrowAbort(error, signal);
          console.warn("ONVIA whisper download failed", error);
          throw new Error("errors.whisperDownload");
        }
      }
      if (!loaded.voice) {
        try {
          loaded.voice = await loadTracked(
            "voice",
            (onPct) =>
              qvac.loadModel({
                modelSrc: qvac.TTS_MULTILINGUAL_SUPERTONIC3_Q4_0,
                modelConfig: {
                  ttsEngine: "supertonic",
                  language: "es",
                  voice: "F1",
                  outputSampleRate: TTS_SAMPLE_RATE,
                  useGPU: true,
                },
                onProgress: (p) => onPct(p.percentage ?? 0),
              }),
            current,
            onProgress,
            signal,
          );
        } catch (error) {
          rethrowAbort(error, signal);
          console.warn("ONVIA voice download failed", error);
          throw new Error("errors.voiceDownload");
        }
      }
    },
  };

  async function ensureLoaded(signal: AbortSignal) {
    if (loaded.medpsy && loaded.whisper && loaded.voice) return;
    await preparation.prepare(() => undefined, signal);
    if (!loaded.medpsy || !loaded.whisper || !loaded.voice)
      throw new Error("errors.modelMissing");
  }

  const conversation: ConversationService = {
    initialMessages: () => [
      {
        id: "intro-user",
        role: "user",
        text: t("assistant.content.initialUser"),
      },
      {
        id: "intro-assistant",
        role: "assistant",
        text: t("assistant.content.initialReply"),
      },
    ],
    async reply(message, context, signal) {
      throwIfAborted(signal);
      await ensureLoaded(signal);
      const qvac = await getQvacSdk();
      const history = [
        { role: "system" as const, content: contextPrompt(context) },
        { role: "user" as const, content: message },
      ];
      const attempts = [
        {
          modelId: loaded.medpsy!,
          history,
          stream: false as const,
          captureThinking: false,
          generationParams: {
            temp: 0.6,
            top_k: 20,
            top_p: 0.95,
            predict: 180,
            reasoning_budget: 0,
            remove_thinking_from_context: true,
          },
        },
        { modelId: loaded.medpsy!, history, stream: false as const },
      ];
      let last: unknown;
      for (const options of attempts) {
        const run = qvac.completion(options);
        const stop = () => {
          void qvac.cancel({ requestId: run.requestId });
        };
        signal.addEventListener("abort", stop, { once: true });
        try {
          const final = await run.final;
          throwIfAborted(signal);
          const text =
            stripThinking(final.contentText || "") ||
            t("assistant.content.general");
          return {
            id: `reply-${Date.now()}`,
            role: "assistant",
            text,
          } satisfies Message;
        } catch (error) {
          rethrowAbort(error, signal);
          last = error;
          console.warn("ONVIA completion attempt failed", error);
        } finally {
          signal.removeEventListener("abort", stop);
        }
      }
      throw last instanceof Error ? last : new Error("errors.generic");
    },
  };

  const transcription: TranscriptionService = {
    mode: "microphone",
    async transcribeAudio(uri, signal) {
      throwIfAborted(signal);
      await ensureLoaded(signal);
      const qvac = await getQvacSdk();
      const text = await qvac.transcribe({
        modelId: loaded.whisper!,
        audioChunk: uri.replace("file://", ""),
      });
      throwIfAborted(signal);
      return text.trim();
    },
  };

  const speech: SpeechService = {
    async speak(text, signal) {
      throwIfAborted(signal);
      await ensureLoaded(signal);
      const qvac = await getQvacSdk();
      const spoken = clipForSpeech(text);
      if (!spoken) return;
      const result = qvac.textToSpeech({
        modelId: loaded.voice!,
        text: spoken,
        stream: false,
      });
      const samples = await result.buffer;
      throwIfAborted(signal);
      const wav = pcmToWav(samples, TTS_SAMPLE_RATE);
      const uri = `${cacheDirectory}onvia-tts-${Date.now()}.wav`;
      await writeAsStringAsync(uri, bytesToBase64(wav), {
        encoding: EncodingType.Base64,
      });
      throwIfAborted(signal);
      const player = createAudioPlayer(uri);
      player.play();
    },
  };

  return { preparation, conversation, transcription, speech, loaded };
}


