import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Clock,
    DollarSign,
    GraduationCap,
    Users,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Alert } from "../components/ui/alert";
import { getEspecialidadById } from "../services/especialidadService";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

export function EspecialidadDetailPage() {
    const { id } = useParams();
    const [especialidad, setEspecialidad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadEspecialidad() {
            try {
                setLoading(true);
                setError("");
                const data = await getEspecialidadById(id);
                if (!data) {
                    setEspecialidad(null);
                    return;
                }
                setEspecialidad(data.data);
            } catch {
                setError("Ocurrió un error al cargar la especialidad.");
            } finally {
                setLoading(false);
            }
        }
        loadEspecialidad();
    }, [id]);

    if (loading) {
        return <p className="text-muted-foreground">Cargando especialidad...</p>;
    }

    if (error) {
        return <Alert>{error}</Alert>;
    }

    if (!especialidad) {
        return (
            <section className="space-y-4">
                <PageHeader
                    title="Especialidad no encontrada"
                    description="No existe una especialidad asociada al identificador solicitado."
                />
                <Button asChild variant="outline">
                    <Link to="/servicios">Volver al listado de cursos</Link>
                </Button>
            </section>
        );
    }

    const totalCursos = especialidad.servicios?.length ?? 0;

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/servicios">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al listado de cursos
                </Link>
            </Button>

            <PageHeader
                title={especialidad.nombre}
                description="Información de la especialidad"
            />

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {especialidad.nombre}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    {especialidad.descripcion && (
                        <p className="leading-relaxed text-muted-foreground">
                            {especialidad.descripcion}
                        </p>
                    )}

                    <p className="flex items-center gap-2 font-medium">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {totalCursos} curso{totalCursos !== 1 ? "s" : ""} disponibles
                    </p>

                    <div>
                        <h3 className="mb-3 font-semibold">Cursos de la especialidad</h3>

                        {totalCursos === 0 ? (
                            <p className="text-muted-foreground">
                                Esta especialidad aún no tiene cursos registrados.
                            </p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {especialidad.servicios.map((servicio) => (
                                    <Link
                                        key={servicio.id}
                                        to={`/servicios/${servicio.id}`}
                                        className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
                                    >
                                        {servicio.imagen && (
                                            <img
                                                src={`${IMAGE_URL}/${servicio.imagen}`}
                                                alt={servicio.nombre}
                                                className="h-16 w-24 shrink-0 rounded-md object-cover"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium">{servicio.nombre}</p>
                                            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                {servicio.duracionMinutos} min
                                            </p>
                                            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                ${servicio.precioBase}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {especialidad.empleados?.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 font-semibold">
                                <Users className="h-4 w-4 text-primary" />
                                Instructores
                            </h3>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {especialidad.empleados.map((empleado) => (
                                    <div
                                        key={empleado.id}
                                        className="rounded-lg border p-4"
                                    >
                                        <p className="font-medium">
                                            {empleado.usuario?.nombre}{" "}
                                            {empleado.usuario?.primerApellido}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {empleado.codigoEmpleado}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}