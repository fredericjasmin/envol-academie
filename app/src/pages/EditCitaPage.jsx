import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import { CitaForm } from "../components/CitaForm";
import { useAuth } from "../auth/useAuth";
import { getUsuariosPorRol } from "../services/usuarioService";
import { getServiciosActivos } from "../services/servicioService";
import { getAdicionalesActivos } from "../services/adicionalService";
import { getCitaById, actualizarCita } from "../services/citaService";

export function EditCitaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasRole } = useAuth();
    const [cita, setCita] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [adicionales, setAdicionales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function loadOptions() {
            try {
                setLoading(true);
                setError(null);
                const [citaData, clientesData, serviciosData, adicionalesData] =
                    await Promise.all([
                        getCitaById(id),
                        getUsuariosPorRol("Cliente"),
                        getServiciosActivos(),
                        getAdicionalesActivos(),
                    ]);
                if (!citaData) {
                    setError("La cita no existe.");
                    return;
                }
                setCita(citaData.data);
                setClientes(clientesData.data);
                setServicios(serviciosData.data);
                setAdicionales(adicionalesData.data);
            } catch (error) {
                console.error("Error al cargar datos para editar la cita", error);
                setError("Ocurrió un error al cargar los datos de la cita.");
            } finally {
                setLoading(false);
            }
        }
        loadOptions();
    }, [id]);

    async function handleSubmit(formData) {
        try {
            const data = await actualizarCita(id, formData);
            toast.success("La cita fue actualizada correctamente.");
            navigate(`/citas/${data.data.id}`);
        } catch (error) {
            console.error("Error al actualizar la cita", error);
            throw error;
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando cita...</p>;
    }

    if (error && !cita) {
        return (
            <section className="space-y-4">
                <Button asChild variant="outline">
                    <Link to="/citas">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al listado de citas
                    </Link>
                </Button>
                <Alert>{error}</Alert>
            </section>
        );
    }

    if (cita && !cita.estadoCita?.permiteEdicion) {
        return (
            <section className="space-y-4">
                <Button asChild variant="outline">
                    <Link to={`/citas/${cita.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al detalle de la cita
                    </Link>
                </Button>
                <Alert>Esta cita ya no permite edición, solo puede consultarse.</Alert>
            </section>
        );
    }

    if (cita && !esAdmin && user.empleado?.id !== cita.empleadoId) {
        return (
            <section className="space-y-4">
                <Button asChild variant="outline">
                    <Link to={`/citas/${cita.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al detalle de la cita
                    </Link>
                </Button>
                <Alert>Solo puede editar las citas que tiene asignadas.</Alert>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to={`/citas/${id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al detalle de la cita
                </Link>
            </Button>

            <PageHeader
                title="Editar cita"
                description="Modifique la información de la cita seleccionada"
            />

            {error && <Alert>{error}</Alert>}

            {cita && (
                <CitaForm
                    cita={cita}
                    clientes={clientes}
                    servicios={servicios}
                    adicionales={adicionales}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar cambios"
                />
            )}
        </section>
    );
}
