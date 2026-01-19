// Datos de ejemplo de torneos (en producción se obtendrían de Smoothcomp API)
// Nota: Smoothcomp no tiene API pública, estos son datos de ejemplo
const torneosEjemplo = [
    {
        nombre: "Copa Argentina de Brazilian Jiu-Jitsu",
        pais: "argentina",
        bandera: "🇦🇷",
        ciudad: "Buenos Aires",
        fecha: "2025-12-15",
        disciplina: "Brazilian Jiu-Jitsu",
        categorias: "Gi y No-Gi",
        inscriptos: 250,
        url: "https://smoothcomp.com"
    },
    {
        nombre: "Campeonato Nacional de Judo",
        pais: "argentina",
        bandera: "🇦🇷",
        ciudad: "Córdoba",
        fecha: "2025-12-20",
        disciplina: "Judo",
        categorias: "Todas las edades",
        inscriptos: 180,
        url: "https://smoothcomp.com"
    },
    {
        nombre: "Open Internacional de Grappling",
        pais: "brasil",
        bandera: "🇧🇷",
        ciudad: "São Paulo",
        fecha: "2025-12-10",
        disciplina: "Grappling",
        categorias: "Gi y No-Gi",
        inscriptos: 400,
        url: "https://smoothcomp.com"
    },
    {
        nombre: "Torneo Sudamericano de BJJ",
        pais: "chile",
        bandera: "🇨🇱",
        ciudad: "Santiago",
        fecha: "2026-01-15",
        disciplina: "Brazilian Jiu-Jitsu",
        categorias: "Gi",
        inscriptos: 150,
        url: "https://smoothcomp.com"
    },
    {
        nombre: "Copa Uruguay de Submission Wrestling",
        pais: "uruguay",
        bandera: "🇺🇾",
        ciudad: "Montevideo",
        fecha: "2026-01-20",
        disciplina: "Submission Wrestling",
        categorias: "No-Gi",
        inscriptos: 100,
        url: "https://smoothcomp.com"
    },
    {
        nombre: "Torneo Regional de Judo",
        pais: "argentina",
        bandera: "🇦🇷",
        ciudad: "Rosario",
        fecha: "2026-02-05",
        disciplina: "Judo",
        categorias: "Juvenil y Adultos",
        inscriptos: 120,
        url: "https://smoothcomp.com"
    }
];

let todosTorneos = [...torneosEjemplo];
let filtroActual = "todos";

function calcularDiasRestantes(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diff = fecha - hoy;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return dias;
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return `${fecha.getDate()} ${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

function crearTarjetaTorneo(torneo) {
    const card = document.createElement('div');
    card.className = 'torneo-card';
    card.dataset.pais = torneo.pais;
    
    const diasRestantes = calcularDiasRestantes(torneo.fecha);
    let diasTexto = '';
    
    if (diasRestantes < 0) {
        diasTexto = 'Finalizado';
    } else if (diasRestantes === 0) {
        diasTexto = '¡Hoy!';
    } else if (diasRestantes === 1) {
        diasTexto = '¡Mañana!';
    } else {
        diasTexto = `Faltan ${diasRestantes} días`;
    }
    
    card.innerHTML = `
        <div class="torneo-header">
            <span class="torneo-pais">${torneo.bandera}</span>
            <div class="torneo-fecha">${formatearFecha(torneo.fecha)}</div>
        </div>
        <div class="torneo-nombre">${torneo.nombre}</div>
        <div class="torneo-ubicacion">📍 ${torneo.ciudad}</div>
        <div class="torneo-detalles">
            <div class="torneo-detalle">🥋 ${torneo.disciplina}</div>
            <div class="torneo-detalle">🏆 ${torneo.categorias}</div>
            <div class="torneo-detalle">👥 ${torneo.inscriptos} inscriptos</div>
        </div>
        <div class="torneo-footer">
            <span class="torneo-dias">${diasTexto}</span>
            <a href="${torneo.url}" target="_blank" class="torneo-link">Ver más →</a>
        </div>
    `;
    
    return card;
}

function mostrarTorneos(torneos) {
    const grid = document.getElementById('torneosGrid');
    grid.innerHTML = '';
    
    if (torneos.length === 0) {
        grid.innerHTML = '<div class="no-torneos">No hay torneos programados para este filtro.</div>';
        return;
    }
    
    // Ordenar por fecha
    torneos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    torneos.forEach(torneo => {
        const tarjeta = crearTarjetaTorneo(torneo);
        grid.appendChild(tarjeta);
    });
}

function filtrarTorneos(pais) {
    filtroActual = pais;
    
    if (pais === 'todos') {
        mostrarTorneos(todosTorneos);
    } else {
        const filtrados = todosTorneos.filter(t => t.pais === pais);
        mostrarTorneos(filtrados);
    }
}

function cargarTorneos() {
    const loading = document.getElementById('loading');
    
    // Simular carga
    setTimeout(() => {
        loading.style.display = 'none';
        mostrarTorneos(todosTorneos);
    }, 500);
}

// Event listeners para filtros
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const pais = btn.dataset.pais;
        filtrarTorneos(pais);
    });
});

// Cargar torneos al iniciar
cargarTorneos();
