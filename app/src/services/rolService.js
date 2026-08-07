const API_URL = import.meta.env.VITE_API_URL;

export async function getRoles() {
    try {
        const response = await fetch(`${API_URL}/roles`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los roles.");
    }
}

export async function getRolById(id) {
    try {
        const response = await fetch(`${API_URL}/roles/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del rol.");
    }
}
