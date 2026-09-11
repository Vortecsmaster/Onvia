import { clipForSpeech, stripThinking } from "../src/features/shared/stripThinking";
import { resolveEditorId } from "../src/features/shared/useRecordEditorController";
import { pcmToWav, TTS_SAMPLE_RATE } from "../src/services/audio/wav";

test("stripThinking drops think blocks and leaves the answer", () => {
  expect(
    stripThinking(
      "<think>voy a razonar un rato</think>\nToma el losartán con tu médico.",
    ),
  ).toBe("Toma el losartán con tu médico.");
  expect(stripThinking("<think>incompleto")).toBe("");
  expect(
    stripThinking("<|channel|>analysis razonamiento<|end|>Respuesta corta."),
  ).toBe("Respuesta corta.");
});

test("new record routes ignore leftover editor ids", () => {
  expect(resolveEditorId("/medications/new", "c3")).toBeUndefined();
  expect(resolveEditorId("/conditions/c3", "c3")).toBe("c3");
  expect(resolveEditorId("/medications/m1", ["m1"])).toBe("m1");
});

test("clipForSpeech keeps short answers and cuts long ones", () => {
  expect(clipForSpeech("Hola.")).toBe("Hola.");
  const long = `${"palabra ".repeat(80)}Fin.`;
  const clipped = clipForSpeech(long, 80);
  expect(clipped.length).toBeLessThanOrEqual(80);
});

test("pcmToWav keeps 24 kHz and accepts int16 without clipping to a square wave", () => {
  const floatWav = pcmToWav([0, 0.5, -0.5, 1], TTS_SAMPLE_RATE);
  expect(floatWav[0]).toBe(82);
  const rate = new DataView(floatWav.buffer).getUint32(24, true);
  expect(rate).toBe(24000);
  const int16 = pcmToWav([0, 16000, -16000, 0], 24000);
  const view = new DataView(int16.buffer);
  expect(view.getInt16(46, true)).toBe(16000);
  expect(view.getInt16(48, true)).toBe(-16000);
});
