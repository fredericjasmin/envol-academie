import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { getAgendaDiaria } from "../services/citaService";
import {
    aMinutos,
    bloquesHorarios,
    formatHora,
    seTraslapa,
} from "../lib/format";

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

export function AgendaDiariaPage() {
    const [fecha, setFecha] = useState(obtenerFechaActual());
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarAgenda() {
            if (!fecha) return;
            try {
                setLoading(true);
                setError(null);
                const data = await getAgendaDiaria(fecha);
                setAgenda(data.data);
            } catch (error) {
                console.error("Error al cargar la agenda diaria", error);
                setError("No se pudo cargar la agenda para la fecha seleccionada.");
            } finally {
                setLoading(false);
            }
        }
        cargarAgenda();
    }, [fecha]);

    const bloques = bloquesHorarios(agenda?.horarios ?? []);
    const totalCitas =
        agenda?.empleados?.reduce((total, empleado) => total + (empleado.citas?.length ?? 0), 0) ?? 0;

    function estadoCelda(empleado, bloque) {
        const inicio = aMinutos(bloque.horaInicio);
        const fin = aMinutos(bloque.horaFin);
        const restriccion = (empleado.restricciones ?? []).find((restriccion) => {
            if (restriccion.todoElDia) return true;
            const rInicio = aMinutos(restriccion.horaInicio);
            const rFin = aMinutos(restriccion.horaFin);
            return rInicio !== null && rFin !== null && seTraslapa(inicio, fin, rInicio, rFin);
        });
        const cita = (empleado.citas ?? []).find((cita) => {
            const cInicio = aMinutos(cita.horaInicio);
            const cFin = aMinutos(cita.horaFin);
            return cInicio !== null && cFin !== null && seTraslapa(inicio, fin, cInicio, cFin);
        });
        return { restriccion, cita };
    }

    return (
        <section className="space-y-8">
            <PageHeader
                code="Matriz de disponibilidad"
                title="Agenda diaria"
                description="Distribución de citas, bloques disponibles y horarios restringidos de los instructores."
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
                    {agenda.restriccionesGenerales?.length > 0 && (
                        <Alert>
                            <strong>Atención:</strong> existen restricciones generales para este día.
                            <ul className="mt-2 list-disc pl-6">
                                {agenda.restriccionesGenerales.map((restriccion) => (
                                    <li key={restriccion.id}>
                                        {restriccion.todoElDia
                                            ? "Todo el día"
                                            : `${formatHora(restriccion.horaInicio)} - ${formatHora(restriccion.horaFin)}`}{" "}
                                        — {restriccion.motivo || restriccion.tipoRestriccion?.nombre}
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    <div className="grid gap-4 px-1 sm:grid-cols-3">
                        <InfoTile label="Instructores">
                            <p className="text-3xl font-extrabold tracking-tight">
                                {agenda.empleados?.length ?? 0}
                            </p>
                        </InfoTile>
                        <InfoTile label="Citas programadas">
                            <p className="text-3xl font-extrabold tracking-tight">
                                {totalCitas}
                            </p>
                        </InfoTile>
                        <InfoTile label="Bloques de atención">
                            <p className="text-3xl font-extrabold tracking-tight">
                                {bloques.length}
                            </p>
                        </InfoTile>
                    </div>

                    {agenda.horarios?.length > 0 && (
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="flex items-center gap-2 text-base font-bold">
                                <Clock className="size-4 text-primary" />
                                Horario general de atención
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {agenda.horarios.map((horario) => (
                                    <Badge key={horario.id} variant="secondary">
                                        {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {agenda.empleados?.length === 0 || bloques.length === 0 ? (
                        <p className="px-1 text-center text-sm text-muted-foreground">
                            No hay instructores activos o bloques de atención para este día.
                        </p>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="navy-band text-white">
                                    <tr>
                                        <th className="min-w-[120px] px-4 py-3 font-bold text-white/70">
                                            Hora
                                        </th>
                                        {agenda.empleados.map((empleado) => (
                                            <th
                                                key={empleado.id}
                                                className="min-w-[180px] px-4 py-3 font-bold"
                                            >
                                                {empleado.usuario?.nombre} {empleado.usuario?.primerApellido}
                                                <span className="block text-xs font-medium text-white/60">
                                                    {empleado.especialidad?.nombre}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {bloques.map((bloque) => (
                                        <tr key={bloque.horaInicio} className="align-top">
                                            <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-muted-foreground">
                                                {bloque.horaInicio} – {bloque.horaFin}
                                            </td>
                                            {agenda.empleados.map((empleado) => {
                                                const { restriccion, cita } = estadoCelda(empleado, bloque);
                                                if (restriccion) {
                                                    return (
                                                        <td
                                                            key={empleado.id}
                                                            className="border-l border-border/60 bg-destructive/10 px-4 py-2.5"
                                                        >
                                                            <Badge variant="destructive">Restricción</Badge>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {restriccion.motivo ||
                                                                    restriccion.tipoRestriccion?.nombre}
                                                                {restriccion.todoElDia
                                                                    ? " · Todo el día"
                                                                    : ` · ${formatHora(restriccion.horaInicio)}–${formatHora(restriccion.horaFin)}`}
                                                            </p>
                                                        </td>
                                                    );
                                                }
                                                if (cita) {
                                                    return (
                                                        <td
                                                            key={empleado.id}
                                                            className="border-l border-border/60 bg-primary/5 px-4 py-2.5"
                                                        >
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Badge variant={estadoColor(cita.estadoCita)}>
                                                                    Ocupado
                                                                </Badge>
                                                                <Link
                                                                    to={`/citas/${cita.id}`}
                                                                    className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
                                                                >
                                                                    {cita.servicio?.nombre}
                                                                </Link>
                                                            </div>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {cita.cliente?.nombre} {cita.cliente?.primerApellido}
                                                                {" · "}
                                                                {formatHora(cita.horaInicio)}–{formatHora(cita.horaFin)}
                                                            </p>
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td
                                                        key={empleado.id}
                                                        className="border-l border-border/60 px-4 py-2.5"
                                                    >
                                                        <span className="text-xs font-semibold text-emerald-600">
                                                            Disponible
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
