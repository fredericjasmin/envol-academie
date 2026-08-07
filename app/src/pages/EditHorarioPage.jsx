import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";
import { HorarioAtencionForm } from "../components/HorarioAtencionForm";
import { Alert } from "../components/ui/alert";
import { getDiasSemana } from "../services/diaSemanaService";
import {
    actualizarHorarioAtencion,
    getHorarioAtencionById,
} from "../services/horarioAtencionService";

export function EditHorarioPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [diasSemana, setDiasSemana] = useState([]);
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true);
                const [horarioData, diasData] = await Promise.all([
                    getHorarioAtencionById(id),
                    getDiasSemana(),
                ]);

                if (!horarioData) {
                    setError("El horario solicitado no existe.");
                    return;
                }

                setHorario(horarioData.data);
                setDiasSemana(diasData.data);
            } catch {
                setError("No se pudieron cargar los datos para editar el horario.");
            } finally {
                setLoading(false);
            }
        }
        loadEditData();
    }, [id]);

    async function handleUpdateHorario(formData) {
        try {
            await actualizarHorarioAtencion(id, formData);
            toast.success("El horario de atención fue actualizado correctamente.");
            navigate("/horarios");
        } catch (error) {
            console.error("Error al actualizar el horario", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p>Cargando datos del horario...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar horario de atención"
                description="Modifique el día y el rango horario seleccionado."
            />

            <HorarioAtencionForm
                onSubmit={handleUpdateHorario}
                diasSemana={diasSemana}
                initialData={horario}
                submitText="Actualizar horario"
            />
        </section>
    );
}
