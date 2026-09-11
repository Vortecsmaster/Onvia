function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

export const TTS_SAMPLE_RATE = 24000;

function peak(samples: ArrayLike<number>) {
  let max = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const abs = Math.abs(samples[i]);
    if (abs > max) max = abs;
  }
  return max;
}

function toInt16(sample: number, floatPcm: boolean) {
  if (floatPcm) {
    const clipped = Math.max(-1, Math.min(1, sample));
    return clipped < 0
      ? Math.round(clipped * 0x8000)
      : Math.round(clipped * 0x7fff);
  }
  return Math.max(-0x8000, Math.min(0x7fff, Math.round(sample)));
}

export function pcmToWav(
  samples: ArrayLike<number>,
  sampleRate = TTS_SAMPLE_RATE,
): Uint8Array {
  const floatPcm = peak(samples) <= 1.5;
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    view.setInt16(offset, toInt16(samples[i], floatPcm), true);
    offset += 2;
  }
  return new Uint8Array(buffer);
}

export function bytesToBase64(bytes: Uint8Array) {
  const chunk = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    let part = "";
    for (let j = 0; j < slice.length; j += 1)
      part += String.fromCharCode(slice[j]);
    binary += part;
  }
  return btoa(binary);
}

export const whisperRecording = {
  extension: ".wav",
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  android: {
    extension: ".wav",
    sampleRate: 16000,
    outputFormat: "default" as const,
    audioEncoder: "default" as const,
  },
  web: {
    mimeType: "audio/wav",
    bitsPerSecond: 128000,
  },
  ios: {
    extension: ".wav",
    sampleRate: 16000,
    outputFormat: "lpcm",
    audioQuality: 96,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
