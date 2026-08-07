const API_URL = import.meta.env.VITE_API_URL;

export async function getDiasSemana() {
    try {
        const response = await fetch(`${API_URL}/dias-semana`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los días de la semana.");
    }
}

export async function getDiaSemanaById(id) {
    try {
        const response = await fetch(`${API_URL}/dias-semana/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del día.");
    }
}
