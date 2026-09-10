import { t } from "../../locales";
import type {
  ConversationService,
  PreparationService,
  TranscriptionService,
} from "../../domain/contracts";
import type { Message } from "../../domain/models";
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
export const suggestedText = t("assistant.content.suggestion");
// Simulated providers: no model download, microphone access, or medical inference.
export const simulatedPreparation: PreparationService = {
  async prepare(onProgress, signal) {
    for (let step = 0; step <= 25; step++) {
      await delay(150, signal);
      onProgress([
        { id: "medpsy", progress: Math.min(100, step * 4) },
        { id: "whisper", progress: Math.min(100, step * 7) },
      ]);
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
  async reply(message, signal) {
    await delay(850, signal);
    return {
      id: `reply-${Date.now()}`,
      role: "assistant",
      text: /medic|pastilla|dosis/i.test(message)
        ? t("assistant.content.medications")
        : /consulta|pregunta/i.test(message)
          ? t("assistant.content.consultation")
          : t("assistant.content.general"),
    };
  },
};
export const simulatedTranscription: TranscriptionService = {
  mode: "suggestion",
  async transcribe(signal) {
    await delay(200, signal);
    return suggestedText;
  },
};
