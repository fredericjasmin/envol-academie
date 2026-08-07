import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, FileText, Pencil, User } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { useAuth } from "../auth/useAuth";
import { getRestriccionHorarioById } from "../services/restriccionHorarioService";
import { formatFecha, formatHora } from "../lib/format";

export function RestriccionDetailPage() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const [restriccion, setRestriccion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function loadRestriccion() {
            try {
                setLoading(true);
                setError("");
                const data = await getRestriccionHorarioById(id);
                if (!data) {
                    setError("La restricción solicitada no existe.");
                    return;
                }
                setRestriccion(data.data);
            } catch {
                setError("No se pudo cargar el detalle de la restricción.");
            } finally {
                setLoading(false);
            }
        }
        loadRestriccion();
    }, [id]);

    if (loading) {
        return <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />;
    }
    if (error) return <Alert>{error}</Alert>;
    if (!restriccion) return null;

    return (
        <section className="space-y-8">
            <PageHeader
                code={`Restricción · #${restriccion.id}`}
                title={restriccion.tipoRestriccion?.nombre ?? "Restricción de horario"}
                description="Excepción o bloqueo aplicado a la agenda de un instructor."
                actions={
                    esAdmin && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to={`/restricciones/${restriccion.id}/editar`}>
                                <Pencil className="size-4" />
                                Editar restricción
                            </Link>
                        </Button>
                    )
                }
            />

            <div className="mx-auto grid max-w-2xl gap-4 px-1 sm:grid-cols-2">
                <InfoTile label="Fecha">
                    <p className="flex items-center gap-2 text-lg font-semibold">
                        <CalendarDays className="size-5 text-primary/70" />
                        {formatFecha(restriccion.fecha)}
                    </p>
                </InfoTile>
                <InfoTile label="Horario">
                    <p className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="size-5 text-primary/70" />
                        {restriccion.todoElDia
                            ? "Todo el día"
                            : `${formatHora(restriccion.horaInicio)} – ${formatHora(restriccion.horaFin)}`}
                    </p>
                </InfoTile>
                <InfoTile label="Aplica a">
                    {restriccion.empleado ? (
                        <p className="flex items-center gap-2 text-lg font-semibold">
                            <User className="size-5 text-primary/70" />
                            {restriccion.empleado.usuario?.nombre} {restriccion.empleado.usuario?.primerApellido}
                        </p>
                    ) : (
                        <Badge variant="outline">Todo el establecimiento</Badge>
                    )}
                </InfoTile>
                <InfoTile label="Estado">
                    {restriccion.activo ? (
                        <Badge>Activo</Badge>
                    ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                    )}
                </InfoTile>
                <InfoTile label="Motivo">
                    <p className="flex items-start gap-2 leading-relaxed text-foreground">
                        <FileText className="mt-0.5 size-5 shrink-0 text-primary/70" />
                        {restriccion.motivo}
                    </p>
                </InfoTile>
            </div>

            <div className="flex justify-center">
                <Button asChild variant="outline">
                    <Link to="/restricciones">
                        <ArrowLeft className="size-4" />
                        Volver a restricciones
                    </Link>
                </Button>
            </div>
        </section>
    );
}
