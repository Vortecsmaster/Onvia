# ONVIA

Aplicación de salud en React Native, Expo SDK 54 y TypeScript. Conserva la identidad Arena + Klein y organiza el producto por funcionalidades, con rutas, vistas, controladores y servicios intercambiables.

## Desarrollo

```sh
npm ci
npm start
npm run web -- --port 8086
npm run ios
npm run android
```

Node 20.19+; Xcode para iOS y Android Studio para Android. Expo Go debe ser compatible con SDK 54. El punto de entrada es `expo-router/entry`; las rutas viven en `src/app`. Las dependencias nativas se instalan con `npx expo install` para respetar la versión del SDK.

## APK local

La primera compilación nativa tarda 10–20 minutos. Hace falta el JDK embebido de Android Studio y el SDK:

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
npm run build:apk
```

El artefacto queda en `release/onvia-1.0.0.apk` (arm64-v8a, firma debug): sirve para instalar en un teléfono o emulador de 64 bits, no para Play Store. `android/` e `ios/` se generan con prebuild y no se versionan. `eas.json` define un perfil `preview` con `android.buildType: "apk"` por si más adelante se usa EAS; no se ejecutó en esta entrega.

`npm run android:release` instala la variante release en un emulador o dispositivo conectado.

## Organización

```text
src/app/          Rutas tipadas, stack y pestañas
src/features/     Pantallas, vistas, hooks controladores y secciones por módulo
src/components/   Primitivas, formularios, feedback y layouts reutilizables
src/domain/       Tipos de dominio, contratos y validaciones
src/services/     Repositorio local y adaptadores
src/providers/    Inyección de dependencias, estado compartido y notificaciones
src/theme/        Tokens de identidad visual
src/locales/      Catálogo español tipado, interpolación y pluralización
src/config/       Marca, versión, equipo, formato horario y configuración
```

El proyecto no utiliza una pantalla monolítica. Cada ruta exporta un Screen de una funcionalidad. Un Screen conecta un hook controlador con una View; las vistas y los formularios no acceden a AsyncStorage ni a servicios.

## Rutas

- `/preparation`, `/onboarding`: preparación inicial y perfil.
- `/`: perfil y accesos a información de salud.
- `/profile/edit`: edición de perfil.
- `/conditions`, `/medications`, `/clinical-history`: listas con búsqueda.
- Cada colección tiene `/new` y `/[id]`, con formularios compartidos entre creación y edición.
- `/assistant`, `/nearby`, `/about`: pestañas principales.
- `/component-gallery`: catálogo interno, disponible solo en desarrollo después del onboarding. No aparece en Acerca de y redirige en exportaciones de producción.

## Persistencia y compatibilidad

`onvia.workspace.v2` guarda datos locales versionados. Al encontrar la clave anterior `onvia.demo.v1`, el repositorio convierte y valida el perfil y todas las colecciones antes de escribir v2. La clave original se conserva. Un fallo de migración o JSON inválido muestra una opción de reintento; nunca se reemplaza silenciosamente por fixtures.

Los datos iniciales se crean únicamente si no existe ninguna de las dos claves. Las colecciones vacías se conservan. Los guardados se serializan y solo se publican en el estado tras confirmar la escritura; un fallo conserva el formulario para reintentar. El chat permanece en memoria durante la sesión de navegación y se reinicia al recargar.

Los orígenes web tienen almacenamiento independiente: cambiar de puerto no traslada sus datos. Los datos no están cifrados ni se sincronizan con un servidor. No utilizar información clínica real en esta base de desarrollo.

## Integraciones

QVAC, Whisper, conversación y transcripción tienen adaptadores **simulados**, explícitos en el código. No se descargan modelos ni se activa el micrófono. La interfaz ofrece preparación del espacio y texto sugerido sin prometer capacidades que todavía no se ejecutan.

`ServicesProvider` concentra la selección de proveedores. Los contratos están en `src/domain/contracts.ts`. Consultar `docs/ARCHITECTURE.md` para reemplazarlos por SDKs reales sin modificar las vistas.

El mapa usa Leaflet 1.9.4 y tiles de OpenStreetMap; requiere internet. El JSON local conserva 16 ubicaciones de Panamá y enlaces OSM de origen. La solicitud de ubicación solo se realiza mediante la acción del usuario. No hay verificación de horarios de establecimientos.

## Comprobaciones

```sh
npm run typecheck
npm run lint
npm test
npx expo-doctor
npm run export
npm run export:all
```

La exportación múltiple genera web, iOS y Android en `dist-final`. Bundling no equivale a una prueba de dispositivo físico. El alcance exacto de ejecución está documentado en `docs/VALIDATION.md`.

## Guías

- `docs/ARCHITECTURE.md`: responsabilidades, servicios y nuevas funcionalidades.
- `docs/DESIGN_SYSTEM.md`: controles, propiedades y ejemplos de uso.
- `docs/VALIDATION.md`: pruebas y límites comprobados.
