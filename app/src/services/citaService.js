const API_URL = import.meta.env.VITE_API_URL;

export async function getCitas() {
    try {
        const response = await fetch(`${API_URL}/citas`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las citas.");
    }
}

export async function getCitasPorCliente(clienteId) {
    try {
        const response = await fetch(`${API_URL}/citas/cliente/${clienteId}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las citas del cliente.");
    }
}

export async function getCitasPorEmpleado(empleadoId) {
    try {
        const response = await fetch(`${API_URL}/citas/empleado/${empleadoId}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las citas del empleado.");
    }
}

export async function getCitaById(id) {
    try {
        const response = await fetch(`${API_URL}/citas/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle de la cita.");
    }
}

export async function crearCita(datos) {
    try {
        const response = await fetch(`${API_URL}/citas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al crear la cita");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear la cita.");
    }
}

export async function actualizarCita(id, datos) {
    try {
        const response = await fetch(`${API_URL}/citas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al actualizar la cita");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo actualizar la cita.");
    }
}

export async function cancelarCita(id, motivoCancelacion) {
    try {
        const response = await fetch(`${API_URL}/citas/${id}/cancelar`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ motivoCancelacion }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cancelar la cita");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cancelar la cita.");
    }
}

export async function cambiarEstadoCita(id, estadoCitaId) {
    try {
        const response = await fetch(`${API_URL}/citas/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estadoCitaId }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cambiar el estado de la cita");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cambiar el estado de la cita.");
    }
}

export async function verificarDisponibilidad(datos) {
    try {
        const response = await fetch(`${API_URL}/citas/disponibilidad`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al consultar la disponibilidad");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo consultar la disponibilidad.");
    }
}

export async function getAgendaDiaria(fecha) {
    try {
        const response = await fetch(`${API_URL}/citas/agenda-diaria?fecha=${fecha}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar la agenda diaria.");
    }
}

export async function getAgendaEmpleadoCita(empleadoId, fecha) {
    try {
        const response = await fetch(`${API_URL}/citas/agenda-empleado/${empleadoId}?fecha=${fecha}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar la agenda del empleado.");
    }
}
