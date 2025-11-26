// Feriados Argentina 2025
const feriados2025 = [
    { fecha: "2025-01-01", nombre: "Año Nuevo", tipo: "Inamovible" },
    { fecha: "2025-02-24", nombre: "Carnaval", tipo: "Inamovible" },
    { fecha: "2025-02-25", nombre: "Carnaval", tipo: "Inamovible" },
    { fecha: "2025-03-24", nombre: "Día Nacional de la Memoria por la Verdad y la Justicia", tipo: "Inamovible" },
    { fecha: "2025-04-02", nombre: "Día del Veterano y de los Caídos en la Guerra de Malvinas", tipo: "Inamovible" },
    { fecha: "2025-04-18", nombre: "Viernes Santo", tipo: "Inamovible" },
    { fecha: "2025-05-01", nombre: "Día del Trabajador", tipo: "Inamovible" },
    { fecha: "2025-05-25", nombre: "Día de la Revolución de Mayo", tipo: "Inamovible" },
    { fecha: "2025-06-16", nombre: "Paso a la Inmortalidad del General Martín Miguel de Güemes", tipo: "Inamovible" },
    { fecha: "2025-06-20", nombre: "Paso a la Inmortalidad del General Manuel Belgrano", tipo: "Inamovible" },
    { fecha: "2025-07-09", nombre: "Día de la Independencia", tipo: "Inamovible" },
    { fecha: "2025-08-15", nombre: "Paso a la Inmortalidad del General José de San Martín", tipo: "Puente" },
    { fecha: "2025-10-10", nombre: "Día del Respeto a la Diversidad Cultural", tipo: "Puente" },
    { fecha: "2025-11-21", nombre: "Día de la Soberanía Nacional", tipo: "Puente" },
    { fecha: "2025-12-08", nombre: "Día de la Inmaculada Concepción de María", tipo: "Inamovible" },
    { fecha: "2025-12-25", nombre: "Navidad", tipo: "Inamovible" }
];

function calcularDiferencia(fecha1, fecha2) {
    const diff = Math.abs(fecha2 - fecha1);
    
    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    return {
        dias,
        horas: horas % 24,
        minutos: minutos % 60,
        segundos: segundos % 60
    };
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
}

function obtenerProximoFeriado() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    for (let feriado of feriados2025) {
        const fechaFeriado = new Date(feriado.fecha + 'T00:00:00');
        if (fechaFeriado >= hoy) {
            return feriado;
        }
    }
    
    return null;
}

function actualizarProximoFeriado() {
    const proximo = obtenerProximoFeriado();
    
    if (!proximo) {
        document.getElementById('proximoNombre').textContent = 'No hay más feriados este año';
        document.getElementById('proximoFecha').textContent = '';
        document.getElementById('proximoCountdown').innerHTML = '';
        return;
    }
    
    const fechaFeriado = new Date(proximo.fecha + 'T00:00:00');
    const ahora = new Date();
    const diff = calcularDiferencia(ahora, fechaFeriado);
    
    document.getElementById('proximoNombre').textContent = proximo.nombre;
    document.getElementById('proximoFecha').textContent = formatearFecha(proximo.fecha);
    
    let countdownHTML = '';
    
    if (diff.dias === 0 && diff.horas === 0 && diff.minutos === 0) {
        countdownHTML = '<div style="font-size: 2rem; color: #667eea; font-weight: bold;">¡Es hoy! 🎉</div>';
    } else {
        countdownHTML = `
            <div class="countdown-item">
                <span class="countdown-valor">${diff.dias}</span>
                <span class="countdown-label">${diff.dias === 1 ? 'Día' : 'Días'}</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-valor">${diff.horas}</span>
                <span class="countdown-label">${diff.horas === 1 ? 'Hora' : 'Horas'}</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-valor">${diff.minutos}</span>
                <span class="countdown-label">${diff.minutos === 1 ? 'Minuto' : 'Minutos'}</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-valor">${diff.segundos}</span>
                <span class="countdown-label">${diff.segundos === 1 ? 'Segundo' : 'Segundos'}</span>
            </div>
        `;
    }
    
    document.getElementById('proximoCountdown').innerHTML = countdownHTML;
}

function mostrarFeriados() {
    const grid = document.getElementById('feriadosGrid');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const proximoFeriado = obtenerProximoFeriado();
    
    grid.innerHTML = '';
    
    feriados2025.forEach(feriado => {
        const fechaFeriado = new Date(feriado.fecha + 'T00:00:00');
        const diff = calcularDiferencia(hoy, fechaFeriado);
        
        const card = document.createElement('div');
        card.className = 'feriado-card';
        
        // Determinar si es pasado, próximo o futuro
        if (fechaFeriado < hoy) {
            card.classList.add('pasado');
        } else if (proximoFeriado && feriado.fecha === proximoFeriado.fecha) {
            card.classList.add('proximo');
        }
        
        if (feriado.tipo === 'Puente') {
            card.classList.add('puente');
        }
        
        let diasTexto = '';
        if (fechaFeriado < hoy) {
            diasTexto = `Pasó hace ${diff.dias} ${diff.dias === 1 ? 'día' : 'días'}`;
        } else if (diff.dias === 0) {
            diasTexto = '¡Es hoy! 🎉';
        } else if (diff.dias === 1) {
            diasTexto = '¡Mañana!';
        } else {
            diasTexto = `Faltan ${diff.dias} ${diff.dias === 1 ? 'día' : 'días'}`;
        }
        
        card.innerHTML = `
            <div class="feriado-fecha">${formatearFecha(feriado.fecha)}</div>
            <div class="feriado-nombre">${feriado.nombre}</div>
            <span class="feriado-tipo">${feriado.tipo}</span>
            <div class="feriado-dias">${diasTexto}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Actualizar cada segundo
actualizarProximoFeriado();
mostrarFeriados();

setInterval(() => {
    actualizarProximoFeriado();
    mostrarFeriados();
}, 1000);
