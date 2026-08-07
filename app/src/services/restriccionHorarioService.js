const API_URL = import.meta.env.VITE_API_URL;

export async function getRestriccionesHorario() {
    try {
        const response = await fetch(`${API_URL}/restricciones-horario`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las restricciones de horario.");
    }
}

export async function getRestriccionHorarioById(id) {
    try {
        const response = await fetch(`${API_URL}/restricciones-horario/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle de la restricción.");
    }
}

export async function crearRestriccionHorario(datos) {
    try {
        const response = await fetch(`${API_URL}/restricciones-horario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al crear la restricción");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear la restricción de horario.");
    }
}

export async function actualizarRestriccionHorario(id, datos) {
    try {
        const response = await fetch(`${API_URL}/restricciones-horario/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al actualizar la restricción");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo actualizar la restricción de horario.");
    }
}

export async function cambiarEstadoRestriccionHorario(id, activo) {
    try {
        const response = await fetch(`${API_URL}/restricciones-horario/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cambiar el estado de la restricción");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cambiar el estado de la restricción.");
    }
}
