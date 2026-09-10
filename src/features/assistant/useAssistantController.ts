import { useState } from "react";
import { useServices } from "../../providers/ServicesProvider";
import { useTask } from "../shared/useTask";
import { Message } from "../../domain/models";
export function useAssistantController() {
  const { conversation, transcription } = useServices(),
    task = useTask();
  const [messages, setMessages] = useState<Message[]>(() =>
      conversation.initialMessages(),
    ),
    [input, setInput] = useState("");
  return {
    ...task,
    messages,
    input,
    setInput,
    send: (text = input) => {
      if (!text.trim()) return;
      return task.run(async (signal) => {
        const clean = text.trim();
        setMessages((m) => [
          ...m,
          { id: `user-${Date.now()}`, role: "user", text: clean },
        ]);
        setInput("");
        const reply = await conversation.reply(clean, signal);
        if (!signal.aborted) setMessages((m) => [...m, reply]);
      });
    },
    suggest: () =>
      task.run(async (signal) => {
        const text = await transcription.transcribe(signal);
        if (!signal.aborted) setInput(text);
      }),
  };
}
