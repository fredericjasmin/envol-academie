const API_URL = import.meta.env.VITE_API_URL;

export async function getEstadosCita() {
    try {
        const response = await fetch(`${API_URL}/estados-cita`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los estados de cita.");
    }
}

export async function getEstadoCitaById(id) {
    try {
        const response = await fetch(`${API_URL}/estados-cita/${id}`);
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del estado de cita.");
    }
}
