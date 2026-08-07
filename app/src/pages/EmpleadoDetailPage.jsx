import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    GraduationCap,
    Mail,
    Pencil,
    Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { useAuth } from "../auth/useAuth";
import {
    cambiarEstadoEmpleado,
    getEmpleadoById,
} from "../services/empleadoService";
import { formatFecha, formatHora } from "../lib/format";

export function EmpleadoDetailPage() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const [empleado, setEmpleado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function loadEmpleado() {
            try {
                setLoading(true);
                setError("");
                const data = await getEmpleadoById(id);
                if (!data) {
                    setEmpleado(null);
                    return;
                }
                setEmpleado(data.data);
            } catch {
                setError("Ocurrió un error al cargar el empleado.");
            } finally {
                setLoading(false);
            }
        }
        loadEmpleado();
    }, [id]);

    async function handleToggleEstado() {
        if (!empleado) return;
        try {
            const data = await cambiarEstadoEmpleado(empleado.id, !empleado.activo);
            setEmpleado((actual) => ({ ...actual, activo: data.data.activo }));
            toast.success(
                data.data.activo
                    ? "El empleado fue activado."
                    : "El empleado fue desactivado."
            );
        } catch (error) {
            console.error("Error al cambiar el estado", error);
            toast.error(error.message);
        }
    }

    if (loading) {
        return <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />;
    }
    if (error) {
        return <Alert>{error}</Alert>;
    }
    if (!empleado) {
        return (
            <section className="space-y-6">
                <PageHeader
                    title="Empleado no encontrado"
                    description="No existe un empleado asociado al identificador solicitado."
                    actions={
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/empleados">
                                <ArrowLeft className="size-4" />
                                Volver a empleados
                            </Link>
                        </Button>
                    }
                />
            </section>
        );
    }

    const fullName = `${empleado.usuario?.nombre ?? ""} ${empleado.usuario?.primerApellido ?? ""} ${empleado.usuario?.segundoApellido ?? ""}`.trim();

    return (
        <section className="space-y-8">
            <PageHeader
                code={empleado.codigoEmpleado}
                title={fullName || "Empleado"}
                description="Información del instructor y de su agenda."
                actions={
                    esAdmin && (
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                                <Link to={`/empleados/${empleado.id}/editar`}>
                                    <Pencil className="size-4" />
                                    Editar empleado
                                </Link>
                            </Button>
                            <Button
                                type="button"
                                variant={empleado.activo ? "destructive" : "default"}
                                onClick={handleToggleEstado}
                                className={
                                    empleado.activo
                                        ? "border-transparent bg-white/15 text-white hover:bg-white/25"
                                        : "border-transparent bg-white text-foreground hover:bg-white/85"
                                }
                            >
                                {empleado.activo ? "Desactivar" : "Activar"}
                            </Button>
                        </div>
                    )
                }
            />

            <div className="grid gap-6 px-1 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoTile label="Código">
                            <p className="text-lg font-semibold">{empleado.codigoEmpleado}</p>
                        </InfoTile>
                        <InfoTile label="Especialidad">
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <GraduationCap className="size-5 text-primary/70" />
                                {empleado.especialidad?.nombre ?? "Sin asignar"}
                            </p>
                        </InfoTile>
                        {empleado.usuario?.correo && (
                            <InfoTile label="Correo">
                                <p className="flex items-center gap-2 font-semibold">
                                    <Mail className="size-5 text-primary/70" />
                                    {empleado.usuario.correo}
                                </p>
                            </InfoTile>
                        )}
                        {empleado.usuario?.telefono && (
                            <InfoTile label="Teléfono">
                                <p className="flex items-center gap-2 font-semibold">
                                    <Phone className="size-5 text-primary/70" />
                                    {empleado.usuario.telefono}
                                </p>
                            </InfoTile>
                        )}
                    </div>

                    {empleado.descripcion && (
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="space-y-3 p-5">
                                <p className="boarding-label text-muted-foreground">
                                    Descripción
                                </p>
                                <p className="leading-relaxed text-muted-foreground">
                                    {empleado.descripcion}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="rounded-2xl border-border bg-card shadow-sm">
                        <CardContent className="space-y-3 p-5">
                            <p className="boarding-label text-muted-foreground">
                                Cursos que imparte ({empleado.servicios?.length ?? 0})
                            </p>
                            {empleado.servicios?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {empleado.servicios.map((servicio) => (
                                        <Badge key={servicio.id} variant="secondary">
                                            {servicio.nombre}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    El empleado no tiene cursos asignados.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <aside className="space-y-4">
                    <InfoTile label="Estado">
                        {empleado.activo ? (
                            <Badge>Activo</Badge>
                        ) : (
                            <Badge variant="destructive">Inactivo</Badge>
                        )}
                    </InfoTile>

                    {empleado.citas?.length > 0 && (
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="boarding-label text-muted-foreground">
                                Próximas citas ({empleado.citas.length})
                            </p>
                            <ul className="mt-3 space-y-2">
                                {empleado.citas.map((cita) => (
                                    <li key={cita.id}>
                                        <Link
                                            to={`/citas/${cita.id}`}
                                            className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-colors hover:border-primary/50 hover:bg-accent/50"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {cita.cliente?.nombre} {cita.cliente?.primerApellido}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {cita.servicio?.nombre}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-medium">
                                                    {formatFecha(cita.fecha)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatHora(cita.horaInicio)} – {formatHora(cita.horaFin)}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {empleado.restricciones?.length > 0 && (
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="boarding-label text-muted-foreground">Restricciones</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {empleado.restricciones.map((restriccion) => (
                                    <Badge key={restriccion.id} variant="outline">
                                        {formatFecha(restriccion.fecha)}{" "}
                                        {restriccion.todoElDia
                                            ? "(todo el día)"
                                            : `${formatHora(restriccion.horaInicio)} – ${formatHora(restriccion.horaFin)}`}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}
