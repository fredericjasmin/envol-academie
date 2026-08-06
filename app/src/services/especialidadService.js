const API_URL = import.meta.env.VITE_API_URL;

export async function getEspecialidadById(id) {
    try {
        const response = await fetch(`${API_URL}/especialidades/${id}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error("Error al obtener la especialidad");
        }
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle de la especialidad.");
    }
}

export async function getEspecialidades() {
    try {
        const response = await fetch(`${API_URL}/especialidades`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las especialidades.");
    }
}