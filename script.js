// Capitales de Argentina con sus provincias
const capitales = [
    { ciudad: "Buenos Aires", provincia: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
    { ciudad: "La Plata", provincia: "Buenos Aires", lat: -34.9215, lon: -57.9545 },
    { ciudad: "Catamarca", provincia: "Catamarca", lat: -28.4696, lon: -65.7795 },
    { ciudad: "Resistencia", provincia: "Chaco", lat: -27.4514, lon: -58.9867 },
    { ciudad: "Rawson", provincia: "Chubut", lat: -43.3002, lon: -65.1023 },
    { ciudad: "Córdoba", provincia: "Córdoba", lat: -31.4201, lon: -64.1888 },
    { ciudad: "Corrientes", provincia: "Corrientes", lat: -27.4692, lon: -58.8306 },
    { ciudad: "Paraná", provincia: "Entre Ríos", lat: -31.7333, lon: -60.5293 },
    { ciudad: "Formosa", provincia: "Formosa", lat: -26.1775, lon: -58.1781 },
    { ciudad: "San Salvador de Jujuy", provincia: "Jujuy", lat: -24.1858, lon: -65.2995 },
    { ciudad: "Santa Rosa", provincia: "La Pampa", lat: -36.6167, lon: -64.2833 },
    { ciudad: "La Rioja", provincia: "La Rioja", lat: -29.4131, lon: -66.8558 },
    { ciudad: "Mendoza", provincia: "Mendoza", lat: -32.8895, lon: -68.8458 },
    { ciudad: "Posadas", provincia: "Misiones", lat: -27.3671, lon: -55.8961 },
    { ciudad: "Neuquén", provincia: "Neuquén", lat: -38.9516, lon: -68.0591 },
    { ciudad: "Viedma", provincia: "Río Negro", lat: -40.8135, lon: -62.9967 },
    { ciudad: "Salta", provincia: "Salta", lat: -24.7859, lon: -65.4117 },
    { ciudad: "San Juan", provincia: "San Juan", lat: -31.5375, lon: -68.5364 },
    { ciudad: "San Luis", provincia: "San Luis", lat: -33.2950, lon: -66.3356 },
    { ciudad: "Río Gallegos", provincia: "Santa Cruz", lat: -51.6226, lon: -69.2181 },
    { ciudad: "Santa Fe", provincia: "Santa Fe", lat: -31.6333, lon: -60.7000 },
    { ciudad: "Santiago del Estero", provincia: "Santiago del Estero", lat: -27.7834, lon: -64.2642 },
    { ciudad: "Ushuaia", provincia: "Tierra del Fuego", lat: -54.8019, lon: -68.3029 },
    { ciudad: "San Miguel de Tucumán", provincia: "Tucumán", lat: -26.8083, lon: -65.2176 }
];

// Códigos de clima WMO (World Meteorological Organization)
const weatherCodes = {
    0: { descripcion: "Despejado", icono: "☀️" },
    1: { descripcion: "Mayormente despejado", icono: "🌤️" },
    2: { descripcion: "Parcialmente nublado", icono: "⛅" },
    3: { descripcion: "Nublado", icono: "☁️" },
    45: { descripcion: "Niebla", icono: "🌫️" },
    48: { descripcion: "Niebla con escarcha", icono: "🌫️" },
    51: { descripcion: "Llovizna ligera", icono: "🌦️" },
    53: { descripcion: "Llovizna moderada", icono: "🌦️" },
    55: { descripcion: "Llovizna intensa", icono: "🌧️" },
    61: { descripcion: "Lluvia ligera", icono: "🌧️" },
    63: { descripcion: "Lluvia moderada", icono: "🌧️" },
    65: { descripcion: "Lluvia intensa", icono: "🌧️" },
    71: { descripcion: "Nieve ligera", icono: "❄️" },
    73: { descripcion: "Nieve moderada", icono: "❄️" },
    75: { descripcion: "Nieve intensa", icono: "❄️" },
    77: { descripcion: "Granizo", icono: "🧊" },
    80: { descripcion: "Chubascos ligeros", icono: "🌦️" },
    81: { descripcion: "Chubascos moderados", icono: "🌧️" },
    82: { descripcion: "Chubascos intensos", icono: "⛈️" },
    85: { descripcion: "Chubascos de nieve ligeros", icono: "🌨️" },
    86: { descripcion: "Chubascos de nieve intensos", icono: "🌨️" },
    95: { descripcion: "Tormenta", icono: "⛈️" },
    96: { descripcion: "Tormenta con granizo ligero", icono: "⛈️" },
    99: { descripcion: "Tormenta con granizo intenso", icono: "⛈️" }
};

async function obtenerClima(ciudad, lat, lon) {
    // Open-Meteo API - Gratuita, sin API key
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl&timezone=America/Argentina/Buenos_Aires`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener datos");
        return await response.json();
    } catch (error) {
        console.error(`Error obteniendo clima para ${ciudad}:`, error);
        return null;
    }
}

async function obtenerPrevision(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=America/Argentina/Buenos_Aires`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener previsión");
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo previsión:", error);
        return null;
    }
}

