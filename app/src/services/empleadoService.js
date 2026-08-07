const API_URL = import.meta.env.VITE_API_URL;

export async function getEmpleados() {
    try {
        const response = await fetch(`${API_URL}/empleados`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los empleados.");
    }
}

export async function getEmpleadosActivos(servicioId = "") {
    try {
        const query = servicioId ? `?servicioId=${servicioId}` : "";
        const response = await fetch(`${API_URL}/empleados/activos${query}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los empleados activos.");
    }
}

export async function getEmpleadoById(id) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del empleado.");
    }
}

export async function getAgendaEmpleado(id, fecha) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}/agenda?fecha=${fecha}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar la agenda del empleado.");
    }
}

export async function crearEmpleado(datos) {
    try {
        const response = await fetch(`${API_URL}/empleados`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al crear el empleado");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear el empleado.");
    }
}

export async function actualizarEmpleado(id, datos) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al actualizar el empleado");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo actualizar el empleado.");
    }
}

export async function cambiarEstadoEmpleado(id, activo) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Error al cambiar el estado del empleado");
        return json;
    } catch (error) {
        throw new Error(error.message || "No se pudo cambiar el estado del empleado.");
    }
}
