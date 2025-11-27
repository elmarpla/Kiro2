// Feriados Argentina 2025 y 2026
const todosFeriados = [
    // 2025
    { fecha: "2025-01-01", nombre: "Año Nuevo", tipo: "Inamovible" },
    { fecha: "2025-02-24", nombre: "Carnaval", tipo: "Inamovible" },
    { fecha: "2025-02-25", nombre: "Carnaval", tipo: "Inamovible" },
    { fecha: "2025-03-24", nombre: "Día Nacional de la Memoria por la Verdad y la Justicia", tipo: "Inamovible" },
    { fecha: "2025-04-02", nombre: "Día del Veterano y de los Caídos en la Guerra de Malvinas", tipo: "Inamovible" },
    { fecha: "2025-04-17", nombre: "Jueves Santo", tipo: "No laborable" },
    { fecha: "2025-04-18", nombre: "Viernes Santo", tipo: "Inamovible" },
    { fecha: "2025-05-01", nombre: "Día del Trabajador", tipo: "Inamovible" },
    { fecha: "2025-05-02", nombre: "Puente Turístico", tipo: "No laborable" },
    { fecha: "2025-05-25", nombre: "Día de la Revolución de Mayo", tipo: "Inamovible" },
    { fecha: "2025-06-16", nombre: "Paso a la Inmortalidad del General Martín Miguel de Güemes", tipo: "Inamovible" },
    { fecha: "2025-06-20", nombre: "Paso a la Inmortalidad del General Manuel Belgrano", tipo: "Inamovible" },
    { fecha: "2025-07-09", nombre: "Día de la Independencia", tipo: "Inamovible" },
    { fecha: "2025-08-18", nombre: "Paso a la Inmortalidad del General José de San Martín", tipo: "Trasladable" },
    { fecha: "2025-10-13", nombre: "Día del Respeto a la Diversidad Cultural", tipo: "Trasladable" },
    { fecha: "2025-11-21", nombre: "Puente Turístico", tipo: "No laborable" },
    { fecha: "2025-11-24", nombre: "Día de la Soberanía Nacional", tipo: "Trasladable" },
    { fecha: "2025-12-08", nombre: "Día de la Inmaculada Concepción de María", tipo: "Inamovible" },
    { fecha: "2025-12-25", nombre: "Navidad", tipo: "Inamovible" },
    { fecha: "2025-12-26", nombre: "Puente Turístico", tipo: "No laborable" },
    
    // 2026
    { fecha: "2026-01-01", nombre: "Año Nuevo", tipo: "Inamovible" },
    { fecha: "2026-02-16", nombre: "Carnaval", tipo: "Inamovible" },
    { fecha: "2026-02-17", nombre: "Carnaval", tipo: "Inamovible" },
    { fecha: "2026-03-24", nombre: "Día Nacional de la Memoria por la Verdad y la Justicia", tipo: "Inamovible" },
    { fecha: "2026-04-02", nombre: "Jueves Santo", tipo: "No laborable" },
    { fecha: "2026-04-03", nombre: "Viernes Santo", tipo: "Inamovible" },
    { fecha: "2026-04-02", nombre: "Día del Veterano y de los Caídos en la Guerra de Malvinas", tipo: "Inamovible" },
    { fecha: "2026-05-01", nombre: "Día del Trabajador", tipo: "Inamovible" },
    { fecha: "2026-05-25", nombre: "Día de la Revolución de Mayo", tipo: "Inamovible" },
    { fecha: "2026-06-15", nombre: "Paso a la Inmortalidad del General Martín Miguel de Güemes", tipo: "Trasladable" },
    { fecha: "2026-06-22", nombre: "Paso a la Inmortalidad del General Manuel Belgrano", tipo: "Trasladable" },
    { fecha: "2026-07-09", nombre: "Día de la Independencia", tipo: "Inamovible" },
    { fecha: "2026-08-17", nombre: "Paso a la Inmortalidad del General José de San Martín", tipo: "Trasladable" },
    { fecha: "2026-10-12", nombre: "Día del Respeto a la Diversidad Cultural", tipo: "Trasladable" },
    { fecha: "2026-11-23", nombre: "Día de la Soberanía Nacional", tipo: "Trasladable" },
    { fecha: "2026-12-08", nombre: "Día de la Inmaculada Concepción de María", tipo: "Inamovible" },
    { fecha: "2026-12-25", nombre: "Navidad", tipo: "Inamovible" }
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

function obtenerFeriadosFuturos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return todosFeriados.filter(feriado => {
        const fechaFeriado = new Date(feriado.fecha + 'T00:00:00');
        return fechaFeriado >= hoy;
    });
}