function crearTarjetaClima(capital, datos) {
    const card = document.createElement("div");
    card.className = "weather-card";
    
    if (!datos || !datos.current) {
        card.innerHTML = `
            <div class="city-name">${capital.ciudad}</div>
            <div class="province">${capital.provincia}</div>
            <div class="error">No se pudo obtener el clima</div>
        `;
        return card;
    }
    
    const current = datos.current;
    const temp = Math.round(current.temperature_2m);
    const sensacion = Math.round(current.apparent_temperature);
    const humedad = current.relative_humidity_2m;
    const viento = Math.round(current.wind_speed_10m);
    const presion = Math.round(current.pressure_msl);
    const weatherCode = current.weather_code;
    const weatherInfo = weatherCodes[weatherCode] || { descripcion: "Desconocido", icono: "🌡️" };
    
    card.innerHTML = `
        <div class="city-name">${capital.ciudad}</div>
        <div class="province">${capital.provincia}</div>
        <div class="weather-info">
            <div class="temperature">${temp}°C</div>
            <div class="weather-icon">${weatherInfo.icono}</div>
        </div>
        <div class="description">${weatherInfo.descripcion}</div>
        <div class="details">
            <div class="detail-item">🌡️ Sensación: ${sensacion}°C</div>
            <div class="detail-item">💧 Humedad: ${humedad}%</div>
            <div class="detail-item">💨 Viento: ${viento} km/h</div>
            <div class="detail-item">📊 Presión: ${presion} hPa</div>
        </div>
        <div class="forecast-link">👆 Click para ver previsión de 7 días</div>
    `;
    
    // Agregar evento click para mostrar previsión
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
        mostrarPrevision(capital);
    });
    
    return card;
}

async function mostrarPrevision(capital) {
    const modal = document.getElementById("forecastModal");
    const modalContent = document.getElementById("forecastContent");
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${capital.ciudad}</h2>
            <span class="close-modal" onclick="cerrarModal()">&times;</span>
        </div>
        <div class="loading-forecast">Cargando previsión...</div>
    `;
    
    modal.style.display = "flex";
    
    const prevision = await obtenerPrevision(capital.lat, capital.lon);
    
    if (!prevision || !prevision.daily) {
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${capital.ciudad}</h2>
                <span class="close-modal" onclick="cerrarModal()">&times;</span>
            </div>
            <div class="error">No se pudo cargar la previsión</div>
        `;
        return;
    }
    
    const daily = prevision.daily;
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    
    let forecastHTML = `
        <div class="modal-header">
            <h2>${capital.ciudad}</h2>
            <span class="close-modal" onclick="cerrarModal()">&times;</span>
        </div>
        <div class="forecast-grid">
    `;
    
    for (let i = 0; i < 7; i++) {
        const fecha = new Date(daily.time[i]);
        const diaSemana = i === 0 ? "Hoy" : dias[fecha.getDay()];
        const tempMax = Math.round(daily.temperature_2m_max[i]);
        const tempMin = Math.round(daily.temperature_2m_min[i]);
        const weatherCode = daily.weather_code[i];
        const weatherInfo = weatherCodes[weatherCode] || { descripcion: "Desconocido", icono: "🌡️" };
        const precipitacion = daily.precipitation_sum[i];
        const viento = Math.round(daily.wind_speed_10m_max[i]);
        
        forecastHTML += `
            <div class="forecast-day">
                <div class="forecast-date">${diaSemana}</div>
                <div class="forecast-icon">${weatherInfo.icono}</div>
                <div class="forecast-temps">
                    <span class="temp-max">${tempMax}°</span>
                    <span class="temp-min">${tempMin}°</span>
                </div>
                <div class="forecast-desc">${weatherInfo.descripcion}</div>
                <div class="forecast-extra">
                    <div>💧 ${precipitacion} mm</div>
                    <div>💨 ${viento} km/h</div>
                </div>
            </div>
        `;
    }
    
    forecastHTML += `</div>`;
    modalContent.innerHTML = forecastHTML;
}

function cerrarModal() {
    document.getElementById("forecastModal").style.display = "none";
}

