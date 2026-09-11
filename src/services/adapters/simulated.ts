import { t } from "../../locales";
import type {
  ConversationService,
  PreparationService,
  SpeechService,
  TranscriptionService,
} from "../../domain/contracts";
import type { Message, ModelId } from "../../domain/models";
export function abortError() {
  const e = new Error("Aborted");
  e.name = "AbortError";
  return e;
}
export function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const cancel = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, ms);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

const ids: ModelId[] = ["medpsy", "whisper", "voice"];

export const simulatedPreparation: PreparationService = {
  async prepare(onProgress, signal) {
    for (let step = 0; step <= 25; step++) {
      await delay(40, signal);
      onProgress(
        ids.map((id) => ({
          id,
          progress: Math.min(100, step * 4),
        })),
      );
    }
  },
};
const initial: Message[] = [
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
];
export const simulatedConversation: ConversationService = {
  initialMessages: () => initial.map((m) => ({ ...m })),
  async reply(message, context, signal) {
    await delay(120, signal);
    const named = context.profile?.name;
    const meds = context.medications.map((m) => m.name).join(", ");
    const extra = [named, meds].filter(Boolean).join(" · ");
    const body = /medic|pastilla|dosis/i.test(message)
      ? t("assistant.content.medications")
      : /consulta|pregunta/i.test(message)
        ? t("assistant.content.consultation")
        : t("assistant.content.general");
    return {
      id: `reply-${Date.now()}`,
      role: "assistant",
      text: extra ? `${body}\n\n${extra}` : body,
    };
  },
};
export const suggestedText = t("assistant.content.suggestion");
export const simulatedTranscription: TranscriptionService = {
  mode: "microphone",
  async transcribeAudio(_uri, signal) {
    await delay(80, signal);
    return t("assistant.content.suggestion");
  },
};
export const simulatedSpeech: SpeechService = {
  async speak(_text, signal) {
    await delay(40, signal);
  },
};