function obtenerProximoFeriado() {
    const futuros = obtenerFeriadosFuturos();
    return futuros.length > 0 ? futuros[0] : null;
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
    
    const feriadosFuturos = obtenerFeriadosFuturos();
    const proximoFeriado = obtenerProximoFeriado();
    
    grid.innerHTML = '';
    
    if (feriadosFuturos.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No hay más feriados programados</div>';
        return;
    }
    
    feriadosFuturos.forEach(feriado => {
        const fechaFeriado = new Date(feriado.fecha + 'T00:00:00');
        const diff = calcularDiferencia(hoy, fechaFeriado);
        
        const card = document.createElement('div');
        card.className = 'feriado-card';
        
        // Determinar si es el próximo
        if (proximoFeriado && feriado.fecha === proximoFeriado.fecha) {
            card.classList.add('proximo');
        }
        
        if (feriado.tipo === 'Trasladable' || feriado.tipo === 'No laborable') {
            card.classList.add('puente');
        }
        
        let diasTexto = '';
        if (diff.dias === 0) {
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

// Variables para el calendario
let mesActual = new Date().getMonth();
let añoActual = new Date().getFullYear();

function cambiarMes(direccion) {
    mesActual += direccion;
    
    if (mesActual > 11) {
        mesActual = 0;
        añoActual++;
    } else if (mesActual < 0) {
        mesActual = 11;
        añoActual--;
    }
    
    generarCalendario();
}

function generarCalendario() {
    const calendario = document.getElementById('calendario');
    const mesActualDiv = document.getElementById('mesActual');
    
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    mesActualDiv.textContent = `${meses[mesActual]} ${añoActual}`;
    
    // Limpiar calendario
    calendario.innerHTML = '';
    
    // Días de la semana
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    diasSemana.forEach(dia => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-semana';
        diaDiv.textContent = dia;
        calendario.appendChild(diaDiv);
    });
    
    // Primer día del mes
    const primerDia = new Date(añoActual, mesActual, 1);
    const ultimoDia = new Date(añoActual, mesActual + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay();
    
    // Días del mes anterior
    const mesAnterior = new Date(añoActual, mesActual, 0);
    const diasMesAnterior = mesAnterior.getDate();
    
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
        const diaDiv = crearDiaCalendario(diasMesAnterior - i, mesActual - 1, añoActual, true);
        calendario.appendChild(diaDiv);
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const diaDiv = crearDiaCalendario(dia, mesActual, añoActual, false);
        calendario.appendChild(diaDiv);
    }
    
    // Días del mes siguiente
    const diasRestantes = 42 - (primerDiaSemana + diasEnMes);
    for (let dia = 1; dia <= diasRestantes; dia++) {
        const diaDiv = crearDiaCalendario(dia, mesActual + 1, añoActual, true);
        calendario.appendChild(diaDiv);
    }
}

function crearDiaCalendario(dia, mes, año, otroMes) {
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia';
    
    if (otroMes) {
        diaDiv.classList.add('otro-mes');
    }
    
    // Ajustar mes si es necesario
    let mesReal = mes;
    let añoReal = año;
    
    if (mes < 0) {
        mesReal = 11;
        añoReal--;
    } else if (mes > 11) {
        mesReal = 0;
        añoReal++;
    }
    
    const fechaStr = `${añoReal}-${String(mesReal + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const fecha = new Date(fechaStr + 'T00:00:00');
    
    // Verificar si es hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fecha.getTime() === hoy.getTime() && !otroMes) {
        diaDiv.classList.add('hoy');
    }
    
    // Buscar si es feriado
    const feriado = todosFeriados.find(f => f.fecha === fechaStr);
    
    if (feriado) {
        if (feriado.tipo === 'Inamovible') {
            diaDiv.classList.add('feriado-inamovible');
        } else if (feriado.tipo === 'Trasladable') {
            diaDiv.classList.add('feriado-trasladable');
        } else if (feriado.tipo === 'No laborable') {
            diaDiv.classList.add('feriado-no-laborable');
        }
        
        diaDiv.innerHTML = `
            <span class="dia-numero">${dia}</span>
            <span class="dia-nombre">${feriado.nombre}</span>
        `;
        
        diaDiv.title = feriado.nombre;
    } else {
        diaDiv.innerHTML = `<span class="dia-numero">${dia}</span>`;
    }
    
    return diaDiv;
}

// Actualizar cada segundo
actualizarProximoFeriado();
mostrarFeriados();
generarCalendario();

setInterval(() => {
    actualizarProximoFeriado();
    mostrarFeriados();
}, 1000);
