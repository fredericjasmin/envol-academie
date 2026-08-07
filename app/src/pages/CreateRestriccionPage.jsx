import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";
import { RestriccionForm } from "../components/RestriccionForm";
import { Alert } from "../components/ui/alert";
import { getTiposRestriccion } from "../services/tipoRestriccionService";
import { getEmpleadosActivos } from "../services/empleadoService";
import { crearRestriccionHorario } from "../services/restriccionHorarioService";

export function CreateRestriccionPage() {
    const navigate = useNavigate();

    const [tiposRestriccion, setTiposRestriccion] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);
                const [tiposData, empleadosData] = await Promise.all([
                    getTiposRestriccion(),
                    getEmpleadosActivos(),
                ]);
                setTiposRestriccion(tiposData.data);
                setEmpleados(empleadosData.data);
            } catch {
                setError("No se pudieron cargar los datos para crear la restricción.");
            } finally {
                setLoading(false);
            }
        }
        loadFormData();
    }, []);

    async function handleCreateRestriccion(formData) {
        try {
            await crearRestriccionHorario(formData);
            toast.success("La restricción de horario fue registrada correctamente.");
            navigate("/restricciones");
        } catch (error) {
            console.error("Error al crear la restricción", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p>Cargando datos para crear la restricción...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear restricción de horario"
                description="Registre un cierre global o un bloqueo de horario de un instructor."
            />
            <RestriccionForm
                onSubmit={handleCreateRestriccion}
                tiposRestriccion={tiposRestriccion}
                empleados={empleados}
            />
        </section>
    );
}
