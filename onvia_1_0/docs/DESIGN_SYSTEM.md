# ONVIA · Sistema de diseño

Arena + Klein conserva marfil #FAF8F1, arena #E5D7BB, Klein #1932DB y tinta #171717. Titulares: Bricolage Grotesque 700. Lectura y controles: Inter 400, 600 y 700. Fuentes empaquetadas, controles táctiles de 48 px o más, radio 12 en controles y 16 en tarjetas. Los logos originales conservan sus proporciones.

## Biblioteca

Cada componente tiene su propio archivo y exports por categoría:

- Primitivas: Text, Heading, Icon, Button, IconButton, Card, Badge, Divider.
- Formularios: FormField, Input, TextArea, Select, Checkbox, Radio, RadioGroup, Toggle, SearchInput, DatePicker, TimePicker, DateTimePicker.
- Feedback: ProgressBar, LoadingState, EmptyState, ErrorState, Toast, ConfirmDialog.
- Layout: Screen, ScreenHeader, Section, FormLayout, AppShell, ModalSheet, ScrollArea y BrandMark.

`/component-gallery` permite manipular controles en desarrollo. No se enlaza desde el producto y redirige al perfil en producción.

## Contratos de controles

Los controles son controlados: reciben valor y callback; la pantalla decide qué hacer con los cambios. FormField proporciona etiqueta, ayuda, obligatoriedad y error. Los controles de edición admiten disabled, readOnly y testID. Input admite teclado, autocapitalización, límite de caracteres y foco visible; TextArea reutiliza la base con varias líneas.

Select acepta opciones `{label, value}`; RadioGroup reutiliza Radio y Toggle expone un valor booleano. Los selects muestran opciones dentro del layout para evitar modales anidados al seleccionar horas. Los botones tienen variantes primary, secondary, ghost y danger; loading y disabled bloquean la acción.

```tsx
<Input
  label={t('onboarding.name')}
  value={draft.name}
  onChangeText={name => setDraft(d => ({ ...d, name }))}
  required
  disabled={busy}
  error={fieldError}
/>
<Button label={t('common.save')} loading={busy} onPress={save} />
```

## Fecha y hora

```tsx
<DatePicker label="Fecha" value={date} onChange={setDate} min="2026-01-01" />
<TimePicker label="Horario" value={time} onChange={setTime} hourCycle={24} />
<DateTimePicker
  label="Cita"
  value={appointment}
  onChange={setAppointment}
  hourCycle={12}
  min={{ date: '2026-01-01', time: '08:00' }}
/>
```

En código de producto, reemplazar los labels literales del ejemplo por claves `t()`.

- DatePicker: `string | null`, formato `YYYY-MM-DD`.
- TimePicker: `string | null`, formato canónico `HH:mm`.
- DateTimePicker: `{date, time} | null`, valores locales sin conversión UTC implícita.
- Los tres admiten límites min/max, valor vacío, estado deshabilitado, solo lectura y obligatoriedad.
- `locale` predeterminado: es-PA. `hourCycle` predeterminado: 12. Los valores se sobrescriben por instancia.
- Mostrar 12 o 24 horas no cambia el valor guardado. 12 AM = 00:00; 12 PM = 12:00.
- Todos editan un borrador. Confirmar emite el valor; cancelar no modifica al consumidor. Limpiar está disponible en campos no obligatorios.
- El calendario utiliza el control nativo en Android/iOS y un campo date en web. La hora usa selección compartida de horas y minutos, con AM/PM cuando corresponde.

Estos valores expresan hora local; agendamiento entre zonas horarias y conversiones a instantes UTC requieren un contrato adicional al integrar servicios.

## ScrollArea

`Screen` es un envoltorio de `ScrollArea`: padding responsive, `maxWidth` 1080 y `gap` 26. El desplazamiento, el teclado y el botón de volver arriba viven en `ScrollArea`.

```tsx
<ScrollArea
  testID="workspace-scroll"
  showProgress
  refreshing={refreshing}
  onRefresh={reload}
>
  {children}
</ScrollArea>
```

- iOS: `automaticallyAdjustKeyboardInsets` y `keyboardDismissMode="interactive"`. No usa `KeyboardAvoidingView`.
- Android: el sistema redimensiona la ventana (`adjustResize`); el mismo `ScrollView` permanece desplazable con el teclado abierto.
- Web: el mismo componente; el contenido largo activa fades, progreso opcional y «Volver arriba» a partir de 480 px.
- Confirmar o cancelar en formularios no depende del scroll. `scrollTo` / `scrollToEnd` están disponibles por ref.
- `ModalSheet` conserva su `ScrollView` interno con el mismo ajuste de teclado por plataforma.

## Textos y accesibilidad

`locales/es.ts` centraliza etiquetas, ayudas, mensajes y validaciones. `t(key, params)` interpola y `countText` resuelve singular/plural. `config/app.ts` controla nombre, equipo, versión, idioma y ciclo horario.

Etiquetas visibles para formularios, nombres accesibles en botones de icono, roles y estado checked/disabled en controles. Errores anunciados con rol alert y confirmaciones con región viva. Los textos de producto no anuncian capacidades de IA todavía no implementadas.
