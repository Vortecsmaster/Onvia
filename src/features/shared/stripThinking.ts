const THINK_BLOCK = /<think>[\s\S]*?<\/think>/gi;
const UNCLOSED_THINK = /<think>[\s\S]*$/i;
const CHANNEL_ANALYSIS = /<\|channel\|>analysis[\s\S]*?(?:<\|end\|>|<\|channel\|>)/gi;
const REDACTED = /<\|redacted_thinking\|>[\s\S]*?<\/\|redacted_thinking\|>/gi;

export function stripThinking(text: string) {
  return text
    .replace(THINK_BLOCK, "")
    .replace(UNCLOSED_THINK, "")
    .replace(CHANNEL_ANALYSIS, "")
    .replace(REDACTED, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function clipForSpeech(text: string, max = 400) {
  const clean = stripThinking(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(
    cut.lastIndexOf("."),
    cut.lastIndexOf("!"),
    cut.lastIndexOf("?"),
  );
  return (stop > 80 ? cut.slice(0, stop + 1) : cut).trim();
}
