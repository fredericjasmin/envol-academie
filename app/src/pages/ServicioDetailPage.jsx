import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, DollarSign, GraduationCap, Pencil } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Alert } from "../components/ui/alert";
import { getServicioById } from "../services/servicioService";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

export function ServicioDetailPage() {
    const { id } = useParams();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadServicio() {
            try {
                setLoading(true);
                setError("");
                const data = await getServicioById(id);
                if (!data) {
                    setServicio(null);
                    return;
                }
                setServicio(data.data);
            } catch {
                setError("Ocurrió un error al cargar el curso.");
            } finally {
                setLoading(false);
            }
        }
        loadServicio();
    }, [id]);

    if (loading) {
        return <p className="text-muted-foreground">Cargando detalle...</p>;
    }
    if (error) {
        return <Alert>{error}</Alert>;
    }
    if (!servicio) {
        return (
            <section className="space-y-4">
                <PageHeader
                    title="Curso no encontrado"
                    description="No existe un curso asociado al identificador solicitado."
                />
                <Button asChild variant="outline">
                    <Link to="/servicios">Volver al listado de cursos</Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/servicios">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al listado de cursos
                </Link>
            </Button>

            <Button asChild>
                <Link to={`/servicios/${servicio.id}/editar`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar curso
                </Link>
            </Button>

            <PageHeader
                title={servicio.nombre}
                description="Información detallada del curso seleccionado"
            />

            <Card className="overflow-hidden">
                {servicio.imagen && (
                    <img
                        src={`${IMAGE_URL}/${servicio.imagen}`}
                        alt={servicio.nombre}
                        className="h-72 w-full object-cover"
                    />
                )}

                <CardHeader>
                    <CardTitle>{servicio.nombre}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    {servicio.descripcion && (
                        <p className="leading-relaxed text-muted-foreground">
                            {servicio.descripcion}
                        </p>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <p className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            ${servicio.precioBase}
                        </p>
                        <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {servicio.duracionMinutos} minutos
                        </p>
                    </div>
                    {servicio.especialidad && (
                        <Link
                            to={`/especialidades/${servicio.especialidad.id}`}
                            className="block rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
                        >
                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Especialidad
                            </h3>
                            <p className="font-medium">{servicio.especialidad.nombre}</p>
                            {servicio.especialidad.descripcion && (
                                <p className="text-sm text-muted-foreground">
                                    {servicio.especialidad.descripcion}
                                </p>
                            )}
                        </Link>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}