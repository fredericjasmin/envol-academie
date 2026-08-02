const API_URL = import.meta.env.VITE_API_URL;

export async function getServicios() {
    try {
        const response = await fetch(`${API_URL}/servicios`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los cursos.");
    }
}

export async function getServicioById(id) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del curso.");
    }
}

export async function crearServicios(datos) {
    try {
        const response = await fetch(`${API_URL}/servicios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al crear el curso");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear el curso.");
    }
}

export async function actualizarServicio(id, datos) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al actualizar el curso");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo actualizar el curso.");
    }
}

export async function cambiarEstadoServicio(id, activo) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cambiar el estado del curso");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cambiar el estado del curso.");
    }
}
