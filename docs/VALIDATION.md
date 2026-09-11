# Validación ONVIA

## Estática

```sh
npm run typecheck
npm run lint
npm test
```

## Dispositivo (APK)

Instalar `release/onvia-1.0.0.apk` **encima** de la app si ya existía. No desinstalar: se perderían los modelos guardados en el teléfono.

1. Pasa del splash a «Preparar tu espacio» (o al perfil, si ya estaba preparado).
2. Preparación: tres barras. Cerrar y reabrir: no vuelve a bajar si ya están en el dispositivo.
3. Términos y perfil.
4. Enfermedades y medicamentos: alta, edición y baja, cada uno en su lista.
5. Historial nuevo, con dictado en español.
6. Asistente escrito y hablado. La respuesta usa el expediente y no muestra el pensamiento interno. El altavoz lee la respuesta.
7. Mapa de Panamá y lugares de salud en el dispositivo.

Los modelos no se validan en emulador.
