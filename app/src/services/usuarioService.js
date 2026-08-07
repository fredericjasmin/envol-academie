const API_URL = import.meta.env.VITE_API_URL;

export async function getUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los usuarios.");
    }
}

export async function getUsuariosPorRol(rol) {
    try {
        const response = await fetch(`${API_URL}/usuarios?rol=${encodeURIComponent(rol)}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los usuarios.");
    }
}

export async function getUsuarioById(id) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del usuario.");
    }
}
