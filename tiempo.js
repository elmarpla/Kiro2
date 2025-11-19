// Eventos predefinidos importantes
const eventosImportantes = [
    { nombre: "Año Nuevo 2026", fecha: "2026-01-01T00:00:00" },
    { nombre: "Navidad 2025", fecha: "2025-12-25T00:00:00" },
    { nombre: "Día de la Independencia", fecha: "2025-07-09T00:00:00" },
    { nombre: "Día de la Primavera", fecha: "2025-09-21T00:00:00" }
];

let intervalosActivos = [];

function calcularDiferencia(fecha1, fecha2) {
    const diff = Math.abs(fecha2 - fecha1);
    
    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    // Cálculo más preciso de años y meses
    let años = 0;
    let meses = 0;
    
    const fechaMayor = fecha1 > fecha2 ? fecha1 : fecha2;
    const fechaMenor = fecha1 > fecha2 ? fecha2 : fecha1;
    
    años = fechaMayor.getFullYear() - fechaMenor.getFullYear();
    meses = fechaMayor.getMonth() - fechaMenor.getMonth();
    
    if (meses < 0) {
        años--;
        meses += 12;
    }
    
    // Ajustar si el día del mes es menor
    if (fechaMayor.getDate() < fechaMenor.getDate()) {
        meses--;
        if (meses < 0) {
            años--;
            meses += 12;
        }
    }
    
    return {
        años,
        meses,
        dias,
        horas: horas % 24,
        minutos: minutos % 60,
        segundos: segundos % 60,
        totalDias: dias,
        totalHoras: horas,
        totalMinutos: minutos,
        totalSegundos: segundos
    };
}

function mostrarResultado(elementId, fechaInicio, fechaFin, esFuturo = false) {
    const elemento = document.getElementById(elementId);
    const diff = calcularDiferencia(fechaInicio, fechaFin);
    
    const verbo = esFuturo ? "faltan" : "pasaron";
    const preposicion = esFuturo ? "para" : "desde";
    
    elemento.innerHTML = `
        <div class="tiempo-grid">
            <div class="tiempo-item">
                <span class="tiempo-valor">${diff.años}</span>
                <span class="tiempo-label">${diff.años === 1 ? 'Año' : 'Años'}</span>
            </div>
            <div class="tiempo-item">
                <span class="tiempo-valor">${diff.meses}</span>
                <span class="tiempo-label">${diff.meses === 1 ? 'Mes' : 'Meses'}</span>
            </div>
            <div class="tiempo-item">
                <span class="tiempo-valor">${diff.dias % 30}</span>
                <span class="tiempo-label">${diff.dias === 1 ? 'Día' : 'Días'}</span>
            </div>
            <div class="tiempo-item">
                <span class="tiempo-valor">${diff.horas}</span>
                <span class="tiempo-label">${diff.horas === 1 ? 'Hora' : 'Horas'}</span>
            </div>
            <div class="tiempo-item">
                <span class="tiempo-valor">${diff.minutos}</span>
                <span class="tiempo-label">${diff.minutos === 1 ? 'Minuto' : 'Minutos'}</span>
            </div>
            <div class="tiempo-item">
                <span class="tiempo-valor">${diff.segundos}</span>
                <span class="tiempo-label">${diff.segundos === 1 ? 'Segundo' : 'Segundos'}</span>
            </div>
        </div>
        <div class="tiempo-total">
            <strong>En total ${verbo}:</strong><br>
            ${diff.totalDias.toLocaleString()} días<br>
            ${diff.totalHoras.toLocaleString()} horas<br>
            ${diff.totalMinutos.toLocaleString()} minutos<br>
            ${diff.totalSegundos.toLocaleString()} segundos
        </div>
    `;
    
    elemento.classList.add('show');
}

function calcularDesde() {
    const fechaInput = document.getElementById('fechaDesde').value;
    
    if (!fechaInput) {
        alert('Por favor selecciona una fecha');
        return;
    }
    
    const fechaSeleccionada = new Date(fechaInput);
    const ahora = new Date();
    
    if (fechaSeleccionada > ahora) {
        alert('La fecha seleccionada es en el futuro. Usa "Tiempo hasta..." para fechas futuras.');
        return;
    }
    
    // Limpiar intervalo anterior si existe
    intervalosActivos.forEach(intervalo => clearInterval(intervalo));
    intervalosActivos = [];
    
    // Actualizar cada segundo
    const actualizar = () => mostrarResultado('resultadoDesde', fechaSeleccionada, new Date(), false);
    actualizar();
    
    const intervalo = setInterval(actualizar, 1000);
    intervalosActivos.push(intervalo);
}

function calcularHasta() {
    const fechaInput = document.getElementById('fechaHasta').value;
    
    if (!fechaInput) {
        alert('Por favor selecciona una fecha');
        return;
    }
    
    const fechaSeleccionada = new Date(fechaInput);
    const ahora = new Date();
    
    if (fechaSeleccionada < ahora) {
        alert('La fecha seleccionada es en el pasado. Usa "Tiempo desde..." para fechas pasadas.');
        return;
    }
    
    // Limpiar intervalo anterior si existe
    intervalosActivos.forEach(intervalo => clearInterval(intervalo));
    intervalosActivos = [];
    
    // Actualizar cada segundo
    const actualizar = () => mostrarResultado('resultadoHasta', new Date(), fechaSeleccionada, true);
    actualizar();
    
    const intervalo = setInterval(actualizar, 1000);
    intervalosActivos.push(intervalo);
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function actualizarEventos() {
    const grid = document.getElementById('eventosGrid');
    const ahora = new Date();
    
    grid.innerHTML = '';
    
    eventosImportantes.forEach(evento => {
        const fechaEvento = new Date(evento.fecha);
        const diff = calcularDiferencia(ahora, fechaEvento);
        
        const card = document.createElement('div');
        card.className = 'evento-card';
        
        let tiempoTexto;
        if (fechaEvento > ahora) {
            if (diff.dias === 0) {
                tiempoTexto = '¡Hoy!';
            } else if (diff.dias === 1) {
                tiempoTexto = '¡Mañana!';
            } else if (diff.dias < 30) {
                tiempoTexto = `${diff.dias} días`;
            } else if (diff.meses < 12) {
                tiempoTexto = `${diff.meses} ${diff.meses === 1 ? 'mes' : 'meses'}`;
            } else {
                tiempoTexto = `${diff.años} ${diff.años === 1 ? 'año' : 'años'}`;
            }
        } else {
            tiempoTexto = 'Pasó';
        }
        
        card.innerHTML = `
            <div class="evento-nombre">${evento.nombre}</div>
            <div class="evento-fecha">${formatearFecha(evento.fecha)}</div>
            <div class="evento-tiempo">${tiempoTexto}</div>
        `;
        
        card.addEventListener('click', () => {
            if (fechaEvento > ahora) {
                document.getElementById('fechaHasta').value = evento.fecha.slice(0, 16);
                calcularHasta();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                document.getElementById('fechaDesde').value = evento.fecha.slice(0, 16);
                calcularDesde();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        grid.appendChild(card);
    });
}

// Actualizar eventos cada minuto
actualizarEventos();
setInterval(actualizarEventos, 60000);

// Establecer fecha actual como valor por defecto
const ahora = new Date();
const ahoraStr = ahora.toISOString().slice(0, 16);
document.getElementById('fechaDesde').value = ahoraStr;
document.getElementById('fechaHasta').value = ahoraStr;
