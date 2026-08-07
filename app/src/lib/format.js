export function formatHora(hora) {
    if (!hora) return "";
    if (typeof hora === "string" && /^\d{1,2}:\d{2}$/.test(hora)) {
        return hora;
    }
    if (typeof hora === "string" && hora.includes("T")) {
        return hora.slice(11, 16);
    }
    if (typeof hora === "string") {
        return hora.slice(0, 5);
    }
    const date = new Date(hora);
    if (!Number.isNaN(date.getTime())) {
        return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
    }
    return "";
}

export function formatMoney(valor) {
    const numero = Number(valor);
    if (Number.isNaN(numero)) return "";
    return `$${numero.toLocaleString("es-CR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function formatFecha(fecha) {
    if (!fecha) return "";
    const date = new Date(`${fecha}T12:00:00`);
    if (Number.isNaN(date.getTime())) return fecha;
    return date.toLocaleDateString("es-CR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function sumarMinutos(hora, minutos) {
    if (!hora) return "";
    const [hh, mm] = hora.split(":").map(Number);
    const total = hh * 60 + mm + Number(minutos);
    const horas = Math.floor(total / 60) % 24;
    const mins = total % 60;
    return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function aMinutos(hora) {
    if (!hora) return null;
    const [hh, mm] = hora.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
}

export function minutosAString(minutos) {
    const horas = Math.floor(minutos / 60) % 24;
    const mins = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function bloquesHorarios(horarios = []) {
    const bloques = [];
    for (const horario of horarios) {
        let inicio = aMinutos(horario.horaInicio);
        const fin = aMinutos(horario.horaFin);
        if (inicio === null || fin === null || fin <= inicio) continue;
        while (inicio < fin) {
            const siguiente = Math.min(inicio + 60, fin);
            bloques.push({
                horaInicio: minutosAString(inicio),
                horaFin: minutosAString(siguiente),
            });
            inicio = siguiente;
        }
    }
    return bloques;
}

export function seTraslapa(inicioA, finA, inicioB, finB) {
    return inicioA < finB && inicioB < finA;
}
