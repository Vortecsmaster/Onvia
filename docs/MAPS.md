# Mapas offline ONVIA

El mapa nativo usa MapLibre y un contorno de Panamá embebido. Los 16 lugares de salud viven en SQLite.

## Panamá (esta entrega)

- Contorno: `src/data/panama-outline.json`
- POIs: tabla `places` (seed desde `src/data/places.json`)
- No se usan Google Maps, Leaflet ni WebView

## Otros países (futuro)

1. Extraer un `.mbtiles` del país (`pmtiles extract --bbox=...` o Geofabrik Shortbread).
2. Guardarlo en `assets/maps/<iso>.mbtiles`.
3. Añadir el archivo al style de MapLibre con `mbtiles://`.
4. Cargar POIs de ese país en SQLite.

No hace falta cambiar el renderer: un archivo de tiles + filas de lugares por país.
