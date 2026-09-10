# Arquitectura ONVIA

## Flujo de dependencias

Ruta → Screen → hook controlador → proveedor/contrato → adaptador.

El Screen pasa el resultado del controlador a la View. La View compone controles y secciones, presenta estados y emite callbacks. Las vistas pueden manejar animaciones y foco; no persisten ni llaman a SDKs. Los tipos del controlador usados para las props no convierten la vista en propietaria de su lógica.

Expo Router maneja navegación y enlaces. `(tabs)` contiene las cuatro páginas principales; el stack raíz contiene onboarding y editores. AppShell dibuja las pestañas inferiores y la navegación lateral responsive. Las rutas no contienen formularios ni lógica de negocio. Los guards impiden abrir pantallas con datos todavía sin hidratar o antes del onboarding.

## Estado

WorkspaceProvider expone `value`, `loading`, `failed`, `reload` y `commit(update)`. Un reducer administra el estado visible; una cola serial aplica actualizaciones sobre la última versión confirmada. Primero se persiste, después se actualiza el estado. Los errores se propagan al controlador, que conserva su borrador y permite reintentar. No hay actualizaciones optimistas de registros clínicos.

Los controladores mantienen borradores, filtros, selección y estados de envío. `useTask` impide duplicados simultáneos y cancela mediante AbortSignal al desmontarse. Después de una operación pendiente, los controladores comprueban la señal antes de navegar o mostrar una notificación. Una escritura ya iniciada puede terminar en almacenamiento aunque la pantalla se cierre; no muestra feedback sobre una pantalla desmontada.

FeedbackProvider administra mensajes de confirmación fuera de las pantallas. No es un sistema de errores global: los errores de formulario permanecen junto a los campos y la acción.

## Modelos y contratos

- Profile: nombre, edad numérica y sexo con valores estables (`female`, `male`, `unspecified`).
- Condition: nombre y fecha de diagnóstico.
- Medication: nombre, fecha de receta y tratamiento discriminado: permanente o intervalo.
- ClinicalEntry: título, fecha y detalle.
- Message y Place: conversación y servicios de salud.

Workspace versiona esos modelos en un único documento. La migración conserva IDs, fechas, notas y colecciones vacías; los datos heredados no se editan como parte de una limpieza de textos de producto.

Los contratos son WorkspaceRepository, PreparationService, ConversationService, TranscriptionService, LocationService y PlacesService. ServicesProvider acepta un objeto `services` para sustituir el conjunto completo en pruebas o integraciones. No usar imports de adaptadores desde features.

## Añadir una pantalla

1. Crear una carpeta bajo `features` con `Screen`, `View`, `use…Controller` y `components/` para secciones propias.
2. Declarar tipos/validaciones en domain solo cuando representan entidades compartidas; el estado visual local pertenece al controlador.
3. Añadir las claves de texto al catálogo español y usar `t()`; usar `countText()` para registros/lugares.
4. Componer la View con Screen, ScreenHeader, Section y controles existentes. No duplicar Input, Button ni selectores de fecha.
5. Crear una ruta fina que exporte el Screen. En pantallas nuevas, usar `backOrReplace` para admitir enlaces directos sin historial.
6. Probar validación, cancelación, fallo de servicio y navegación; agregar ejemplos al catálogo interno si se creó un control nuevo.

Las listas y editores de registros comparten lógica y layouts en `features/shared`, pero cada dominio mantiene sus formularios y sus rutas independientes. No ampliar una entidad agregando campos opcionales ajenos: crear o extender su tipo específico.

## Reemplazar los proveedores simulados

Crear una implementación del contrato y seleccionarla en ServicesProvider. Para QVAC, definir artefactos, licencia, cuantización y checksums; descarga real con progreso, cancelación, recuperación e inicialización verificable. Para Whisper, implementar permisos, grabación y transcripción en un development build compatible. El contrato de transcripción declara su modo; cuando se implemente micrófono, añadir el flujo explícito de grabación y sus estados, manteniendo revisión del texto antes de enviar.

No convertir el progreso simulado en un indicador de descarga real. Mantener los adaptadores simulados disponibles para pruebas controladas; no confundirlos con infraestructura productiva. Las APIs oficiales de referencia son https://github.com/tetherto/qvac y https://qvac.tether.io/products/models.

## Datos y límites

No se implementan backend, autenticación, cifrado, sincronización ni decisiones clínicas. Para una aplicación productiva se necesita diseñar esas capacidades antes de admitir datos reales. El mapa conserva su listado local cuando no puede cargar tiles; ubicación y enlaces externos se gestionan mediante servicios.
