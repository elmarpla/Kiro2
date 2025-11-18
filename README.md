# Clima en Capitales de Argentina 🌤️

Aplicación web que muestra el clima actual en todas las capitales provinciales de Argentina.

## Uso

Simplemente abre `index.html` en tu navegador.

## Configuración

### Clima
**No requiere API key** - usa Open-Meteo, una API completamente gratuita.

### Fútbol (Opcional)
Para ver partidos reales en lugar de datos de ejemplo:

1. Regístrate gratis en [API-Football](https://www.api-football.com/)
2. Obtén tu API key del dashboard
3. Abre `futbol.js` y reemplaza `TU_API_KEY_AQUI` con tu API key en la línea 2:
   ```javascript
   const API_KEY = "tu_api_key_aqui";
   ```

Sin API key, la sección de fútbol mostrará datos de ejemplo.

## Características

- ✅ 24 capitales provinciales de Argentina
- ✅ Temperatura actual y sensación térmica
- ✅ Descripción del clima
- ✅ Humedad, viento y presión atmosférica
- ✅ Diseño responsive
- ✅ Iconos visuales del clima

## Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Gradientes)
- JavaScript (Fetch API, Async/Await)
- Open-Meteo API (gratuita, sin registro)
