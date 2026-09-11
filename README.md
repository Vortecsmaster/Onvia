# ONVIA

Aplicación de salud para Android, en español. El expediente, el asistente y el mapa de Panamá viven en el teléfono. No hay servidor propio.

Expo se usa para escribir y empaquetar el proyecto. El binario se genera con Gradle. No uses Expo Go: hace falta un build nativo.

## Qué incluye

- Preparación en el dispositivo de los modelos de salud, voz a texto y lectura en voz alta. Tras la primera vez se reutilizan en el teléfono.
- Onboarding: nombre, edad, sexo y aceptación de términos.
- Perfil, enfermedades, medicamentos e historial clínico en almacenamiento local.
- Dictado en el historial y en el asistente.
- Asistente con el expediente como contexto. Responde en español, directo, sin mostrar el pensamiento interno. Puede leer la respuesta en voz alta.
- Mapa de Panamá y lugares de salud en el dispositivo.

Nada de eso se envía a un servidor de ONVIA.

## Organización

Ruta → pantalla → controlador → contrato → adaptador.

| Carpeta | Rol |
| --- | --- |
| `src/app` | Rutas. Finas, sin lógica de negocio. |
| `src/features` | Pantallas, vistas y controladores. |
| `src/domain` | Modelos, validación y contratos. |
| `src/services` | SQLite, modelos en dispositivo, ubicación. |
| `src/components` | Controles reutilizables. |
| `tests` | Comprobaciones automáticas. |
| `docs` | Arquitectura, diseño y validación. |
| `release` | APK local. No se sube a git. |

Las pestañas son perfil, asistente, cerca de mí y acerca de. El stack raíz cubre preparación, onboarding y editores.

Más detalle: [arquitectura](docs/ARCHITECTURE.md), [sistema de diseño](docs/DESIGN_SYSTEM.md), [validación](docs/VALIDATION.md).

## Desarrollo

Teléfono físico de 64 bits. Los modelos no corren en emulador.

```sh
npm ci
npx expo run:android --device
```

## Comprobaciones

```sh
npm run typecheck
npm run lint
npm test
```

## APK

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
npm run build:apk
```

El archivo queda en `release/onvia-1.0.0.apk`. Instálalo **encima** de la versión anterior: si desinstalas, se pierden los modelos ya descargados. No es un APK de tienda.

## Uso en el teléfono

1. Abrir. Si es la primera vez, preparar el espacio (tres barras).
2. Aceptar términos y completar el perfil.
3. Cargar enfermedades, medicamentos e historial (texto o dictado).
4. Hablar con el asistente por escrito o por voz.
5. Ver el mapa de Panamá y los lugares de salud.
