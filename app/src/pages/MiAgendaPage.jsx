import { useEffect, useState } from "react";
import { CalendarDays, Clock, User } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { useAuth } from "../auth/useAuth";
import { getAgendaEmpleadoCita } from "../services/citaService";
import { formatHora, formatMoney } from "../lib/format";

function obtenerFechaActual() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function estadoColor(estado) {
    if (estado?.color === "success") return "default";
    if (estado?.color === "destructive" || estado?.nombre === "Cancelada") return "destructive";
    return "secondary";
}

export function MiAgendaPage() {
    const { user } = useAuth();
    const [fecha, setFecha] = useState(obtenerFechaActual());
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarAgenda() {
            if (!fecha || !user?.empleado?.id) return;
            try {
                setLoading(true);
                setError(null);
                const data = await getAgendaEmpleadoCita(user.empleado.id, fecha);
                setAgenda(data.data);
            } catch (error) {
                console.error("Error al cargar la agenda del empleado", error);
                setError("No se pudo cargar su agenda para la fecha seleccionada.");
            } finally {
                setLoading(false);
            }
        }
        cargarAgenda();
    }, [fecha, user?.empleado?.id]);

    if (!user?.empleado?.id) {
        return (
            <section className="space-y-6">
                <PageHeader
                    title="Mi agenda"
                    description="Consulta sus citas por día."
                />
                <div className="px-1">
                    <Alert>No tiene un perfil de instructor asociado a su cuenta.</Alert>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <PageHeader
                code="Panel del instructor"
                title="Mi agenda"
                description={`Citas del día para ${agenda?.empleado?.usuario?.nombre ?? "usted"}.`}
                actions={
                    <div className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-white">
                        <CalendarDays className="size-4" />
                        <input
                            type="date"
                            value={fecha}
                            onChange={(event) => setFecha(event.target.value)}
                            className="bg-transparent text-sm text-white outline-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                }
            />

            {loading && <p className="px-1 text-muted-foreground">Cargando agenda...</p>}
            {error && <Alert>{error}</Alert>}

            {agenda && !loading && !error && (
                <>
                    {agenda.restricciones?.length > 0 && (
                        <div className="px-1">
                            <Alert>
                                <strong>Atención:</strong> existen restricciones de horario aplicables
                                a este día.
                                <ul className="mt-2 list-disc pl-6">
                                    {agenda.restricciones.map((restriccion) => (
                                        <li key={restriccion.id}>
                                            {restriccion.todoElDia
                                                ? "Todo el día"
                                                : `${formatHora(restriccion.horaInicio)} - ${formatHora(restriccion.horaFin)}`}{" "}
                                            — {restriccion.motivo || restriccion.tipoRestriccion?.nombre}
                                        </li>
                                    ))}
                                </ul>
                            </Alert>
                        </div>
                    )}

                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <p className="flex items-center gap-2 text-base font-bold">
                            <Clock className="size-4 text-primary" />
                            Bloques de atención del día ({agenda.horarios?.length ?? 0})
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {agenda.horarios?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No hay bloques de atención configurados para este día.
                                </p>
                            ) : (
                                agenda.horarios.map((horario) => (
                                    <Badge key={horario.id} variant="secondary">
                                        {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <p className="flex items-center gap-2 text-base font-bold">
                            <User className="size-4 text-primary" />
                            Citas del día ({agenda.citas?.length ?? 0})
                        </p>
                        <div className="mt-3">
                            {agenda.citas?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No tiene citas asignadas para esta fecha.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {agenda.citas.map((cita) => (
                                        <li
                                            key={cita.id}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm transition-colors hover:border-primary/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-4 text-primary" />
                                                <span className="font-semibold">
                                                    {formatHora(cita.horaInicio)} - {formatHora(cita.horaFin)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <User className="size-4 text-muted-foreground" />
                                                <span>
                                                    {cita.cliente?.nombre} {cita.cliente?.primerApellido}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    · {cita.servicio?.nombre}
                                                </span>
                                                <span className="font-semibold text-primary">
                                                    {formatMoney(cita.costoTotal)}
                                                </span>
                                                {cita.estadoCita && (
                                                    <Badge variant={estadoColor(cita.estadoCita)}>
                                                        {cita.estadoCita.nombre}
                                                    </Badge>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
