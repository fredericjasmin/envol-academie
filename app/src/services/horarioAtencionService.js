const API_URL = import.meta.env.VITE_API_URL;

export async function getHorariosAtencion() {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los horarios de atención.");
    }
}

export async function getHorarioAtencionById(id) {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del horario.");
    }
}

export async function crearHorarioAtencion(datos) {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al crear el horario");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear el horario de atención.");
    }
}

export async function actualizarHorarioAtencion(id, datos) {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al actualizar el horario");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo actualizar el horario de atención.");
    }
}

export async function cambiarEstadoHorarioAtencion(id, activo) {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cambiar el estado del horario");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cambiar el estado del horario.");
    }
}
