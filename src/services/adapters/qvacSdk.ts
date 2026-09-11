import { createAudioPlayer } from "expo-audio";

type QvacSdk = typeof import("@qvac/sdk");

let sdk: Promise<QvacSdk> | null = null;

export function getQvacSdk() {
  if (!sdk) sdk = import("@qvac/sdk");
  return sdk;
}

export { createAudioPlayer };
