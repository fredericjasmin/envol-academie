const API_URL = import.meta.env.VITE_API_URL;

export async function getTiposRestriccion() {
    try {
        const response = await fetch(`${API_URL}/tipos-restriccion-horario`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los tipos de restricción.");
    }
}

export async function getTipoRestriccionById(id) {
    try {
        const response = await fetch(`${API_URL}/tipos-restriccion-horario/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del tipo de restricción.");
    }
}
