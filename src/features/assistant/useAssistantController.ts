import { useState } from "react";
import { useServices } from "../../providers/ServicesProvider";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { useTask } from "../shared/useTask";
import { useDictation } from "../shared/useDictation";
import { Message } from "../../domain/models";
import { clipMessages } from "../shared/messages";

export function useAssistantController() {
  const { conversation, speech } = useServices(),
    { value } = useWorkspace(),
    task = useTask(),
    speakTask = useTask();
  const [messages, setMessages] = useState<Message[]>(() =>
      conversation.initialMessages(),
    ),
    [input, setInput] = useState("");
  const dictation = useDictation((text) =>
    setInput((current) => (current ? `${current} ${text}` : text)),
  );
  const context = {
    profile: value?.profile ?? null,
    conditions: value?.conditions ?? [],
    medications: value?.medications ?? [],
    history: value?.history ?? [],
  };
  return {
    ...task,
    messages,
    input,
    setInput,
    dictating: dictation.recording,
    error: task.error || dictation.error,
    dictate: dictation.toggle,
    speakError: speakTask.error,
    speaking: speakTask.busy,
    speak: (text: string) =>
      speakTask.run(async (signal) => {
        await speech.speak(text, signal);
      }, "errors.speech"),
    send: (text = input) => {
      if (!text.trim()) return;
      return task.run(async (signal) => {
        const clean = text.trim();
        setMessages((m) =>
          clipMessages([
            ...m,
            { id: `user-${Date.now()}`, role: "user", text: clean },
          ]),
        );
        setInput("");
        const reply = await conversation.reply(clean, context, signal);
        if (!signal.aborted)
          setMessages((m) => clipMessages([...m, reply]));
      });
    },
  };
}
