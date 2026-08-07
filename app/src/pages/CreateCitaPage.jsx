import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { getEstadosCita } from "../services/estadoCitaService";
import { crearCita } from "../services/citaService";

export function CreateCitaPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [adicionales, setAdicionales] = useState([]);
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadOptions() {
            try {
                setLoading(true);
                setError(null);
                const [clientesData, serviciosData, adicionalesData, estadosData] =
                    await Promise.all([
                        getUsuariosPorRol("Cliente"),
                        getServiciosActivos(),
                        getAdicionalesActivos(),
                        getEstadosCita(),
                    ]);
                setClientes(clientesData.data);
                setServicios(serviciosData.data);
                setAdicionales(adicionalesData.data);
                setEstados(estadosData.data);
            } catch (error) {
                console.error("Error al cargar opciones de cita", error);
                setError("Ocurrió un error al cargar las opciones para crear la cita.");
            } finally {
                setLoading(false);
            }
        }
        loadOptions();
    }, []);

    async function handleSubmit(formData) {
        try {
            const payload = {
                ...formData,
                creadoPorUsuarioId: user.id,
            };
            const data = await crearCita(payload);
            toast.success("La cita fue creada correctamente.");
            navigate(`/citas/${data.data.id}`);
        } catch (error) {
            console.error("Error al crear la cita", error);
            throw error;
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando opciones...</p>;
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/citas">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al listado de citas
                </Link>
            </Button>

            <PageHeader
                title="Nueva cita"
                description="Registre una nueva cita para un cliente de Envol Académie"
            />

            {error && <Alert>{error}</Alert>}

            {clientes.length === 0 ? (
                <Alert>No hay clientes registrados para asignar a la cita.</Alert>
            ) : (
                <CitaForm
                    clientes={clientes}
                    servicios={servicios}
                    adicionales={adicionales}
                    estados={estados}
                    onSubmit={handleSubmit}
                    submitLabel="Crear cita"
                />
            )}
        </section>
    );
}
