import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";
import { HorarioAtencionForm } from "../components/HorarioAtencionForm";
import { Alert } from "../components/ui/alert";
import { getDiasSemana } from "../services/diaSemanaService";
import { crearHorarioAtencion } from "../services/horarioAtencionService";

export function CreateHorarioPage() {
    const navigate = useNavigate();
    const [diasSemana, setDiasSemana] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDias() {
            try {
                setLoading(true);
                const data = await getDiasSemana();
                setDiasSemana(data.data);
            } catch {
                setError("No se pudieron cargar los días de la semana.");
            } finally {
                setLoading(false);
            }
        }
        loadDias();
    }, []);

    async function handleCreateHorario(formData) {
        try {
            await crearHorarioAtencion(formData);
            toast.success("El horario de atención fue registrado correctamente.");
            navigate("/horarios");
        } catch (error) {
            console.error("Error al crear el horario", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p>Cargando días de la semana...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear horario de atención"
                description="Configure el día y el rango horario y guarde los datos en la API."
            />
            <HorarioAtencionForm onSubmit={handleCreateHorario} diasSemana={diasSemana} />
        </section>
    );
}
