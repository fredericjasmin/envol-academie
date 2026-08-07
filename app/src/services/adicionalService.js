const API_URL = import.meta.env.VITE_API_URL;

export async function getAdicionales() {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los servicios adicionales.");
    }
}

export async function getAdicionalesActivos() {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales/activos`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los servicios adicionales.");
    }
}

export async function getAdicionalById(id) {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del servicio adicional.");
    }
}

export async function crearAdicional(datos) {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al crear el servicio adicional");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear el servicio adicional.");
    }
}

export async function actualizarAdicional(id, datos) {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al actualizar el servicio adicional");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo actualizar el servicio adicional.");
    }
}

export async function cambiarEstadoAdicional(id, activo) {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cambiar el estado del servicio adicional");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cambiar el estado del servicio adicional.");
    }
}