import { createQvacServices } from "../src/services/adapters/qvac";
import { getQvacSdk } from "../src/services/adapters/qvacSdk";

async function sdkMocks() {
  return getQvacSdk();
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("prepare loads medpsy whisper and spanish voice once", async () => {
  const sdk = await sdkMocks();
  const loadModelMock = sdk.loadModel as jest.Mock;
  loadModelMock.mockImplementation(
    async ({ modelSrc }: { modelSrc: unknown }) => {
      if (typeof modelSrc === "string") return "medpsy-id";
      if (modelSrc && typeof modelSrc === "object" && "name" in modelSrc) {
        return String((modelSrc as { name: string }).name) + "-id";
      }
      return "model-id";
    },
  );
  const qvac = createQvacServices();
  const seen: number[][] = [];
  await qvac.preparation.prepare((models) => {
    seen.push(models.map((m) => m.progress));
  }, new AbortController().signal);
  expect(loadModelMock).toHaveBeenCalledTimes(3);
  const first = loadModelMock.mock.calls[0][0] as {
    modelSrc: { name?: string };
    fallbackSrc?: string;
    modelConfig?: { device?: string };
  };
  expect(first.modelSrc.name).toBe("HEALTHCARE_1_7B_MEDICAL_Q4_K_M");
  expect(first.fallbackSrc).toContain("medpsy-1.7b-q4_k_m-imat.gguf");
  expect(first.modelConfig?.device).toBe("gpu");
  await qvac.preparation.prepare(() => undefined, new AbortController().signal);
  expect(loadModelMock).toHaveBeenCalledTimes(3);
  expect(seen.at(-1)).toEqual([100, 100, 100]);
});

test("prepare retries medpsy on cpu when gpu load fails", async () => {
  const sdk = await sdkMocks();
  const loadModelMock = sdk.loadModel as jest.Mock;
  loadModelMock
    .mockRejectedValueOnce(new Error("gpu"))
    .mockRejectedValueOnce(new Error("gpu"))
    .mockResolvedValueOnce("medpsy-cpu")
    .mockResolvedValueOnce("whisper-id")
    .mockResolvedValueOnce("voice-id");
  const qvac = createQvacServices();
  await qvac.preparation.prepare(() => undefined, new AbortController().signal);
  expect(loadModelMock.mock.calls.length).toBeGreaterThanOrEqual(4);
  expect(
    loadModelMock.mock.calls.some(
      (call) =>
        (call[0] as { modelConfig?: { device?: string } }).modelConfig
          ?.device === "cpu",
    ),
  ).toBe(true);
});

test("prepare maps medpsy download failure to a locale key", async () => {
  const sdk = await sdkMocks();
  const loadModelMock = sdk.loadModel as jest.Mock;
  loadModelMock.mockRejectedValue(new Error("network"));
  const qvac = createQvacServices();
  await expect(
    qvac.preparation.prepare(() => undefined, new AbortController().signal),
  ).rejects.toThrow("errors.medpsyDownload");
});

test("reply uses clinical context and transcribe stays in spanish path", async () => {
  const sdk = await sdkMocks();
  const loadModelMock = sdk.loadModel as jest.Mock;
  const completionMock = sdk.completion as jest.Mock;
  const transcribeMock = sdk.transcribe as jest.Mock;
  loadModelMock.mockResolvedValue("model-id");
  completionMock.mockReturnValue({
    requestId: "req-1",
    final: Promise.resolve({ contentText: "Toma Losartán con tu médico." }),
  });
  transcribeMock.mockResolvedValue("me dolió la cabeza");
  const qvac = createQvacServices();
  await qvac.preparation.prepare(() => undefined, new AbortController().signal);
  const reply = await qvac.conversation.reply(
    "¿Qué hago con el losartán?",
    {
      profile: { name: "Ana", age: 34, sex: "female" },
      conditions: [
        { id: "c1", name: "Hipertensión arterial", diagnosisDate: "2025-01-12" },
      ],
      medications: [
        {
          id: "m1",
          name: "Losartán",
          prescriptionDate: "2026-08-20",
          treatment: { lifelong: true },
        },
      ],
      history: [],
    },
    new AbortController().signal,
  );
  expect(reply.text).toContain("Losartán");
  expect(completionMock).toHaveBeenCalled();
  const completionArgs = completionMock.mock.calls[0][0] as {
    captureThinking?: boolean;
    kvCache?: boolean;
    generationParams?: { predict?: number; reasoning_budget?: number };
  };
  expect(completionArgs.captureThinking).toBe(false);
  expect(completionArgs.generationParams?.predict).toBe(180);
  expect(completionArgs.generationParams?.reasoning_budget).toBe(0);
  const text = await qvac.transcription.transcribeAudio(
    "file://clip.wav",
    new AbortController().signal,
  );
  expect(text).toBe("me dolió la cabeza");
});

test("reply loads cached models when ram is empty", async () => {
  const sdk = await sdkMocks();
  const loadModelMock = sdk.loadModel as jest.Mock;
  const completionMock = sdk.completion as jest.Mock;
  loadModelMock.mockResolvedValue("model-id");
  completionMock.mockReturnValue({
    requestId: "req-1",
    final: Promise.resolve({ contentText: "Consulta con tu médico." }),
  });
  const qvac = createQvacServices();
  const reply = await qvac.conversation.reply(
    "hola",
    {
      profile: { name: "Ana", age: 34, sex: "female" },
      conditions: [],
      medications: [],
      history: [],
    },
    new AbortController().signal,
  );
  expect(loadModelMock).toHaveBeenCalled();
  expect(reply.text).toContain("médico");
});

test("reply hides thinking tokens from the user", async () => {
  const sdk = await sdkMocks();
  const loadModelMock = sdk.loadModel as jest.Mock;
  const completionMock = sdk.completion as jest.Mock;
  loadModelMock.mockResolvedValue("model-id");
  completionMock.mockReturnValue({
    requestId: "req-1",
    final: Promise.resolve({
      contentText:
        "<think>cadena larga de razonamiento</think>\nConsulta con tu médico por el losartán.",
    }),
  });
  const qvac = createQvacServices();
  await qvac.preparation.prepare(() => undefined, new AbortController().signal);
  const reply = await qvac.conversation.reply(
    "¿El losartán?",
    {
      profile: { name: "Ana", age: 34, sex: "female" },
      conditions: [],
      medications: [],
      history: [],
    },
    new AbortController().signal,
  );
  expect(reply.text).not.toMatch(/think/i);
  expect(reply.text).toContain("losartán");
});
