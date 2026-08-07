import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";
import { RestriccionForm } from "../components/RestriccionForm";
import { Alert } from "../components/ui/alert";
import { getTiposRestriccion } from "../services/tipoRestriccionService";
import { getEmpleadosActivos } from "../services/empleadoService";
import {
    actualizarRestriccionHorario,
    getRestriccionHorarioById,
} from "../services/restriccionHorarioService";

export function EditRestriccionPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tiposRestriccion, setTiposRestriccion] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [restriccion, setRestriccion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true);
                const [restriccionData, tiposData, empleadosData] = await Promise.all([
                    getRestriccionHorarioById(id),
                    getTiposRestriccion(),
                    getEmpleadosActivos(),
                ]);

                if (!restriccionData) {
                    setError("La restricción solicitada no existe.");
                    return;
                }

                setRestriccion(restriccionData.data);
                setTiposRestriccion(tiposData.data);
                setEmpleados(empleadosData.data);
            } catch {
                setError("No se pudieron cargar los datos para editar la restricción.");
            } finally {
                setLoading(false);
            }
        }
        loadEditData();
    }, [id]);

    async function handleUpdateRestriccion(formData) {
        try {
            await actualizarRestriccionHorario(id, formData);
            toast.success("La restricción de horario fue actualizada correctamente.");
            navigate("/restricciones");
        } catch (error) {
            console.error("Error al actualizar la restricción", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p>Cargando datos de la restricción...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar restricción de horario"
                description="Modifique los datos de la restricción seleccionada."
            />

            <RestriccionForm
                onSubmit={handleUpdateRestriccion}
                tiposRestriccion={tiposRestriccion}
                empleados={empleados}
                initialData={restriccion}
                submitText="Actualizar restricción"
            />
        </section>
    );
}
