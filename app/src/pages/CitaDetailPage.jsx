import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    Pencil,
    Plane,
    User,
    XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../auth/useAuth";
import { getEstadosCita } from "../services/estadoCitaService";
import {
    cancelarCita,
    cambiarEstadoCita,
    getCitaById,
} from "../services/citaService";
import { formatFecha, formatHora, formatMoney } from "../lib/format";

export function CitaDetailPage() {
    const { id } = useParams();
    const { user, hasRole } = useAuth();
    const [cita, setCita] = useState(null);
    const [estados, setEstados] = useState([]);
    const [motivoCancelacion, setMotivoCancelacion] = useState("");
    const [estadoNuevo, setEstadoNuevo] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const esAdmin = hasRole(["Administrador"]);
    const esEmpleado = hasRole(["Empleado"]);
    const esCliente = hasRole(["Cliente"]);

    useEffect(() => {
        async function loadCita() {
            try {
                setLoading(true);
                setError("");
                const [citaData, estadosData] = await Promise.all([
                    getCitaById(id),
                    getEstadosCita(),
                ]);
                if (!citaData) {
                    setCita(null);
                    return;
                }
                setCita(citaData.data);
                setEstados(estadosData.data);
            } catch {
                setError("Ocurrió un error al cargar la cita.");
            } finally {
                setLoading(false);
            }
        }
        loadCita();
    }, [id]);

    const esClienteDueno = cita && esCliente && cita.clienteId === user.id;
    const esEmpleadoAsignado = cita && esEmpleado && cita.empleadoId === user.empleado?.id;
    const puedeCancelar = cita && cita.estadoCita?.nombre !== "Cancelada" && (
        esAdmin ||
        esEmpleadoAsignado ||
        (esClienteDueno && cita.estadoCita?.permiteCancelacionCliente)
    );
    const puedeEditar = cita && cita.estadoCita?.permiteEdicion && (esAdmin || esEmpleadoAsignado);
    const puedeCambiarEstado = cita && (esAdmin || esEmpleadoAsignado);

    async function handleCancelar() {
        if (!cita) return;
        try {
            const data = await cancelarCita(cita.id, motivoCancelacion);
            setCita(data.data);
            setMotivoCancelacion("");
            toast.success("La cita fue cancelada correctamente.");
        } catch (error) {
            console.error("Error al cancelar la cita", error);
            toast.error(error.message);
        }
    }

    async function handleCambiarEstado() {
        if (!cita || !estadoNuevo) return;
        try {
            const data = await cambiarEstadoCita(cita.id, Number(estadoNuevo));
            setCita(data.data);
            setEstadoNuevo("");
            toast.success("El estado de la cita fue actualizado.");
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
    if (!cita) {
        return (
            <section className="space-y-6">
                <PageHeader
                    title="Cita no encontrada"
                    description="No existe una cita asociada al identificador solicitado."
                    actions={
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/citas">
                                <CalendarDays className="size-4" />
                                Volver a citas
                            </Link>
                        </Button>
                    }
                />
            </section>
        );
    }

    const estadoColor =
        cita.estadoCita?.color === "success"
            ? "default"
            : cita.estadoCita?.color === "destructive" || cita.estadoCita?.nombre === "Cancelada"
                ? "destructive"
                : "secondary";

    return (
        <section className="space-y-8">
            <PageHeader
                code={`Cita · #${cita.id}`}
                title={cita.servicio?.nombre ?? "Cita"}
                description="Resumen de la reserva y acciones disponibles."
                actions={
                    puedeEditar && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to={`/citas/${cita.id}/editar`}>
                                <Pencil className="size-4" />
                                Editar cita
                            </Link>
                        </Button>
                    )
                }
            />

            <div className="grid gap-6 px-1 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoTile label="Fecha">
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <CalendarDays className="size-5 text-primary/70" />
                                {formatFecha(cita.fecha)}
                            </p>
                        </InfoTile>
                        <InfoTile label="Horario">
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <Clock className="size-5 text-primary/70" />
                                {formatHora(cita.horaInicio)} – {formatHora(cita.horaFin)}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {cita.duracionMinutos} minutos
                            </p>
                        </InfoTile>
                        <InfoTile label="Cliente">
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <User className="size-5 text-primary/70" />
                                {cita.cliente?.nombre} {cita.cliente?.primerApellido}
                            </p>
                        </InfoTile>
                        <InfoTile label="Instructor">
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <Plane className="size-5 text-primary/70" />
                                {cita.empleado
                                    ? `${cita.empleado.usuario?.nombre} ${cita.empleado.usuario?.primerApellido}`
                                    : "Sin asignar"}
                            </p>
                        </InfoTile>
                    </div>

                    {cita.observaciones && (
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="space-y-3 p-5">
                                <p className="boarding-label text-muted-foreground">
                                    Observaciones
                                </p>
                                <p className="leading-relaxed text-muted-foreground">
                                    {cita.observaciones}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {cita.motivoCancelacion && (
                        <Card className="rounded-2xl border-destructive/40 bg-destructive/5 shadow-sm">
                            <CardContent className="space-y-3 p-5">
                                <p className="boarding-label text-destructive">
                                    Motivo de cancelación
                                </p>
                                <p className="leading-relaxed text-foreground">
                                    {cita.motivoCancelacion}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {cita.adicionales?.length > 0 && (
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="space-y-3 p-5">
                                <p className="boarding-label text-muted-foreground">
                                    Servicios adicionales
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {cita.adicionales.map((adicional) => (
                                        <Badge key={adicional.id} variant="secondary">
                                            {adicional.nombre} ({formatMoney(adicional.precio)})
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className="space-y-4">
                    <InfoTile label="Estado">
                        <Badge variant={estadoColor}>{cita.estadoCita?.nombre}</Badge>
                    </InfoTile>

                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <p className="boarding-label text-muted-foreground">Resumen</p>
                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-2">
                                <dt className="text-muted-foreground">Curso</dt>
                                <dd className="font-medium">{formatMoney(cita.precioServicio)}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <dt className="text-muted-foreground">Adicionales</dt>
                                <dd className="font-medium">{formatMoney(cita.costoAdicionales)}</dd>
                            </div>
                        </dl>
                        <div className="dash-sep my-3" />
                        <p className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold">Total</span>
                            <span className="text-2xl font-extrabold tracking-tight text-primary">
                                {formatMoney(cita.costoTotal)}
                            </span>
                        </p>
                    </div>

                    {puedeCambiarEstado && cita.estadoCita?.nombre !== "Cancelada" && (
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="boarding-label text-muted-foreground">Cambiar estado</p>
                            <select
                                value={estadoNuevo}
                                onChange={(event) => setEstadoNuevo(event.target.value)}
                                className="mt-3 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring"
                            >
                                <option value="">Seleccione un estado</option>
                                {estados
                                    .filter((estado) => estado.nombre !== "Cancelada")
                                    .map((estado) => (
                                        <option key={estado.id} value={estado.id}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                            </select>
                            <Button
                                type="button"
                                size="sm"
                                className="mt-3 w-full"
                                disabled={!estadoNuevo}
                                onClick={handleCambiarEstado}
                            >
                                Actualizar estado
                            </Button>
                        </div>
                    )}

                    {puedeCancelar && (
                        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 shadow-sm">
                            <p className="boarding-label text-destructive">Cancelar cita</p>
                            <Textarea
                                placeholder="Motivo de la cancelación"
                                rows={3}
                                className="mt-3"
                                value={motivoCancelacion}
                                onChange={(event) => setMotivoCancelacion(event.target.value)}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-3 w-full"
                                disabled={motivoCancelacion.trim().length < 5}
                                onClick={handleCancelar}
                            >
                                <XCircle className="size-4" />
                                Cancelar cita
                            </Button>
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}
