import { clipMessages } from "../src/features/shared/messages";
import type { Message } from "../src/domain/models";

test("clips conversation to the last forty messages", () => {
  const messages: Message[] = Array.from({ length: 45 }, (_, i) => ({
    id: String(i),
    role: i % 2 ? "assistant" : "user",
    text: `n${i}`,
  }));
  const clipped = clipMessages(messages);
  expect(clipped).toHaveLength(40);
  expect(clipped[0].id).toBe("5");
});
