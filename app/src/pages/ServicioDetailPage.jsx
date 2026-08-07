import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, GraduationCap, Pencil } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Alert } from "../components/ui/alert";
import { getServicioById } from "../services/servicioService";
import { formatMoney } from "../lib/format";

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
        return (
            <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
        );
    }
    if (error) {
        return <Alert>{error}</Alert>;
    }
    if (!servicio) {
        return (
            <section className="space-y-6">
                <PageHeader
                    title="Curso no encontrado"
                    description="No existe un curso asociado al identificador solicitado."
                    actions={
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/servicios">
                                <ArrowLeft className="size-4" />
                                Volver a cursos
                            </Link>
                        </Button>
                    }
                />
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <PageHeader
                code={`Curso · #${servicio.id}`}
                title={servicio.nombre}
                description="Información detallada del curso seleccionado."
                actions={
                    <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                        <Link to={`/servicios/${servicio.id}/editar`}>
                            <Pencil className="size-4" />
                            Editar curso
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6 px-1 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
                        <img
                            src={
                                servicio.imagen
                                    ? `${IMAGE_URL}/${servicio.imagen}`
                                    : `${IMAGE_URL}/image-not-found.jpg`
                            }
                            alt={servicio.nombre}
                            className="h-72 w-full object-cover sm:h-96"
                            onError={(event) => {
                                event.currentTarget.src = `${IMAGE_URL}/image-not-found.jpg`;
                            }}
                        />
                    </Card>

                    {servicio.descripcion && (
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="space-y-3 p-5">
                                <p className="boarding-label text-muted-foreground">
                                    Descripción
                                </p>
                                <p className="leading-relaxed text-muted-foreground">
                                    {servicio.descripcion}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className="space-y-4">
                    <InfoTile label="Tarifa">
                        <p className="text-3xl font-extrabold tracking-tight text-primary">
                            {formatMoney(servicio.precioBase)}
                        </p>
                    </InfoTile>
                    <InfoTile label="Duración">
                        <p className="flex items-center gap-2 text-lg font-semibold">
                            <Clock className="size-5 text-primary/70" />
                            {servicio.duracionMinutos} min
                        </p>
                    </InfoTile>
                    <InfoTile label="Referencia">
                        <p className="text-lg font-semibold">#{servicio.id}</p>
                    </InfoTile>
                    {servicio.especialidad && (
                        <InfoTile label="Especialidad">
                            <Link
                                to={`/especialidades/${servicio.especialidad.id}`}
                                className="group flex items-center gap-2 font-semibold text-primary hover:underline"
                            >
                                <GraduationCap className="size-5" />
                                <span className="truncate group-hover:underline">
                                    {servicio.especialidad.nombre}
                                </span>
                            </Link>
                            {servicio.especialidad.descripcion && (
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {servicio.especialidad.descripcion}
                                </p>
                            )}
                        </InfoTile>
                    )}
                </aside>
            </div>
        </section>
    );
}
