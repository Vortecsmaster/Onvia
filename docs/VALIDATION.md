# Validación ONVIA

Fecha: 10 septiembre 2026. Expo SDK 54, React Native 0.81.5, TypeScript 5.9, Node 24.14.

## Comprobaciones estáticas

| Comando                                               | Resultado                                  |
| ----------------------------------------------------- | ------------------------------------------ |
| `npm run typecheck`                                   | Sin errores                                |
| `npm run lint`                                        | Sin errores                                |
| `npx prettier --write` sobre `src` y `tests`          | Sin cambios pendientes                     |
| `npm test` (`jest --runInBand --no-watchman`)         | 6 suites, 31 pruebas                       |

Las 31 pruebas cubren arquitectura, persistencia y migración `onvia.demo.v1` → `onvia.workspace.v2`, controladores, dominio, componentes y `ScrollArea`.

## Interfaz compacta (esta entrega)

- Preparación y onboarding caben en un viewport móvil: `Screen compact`, cabecera de 58 px y sin icono de persona.
- Tras el onboarding, el icono de persona es un atajo a «Mi perfil».
- El asistente no usa `Screen`: título «Asistente ONVIA», lista con scroll propio, barra con chips + campo + micrófono (inserta texto simulado) + envío, pie con icono de escudo.
- El historial clínico conserva «Usar texto sugerido».
- La ficha de lugar solo muestra «Ir al destino».
- Perfil, listas, about y nearby reducen huecos sin recortar contenido clínico.

## Web

Recorrido en `http://localhost:8086` (390 × 844):

- Preparación compacta → Continuar → onboarding compacto, sin icono de persona.
- Perfil: cabecera más baja, hero más corto, icono de persona navega a `/`.
- Asistente: sin texto «Conversa, ordena…»; micrófono inserta el texto preparado; envío responde; no hay «Usar texto sugerido».
- Mapa: ficha de Hospital Punta Pacífica solo con «Ir al destino».

## Android (APK)

- Pipeline: `JAVA_HOME` del JBR 21 de Android Studio, `ANDROID_HOME=~/Library/Android/sdk`, `./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a` (29 s de recompilación).
- Artefacto: `release/onvia-1.0.0.apk` (26 MB), firma debug, arm64-v8a. No es un APK de tienda.
- Se intentó arrancar el AVD `Medium_Phone_API_36.0`; el emulador cerró a los ~20 s (gfxstream). No se reinstaló el binario en dispositivo.

## iOS

No se valida en esta entrega.

## Límites

- QVAC, Whisper y dictado real siguen fuera de alcance. El micrófono del asistente inserta un texto preparado.
- EAS Build no se ejecutó (exige cuenta).
- El APK es solo arm64-v8a.
