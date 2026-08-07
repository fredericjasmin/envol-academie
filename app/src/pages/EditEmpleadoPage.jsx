import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";
import { EmpleadoForm } from "../components/EmpleadoForm";
import { Alert } from "../components/ui/alert";
import { getEspecialidades } from "../services/especialidadService";
import { getServicios } from "../services/servicioService";
import { getUsuariosPorRol } from "../services/usuarioService";
import {
    actualizarEmpleado,
    getEmpleadoById,
} from "../services/empleadoService";

export function EditEmpleadoPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true);
                const [empleadoData, usuariosData, especialidadesData, serviciosData] =
                    await Promise.all([
                        getEmpleadoById(id),
                        getUsuariosPorRol("Empleado"),
                        getEspecialidades(),
                        getServicios(),
                    ]);

                if (!empleadoData) {
                    setError("El empleado solicitado no existe.");
                    return;
                }

                setEmpleado(empleadoData.data);
                setUsuarios(usuariosData.data);
                setEspecialidades(especialidadesData.data);
                setServicios(serviciosData.data);
            } catch {
                setError("No se pudieron cargar los datos para editar el empleado.");
            } finally {
                setLoading(false);
            }
        }
        loadEditData();
    }, [id]);

    async function handleUpdateEmpleado(formData) {
        try {
            const empleadoActualizado = await actualizarEmpleado(id, formData);
            toast.success("El empleado fue actualizado correctamente.");
            navigate(`/empleados/${empleadoActualizado.data.id}`);
        } catch (error) {
            console.error("Error al actualizar el empleado", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p>Cargando datos del empleado...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar empleado"
                description="Modifique la información del instructor seleccionado."
            />

            <EmpleadoForm
                onSubmit={handleUpdateEmpleado}
                usuarios={usuarios}
                especialidades={especialidades}
                servicios={servicios}
                initialData={empleado}
                submitText="Actualizar empleado"
            />
        </section>
    );
}
