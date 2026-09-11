# ONVIA

Aplicación de salud en React Native y Expo SDK 54. El JS se escribe con Expo; el binario Android se genera con Gradle. No uses Expo Go: este proyecto incluye QVAC y MapLibre nativos.

## Desarrollo

```sh
npm ci
npx expo run:android --device
```

Hace falta un teléfono físico para QVAC (MedPsy, Whisper y TTS). El emulador no sirve para los modelos.

## APK de prueba

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
npm run build:apk
```

El archivo queda en `release/onvia-1.0.0.apk` (arm64-v8a). Desinstala la versión anterior, instala este APK en un teléfono de 64 bits y abre la app. No es un APK de tienda.

## Qué hace la app

- Prepara en el dispositivo MedPsy, Whisper en español y voz TTS en español. Los modelos se guardan en caché.
- Onboarding: nombre, edad, sexo y aceptación de términos.
- Perfil, enfermedades, medicamentos e historial en SQLite local.
- Historial clínico: escribir o dictar.
- Asistente: texto o voz, con el expediente como contexto. Puede leer la respuesta en voz alta.
- Mapa de Panamá en MapLibre, sin Google Maps ni Leaflet.

Nada de eso sale a un servidor propio.

## Comprobaciones

```sh
npm run typecheck
npm run lint
npm test
```
