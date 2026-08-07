import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PageHeader } from "../components/PageHeader";
import { EmpleadoForm } from "../components/EmpleadoForm";
import { Alert } from "../components/ui/alert";
import { getEspecialidades } from "../services/especialidadService";
import { getServicios } from "../services/servicioService";
import { getUsuariosPorRol } from "../services/usuarioService";
import { crearEmpleado } from "../services/empleadoService";

export function CreateEmpleadoPage() {
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);
                const [usuariosData, especialidadesData, serviciosData] = await Promise.all([
                    getUsuariosPorRol("Empleado"),
                    getEspecialidades(),
                    getServicios(),
                ]);
                setUsuarios(usuariosData.data);
                setEspecialidades(especialidadesData.data);
                setServicios(serviciosData.data);
            } catch {
                setError("No se pudieron cargar los datos para crear el empleado.");
            } finally {
                setLoading(false);
            }
        }
        loadFormData();
    }, []);

    async function handleCreateEmpleado(formData) {
        try {
            const nuevoEmpleado = await crearEmpleado(formData);
            toast.success(`El empleado fue registrado correctamente.`);
            navigate(`/empleados/${nuevoEmpleado.data.id}`);
        } catch (error) {
            console.error("Error al crear el empleado", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <p>Cargando datos para crear el empleado...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear empleado"
                description="Complete la información del instructor y guarde los datos en la API."
            />
            <EmpleadoForm
                onSubmit={handleCreateEmpleado}
                usuarios={usuarios}
                especialidades={especialidades}
                servicios={servicios}
            />
        </section>
    );
}
