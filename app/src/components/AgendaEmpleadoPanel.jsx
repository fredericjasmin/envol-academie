import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert } from "./ui/alert";
import { getAgendaEmpleado } from "../services/empleadoService";
import {
    aMinutos,
    bloquesHorarios,
    formatHora,
    seTraslapa,
} from "../lib/format";
import PropTypes from "prop-types";

function estadoColor(estado) {
    if (estado?.color === "success") return "default";
    if (estado?.color === "destructive" || estado?.nombre === "Cancelada") return "destructive";
    return "secondary";
}

export function AgendaEmpleadoPanel({
    empleadoId,
    fecha,
    destacarInicio = "",
    destacarFin = "",
}) {
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const tieneSeleccion = Boolean(empleadoId && fecha);

    useEffect(() => {
        if (!empleadoId || !fecha) {
            setAgenda(null);
            setError(null);
            return;
        }
        let activo = true;
        async function cargarAgenda() {
            setLoading(true);
            setError(null);
            try {
                const data = await getAgendaEmpleado(empleadoId, fecha);
                if (!activo) return;
                setAgenda(data.data);
            } catch {
                if (activo) setError("No se pudo cargar la agenda del instructor.");
            } finally {
                if (activo) setLoading(false);
            }
        }
        cargarAgenda();
        return () => {
            activo = false;
        };
    }, [empleadoId, fecha]);

    if (!tieneSeleccion) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                Seleccione un instructor y una fecha para consultar su agenda.
            </div>
        );
    }

    if (loading) {
        return <p className="text-sm text-muted-foreground">Cargando agenda del instructor...</p>;
    }

    if (error) {
        return <Alert>{error}</Alert>;
    }

    if (!agenda) return null;

    const bloques = bloquesHorarios(agenda.horarios ?? []);
    const intervaloSeleccionado = destacarInicio && destacarFin;

    function estadoBloque(bloque) {
        const inicio = aMinutos(bloque.horaInicio);
        const fin = aMinutos(bloque.horaFin);
        const restriccion = (agenda.restricciones ?? []).find((restriccion) => {
            if (restriccion.todoElDia) return true;
            const rInicio = aMinutos(restriccion.horaInicio);
            const rFin = aMinutos(restriccion.horaFin);
            return rInicio !== null && rFin !== null && seTraslapa(inicio, fin, rInicio, rFin);
        });
        const cita = (agenda.citas ?? []).find((cita) => {
            const cInicio = aMinutos(cita.horaInicio);
            const cFin = aMinutos(cita.horaFin);
            return cInicio !== null && cFin !== null && seTraslapa(inicio, fin, cInicio, cFin);
        });
        let destacado = false;
        if (intervaloSeleccionado) {
            const dInicio = aMinutos(destacarInicio);
            const dFin = aMinutos(destacarFin);
            destacado = dInicio !== null && dFin !== null && seTraslapa(inicio, fin, dInicio, dFin);
        }
        return { restriccion, cita, destacado };
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="flex items-center gap-2 text-base font-bold">
                    <Clock className="size-4 text-primary" />
                    Agenda del instructor
                </p>
                <p className="text-sm text-muted-foreground">
                    Disponibilidad por bloques del día seleccionado
                </p>
                <div className="mt-4 space-y-2">
                    {agenda.horarios?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-1">
                            {agenda.horarios.map((horario) => (
                                <Badge key={horario.id} variant="secondary">
                                    {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {bloques.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No hay bloques de atención para este día.
                        </p>
                    ) : (
                        <ul className="space-y-1.5">
                            {bloques.map((bloque) => {
                                const { restriccion, cita, destacado } = estadoBloque(bloque);
                                let estilo = "border-border bg-card";
                                let etiqueta = "Disponible";
                                let detalle = "";
                                if (restriccion) {
                                    estilo = "border-destructive/40 bg-destructive/10";
                                    etiqueta = "Restricción";
                                    detalle = restriccion.motivo || restriccion.tipoRestriccion?.nombre;
                                } else if (cita) {
                                    estilo = "border-primary/30 bg-primary/5";
                                    etiqueta = "Cita asignada";
                                    detalle = `${cita.cliente?.nombre} ${cita.cliente?.primerApellido} · ${cita.servicio?.nombre}`;
                                }
                                if (destacado) {
                                    estilo = "border-primary bg-primary/10";
                                }
                                return (
                                    <li
                                        key={bloque.horaInicio}
                                        className={`flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm ${estilo}`}
                                    >
                                        <span className="font-semibold">
                                            {bloque.horaInicio} - {bloque.horaFin}
                                        </span>
                                        <span
                                            className={
                                                restriccion
                                                    ? "text-destructive"
                                                    : cita
                                                        ? "text-primary"
                                                        : "text-emerald-600"
                                            }
                                        >
                                            {etiqueta}
                                        </span>
                                        {detalle && (
                                            <span className="hidden text-xs text-muted-foreground md:block">
                                                {detalle}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {agenda.restricciones?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {agenda.restricciones.map((restriccion) => (
                                <Badge key={restriccion.id} variant="destructive">
                                    {restriccion.todoElDia
                                        ? "Todo el día"
                                        : `${formatHora(restriccion.horaInicio)} - ${formatHora(restriccion.horaFin)}`}
                                    {" · "}
                                    {restriccion.motivo || restriccion.tipoRestriccion?.nombre}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="flex items-center gap-2 text-base font-bold">
                    <User className="size-4 text-primary" />
                    Citas del día
                </p>
                <div className="mt-4">
                    {agenda.citas?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            El instructor no tiene citas asignadas para esta fecha.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {agenda.citas.map((cita) => (
                                <li
                                    key={cita.id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3 text-sm"
                                >
                                    <span className="font-semibold">
                                        {formatHora(cita.horaInicio)} - {formatHora(cita.horaFin)}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {cita.cliente?.nombre} {cita.cliente?.primerApellido} ·{" "}
                                        {cita.servicio?.nombre}
                                    </span>
                                    {cita.estadoCita && (
                                        <Badge variant={estadoColor(cita.estadoCita)}>
                                            {cita.estadoCita.nombre}
                                        </Badge>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

AgendaEmpleadoPanel.propTypes = {
    empleadoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fecha: PropTypes.string,
    destacarInicio: PropTypes.string,
    destacarFin: PropTypes.string,
};
