// Fuentes de noticias con sus RSS feeds
const fuentes = {
    clarin: {
        nombre: "Clarín",
        url: "https://www.clarin.com/rss/lo-ultimo/",
        clase: "source-clarin"
    },
    lanacion: {
        nombre: "La Nación",
        url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/",
        clase: "source-lanacion"
    },
    ambito: {
        nombre: "Ámbito",
        url: "https://www.ambito.com/rss/home.xml",
        clase: "source-infobae"
    },
    perfil: {
        nombre: "Perfil",
        url: "https://www.perfil.com/feed",
        clase: "source-pagina12"
    },
    lacapital: {
        nombre: "La Capital MDP",
        url: "https://www.lacapitalmdp.com/rss/",
        clase: "source-infobae"
    }
};

let todasLasNoticias = [];
let filtroActual = "all";

async function obtenerNoticias(fuente, config) {
    // Usar rss2json sin API key (versión gratuita)
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.url)}`;
    
    try {
        const response = await fetch(rss2jsonUrl);
        if (!response.ok) throw new Error("Error al obtener noticias");
        const data = await response.json();
        
        if (data.status !== "ok") {
            console.error(`Error en ${config.nombre}:`, data.message);
            return [];
        }
        
        return data.items.slice(0, 10).map(item => ({
            fuente: fuente,
            nombreFuente: config.nombre,
            clase: config.clase,
            titulo: item.title,
            descripcion: limpiarDescripcion(item.description),
            link: item.link,
            fecha: new Date(item.pubDate)
        }));
    } catch (error) {
        console.error(`Error obteniendo noticias de ${config.nombre}:`, error);
        return [];
    }
}

function limpiarDescripcion(html) {
    if (!html) return "";
    // Remover tags HTML y limitar longitud
    const texto = html.replace(/<[^>]*>/g, "").trim();
    return texto.length > 150 ? texto.substring(0, 150) + "..." : texto;
}

function formatearFecha(fecha) {
    const ahora = new Date();
    const diff = Math.floor((ahora - fecha) / 1000); // diferencia en segundos
    
    if (diff < 60) return "Hace un momento";
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 172800) return "Ayer";
    
    return fecha.toLocaleDateString("es-AR", { 
        day: "numeric", 
        month: "short" 
    });
}

function crearTarjetaNoticia(noticia) {
    const card = document.createElement("div");
    card.className = "news-card";
    card.dataset.source = noticia.fuente;
    
    card.innerHTML = `
        <span class="news-source ${noticia.clase}">${noticia.nombreFuente}</span>
        <div class="news-title">${noticia.titulo}</div>
        <div class="news-description">${noticia.descripcion}</div>
        <div class="news-footer">
            <span class="news-date">${formatearFecha(noticia.fecha)}</span>
            <a href="${noticia.link}" target="_blank" class="news-link">Leer más →</a>
        </div>
    `;
    
    return card;
}

function mostrarNoticias(noticias) {
    const grid = document.getElementById("newsGrid");
    grid.innerHTML = "";
    
    if (noticias.length === 0) {
        grid.innerHTML = '<div class="error-message">No se pudieron cargar las noticias. Intenta nuevamente más tarde.</div>';
        return;
    }
    
    noticias.forEach(noticia => {
        const tarjeta = crearTarjetaNoticia(noticia);
        grid.appendChild(tarjeta);
    });
}

function filtrarNoticias(fuente) {
    filtroActual = fuente;
    
    if (fuente === "all") {
        mostrarNoticias(todasLasNoticias);
    } else {
        const filtradas = todasLasNoticias.filter(n => n.fuente === fuente);
        mostrarNoticias(filtradas);
    }
}

async function cargarTodasLasNoticias() {
    const loading = document.getElementById("loading");
    const grid = document.getElementById("newsGrid");
    
    loading.style.display = "block";
    grid.innerHTML = "";
    
    // Cargar noticias de todas las fuentes en paralelo
    const promesas = Object.entries(fuentes).map(([fuente, config]) => 
        obtenerNoticias(fuente, config)
    );
    
    const resultados = await Promise.all(promesas);
    
    // Combinar todas las noticias
    todasLasNoticias = resultados.flat();
    
    // Ordenar por fecha (más recientes primero)
    todasLasNoticias.sort((a, b) => b.fecha - a.fecha);
    
    loading.style.display = "none";
    
    if (todasLasNoticias.length === 0) {
        grid.innerHTML = '<div class="error-message">No se pudieron cargar las noticias. Por favor, intenta nuevamente más tarde.</div>';
    } else {
        mostrarNoticias(todasLasNoticias);
        
        // Mostrar mensaje si algunas fuentes fallaron
        const fuentesCargadas = new Set(todasLasNoticias.map(n => n.fuente));
        const fuentesTotales = Object.keys(fuentes).length;
        
        if (fuentesCargadas.size < fuentesTotales) {
            console.log(`Se cargaron ${fuentesCargadas.size} de ${fuentesTotales} fuentes`);
        }
    }
}

// Event listeners para filtros
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        // Actualizar botón activo
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // Filtrar noticias
        const fuente = btn.dataset.source;
        filtrarNoticias(fuente);
    });
});

// Cargar noticias al iniciar
cargarTodasLasNoticias();
