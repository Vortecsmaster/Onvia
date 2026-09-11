import type { Message } from "../../domain/models";

const MAX_MESSAGES = 40;

export function clipMessages(messages: Message[]) {
  if (messages.length <= MAX_MESSAGES) return messages;
  return messages.slice(messages.length - MAX_MESSAGES);
}