async function cargarTodosLosClimas() {
    const loading = document.getElementById("loading");
    const grid = document.getElementById("weatherGrid");
    
    // Cargar climas de forma paralela
    const promesas = capitales.map(capital => 
        obtenerClima(capital.ciudad, capital.lat, capital.lon)
            .then(datos => ({ capital, datos }))
    );
    
    const resultados = await Promise.all(promesas);
    
    loading.style.display = "none";
    
    resultados.forEach(({ capital, datos }) => {
        const tarjeta = crearTarjetaClima(capital, datos);
        grid.appendChild(tarjeta);
    });
}

// Buscar ciudades
async function buscarCiudades(query) {
    if (query.length < 2) return [];
    
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=es&format=json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la búsqueda");
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error buscando ciudades:", error);
        return [];
    }
}

function mostrarResultadosBusqueda(ciudades) {
    const resultsDiv = document.getElementById("searchResults");
    
    if (ciudades.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No se encontraron ciudades</div>';
        resultsDiv.classList.add("show");
        return;
    }
    
    resultsDiv.innerHTML = ciudades.map(ciudad => {
        const pais = ciudad.country || "";
        const admin = ciudad.admin1 || "";
        const detalles = [admin, pais].filter(Boolean).join(", ");
        
        return `
            <div class="search-result-item" data-lat="${ciudad.latitude}" data-lon="${ciudad.longitude}" data-name="${ciudad.name}">
                <div class="result-city">${ciudad.name}</div>
                <div class="result-details">${detalles}</div>
            </div>
        `;
    }).join("");
    
    resultsDiv.classList.add("show");
    
    // Agregar eventos de click
    resultsDiv.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", async () => {
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.dataset.name;
            
            // Ocultar resultados
            resultsDiv.classList.remove("show");
            document.getElementById("searchInput").value = "";
            
            // Obtener y mostrar clima
            const datos = await obtenerClima(name, lat, lon);
            const capital = { ciudad: name, provincia: "", lat, lon };
            const tarjeta = crearTarjetaClima(capital, datos);
            
            // Agregar al inicio del grid
            const grid = document.getElementById("weatherGrid");
            grid.insertBefore(tarjeta, grid.firstChild);
            
            // Scroll suave a la tarjeta
            tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
            tarjeta.style.animation = "highlight 1s ease";
        });
    });
}

// Event listeners para búsqueda
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

let searchTimeout;
searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        searchResults.classList.remove("show");
        return;
    }
    
    searchResults.innerHTML = '<div class="searching">Buscando...</div>';
    searchResults.classList.add("show");
    
    searchTimeout = setTimeout(async () => {
        const ciudades = await buscarCiudades(query);
        mostrarResultadosBusqueda(ciudades);
    }, 300);
});

searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query.length >= 2) {
        searchResults.innerHTML = '<div class="searching">Buscando...</div>';
        searchResults.classList.add("show");
        const ciudades = await buscarCiudades(query);
        mostrarResultadosBusqueda(ciudades);
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// Cerrar resultados al hacer click fuera
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-section")) {
        searchResults.classList.remove("show");
    }
});

// Cerrar modal al hacer click fuera
document.getElementById("forecastModal").addEventListener("click", (e) => {
    if (e.target.id === "forecastModal") {
        cerrarModal();
    }
});

// Obtener ubicación actual del usuario
async function obtenerUbicacionActual() {
    if (!navigator.geolocation) {
        console.log("Geolocalización no disponible");
        return;
    }
    
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => {
                console.log("No se pudo obtener la ubicación:", error.message);
                reject(error);
            },
            { timeout: 5000 }
        );
    });
}

async function obtenerNombreCiudad(lat, lon) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=es&format=json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener nombre de ciudad");
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].name;
        }
        return "Tu ubicación";
    } catch (error) {
        console.error("Error obteniendo nombre de ciudad:", error);
        return "Tu ubicación";
    }
}

async function cargarClimaUbicacionActual() {
    try {
        const position = await obtenerUbicacionActual();
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        const nombreCiudad = await obtenerNombreCiudad(lat, lon);
        const datos = await obtenerClima(nombreCiudad, lat, lon);
        
        const capital = { 
            ciudad: nombreCiudad, 
            provincia: "📍 Tu ubicación actual", 
            lat, 
            lon 
        };
        
        const tarjeta = crearTarjetaClima(capital, datos);
        tarjeta.classList.add("location-card");
        
        const grid = document.getElementById("weatherGrid");
        grid.insertBefore(tarjeta, grid.firstChild);
        
        // Pequeña animación
        setTimeout(() => {
            tarjeta.style.animation = "highlight 1s ease";
        }, 100);
        
    } catch (error) {
        console.log("No se pudo cargar el clima de la ubicación actual");
    }
}

// Cargar climas al iniciar
async function inicializar() {
    // Primero intentar cargar ubicación actual
    await cargarClimaUbicacionActual();
    // Luego cargar las capitales
    await cargarTodosLosClimas();
}

inicializar();
