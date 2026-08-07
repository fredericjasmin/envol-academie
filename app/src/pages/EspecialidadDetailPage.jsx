import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, GraduationCap, Users } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ServicioCard } from "../components/ServicioCard";
import { EmptyState } from "../components/EmptyState";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import { getEspecialidadById } from "../services/especialidadService";

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
        return <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />;
    }
    if (error) {
        return <Alert>{error}</Alert>;
    }
    if (!especialidad) {
        return (
            <section className="space-y-6">
                <PageHeader
                    title="Especialidad no encontrada"
                    description="No existe una especialidad asociada al identificador solicitado."
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

    const totalCursos = especialidad.servicios?.length ?? 0;

    return (
        <section className="space-y-8">
            <PageHeader
                code="Especialidad"
                title={especialidad.nombre}
                description={
                    especialidad.descripcion ||
                    `${totalCursos} curso${totalCursos !== 1 ? "s" : ""} disponibles en esta especialidad`
                }
                actions={
                    <Button asChild variant="outline" className="border-border bg-background text-foreground hover:border-primary/50">
                        <Link to="/servicios">
                            <ArrowLeft className="size-4" />
                            Volver a cursos
                        </Link>
                    </Button>
                }
            />

            <div className="space-y-8 px-1">
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">
                            Cursos de la especialidad
                            <span className="ml-2 text-sm font-semibold text-muted-foreground">
                                {totalCursos}
                            </span>
                        </h2>
                    </div>

                    {totalCursos === 0 ? (
                        <EmptyState
                            title="Aún no hay cursos"
                            description="Esta especialidad no tiene cursos registrados por el momento."
                            actionLabel="Ver todos los cursos"
                            actionTo="/servicios"
                        />
                    ) : (
                        <div className="grid gap-5 auto-rows-fr sm:grid-cols-2 lg:grid-cols-3">
                            {especialidad.servicios.map((servicio) => (
                                <ServicioCard key={servicio.id} servicio={servicio} />
                            ))}
                        </div>
                    )}
                </section>

                {especialidad.empleados?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="size-5 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight">
                                Instructores
                            </h2>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {especialidad.empleados.map((empleado) => (
                                <Link
                                    key={empleado.id}
                                    to={`/empleados/${empleado.id}`}
                                    className="card-lift flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                                >
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                        {(empleado.usuario?.nombre?.[0] ?? "?")}
                                        {(empleado.usuario?.primerApellido?.[0] ?? "")}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-semibold">
                                            {empleado.usuario?.nombre} {empleado.usuario?.primerApellido}
                                        </span>
                                        <span className="block truncate text-sm text-muted-foreground">
                                            {empleado.codigoEmpleado}
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
}
