import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Pencil } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import { useAuth } from "../auth/useAuth";
import { getHorarioAtencionById } from "../services/horarioAtencionService";
import { getDiasSemana } from "../services/diaSemanaService";
import { formatHora } from "../lib/format";

export function HorarioDetailPage() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function loadHorario() {
            try {
                setLoading(true);
                setError("");
                const [horarioData, diasData] = await Promise.all([
                    getHorarioAtencionById(id),
                    getDiasSemana(),
                ]);
                if (!horarioData) {
                    setError("El horario solicitado no existe.");
                    return;
                }
                const diaSemana = diasData.data.find(
                    (dia) => dia.id === horarioData.data.diaSemanaId
                );
                setHorario({ ...horarioData.data, diaSemana });
            } catch {
                setError("No se pudo cargar el detalle del horario.");
            } finally {
                setLoading(false);
            }
        }
        loadHorario();
    }, [id]);

    if (loading) {
        return <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />;
    }
    if (error) return <Alert>{error}</Alert>;
    if (!horario) return null;

    return (
        <section className="space-y-8">
            <PageHeader
                code={`Horario · #${horario.id}`}
                title={horario.diaSemana?.nombre ?? "Horario de atención"}
                description="Bloque de atención del establecimiento."
                actions={
                    esAdmin && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to={`/horarios/${horario.id}/editar`}>
                                <Pencil className="size-4" />
                                Editar horario
                            </Link>
                        </Button>
                    )
                }
            />

            <div className="mx-auto grid max-w-2xl gap-4 px-1 sm:grid-cols-2">
                <InfoTile label="Día">
                    <p className="text-xl font-bold">{horario.diaSemana?.nombre ?? "Día desconocido"}</p>
                </InfoTile>
                <InfoTile label="Estado">
                    {horario.activo ? (
                        <Badge>Activo</Badge>
                    ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                    )}
                </InfoTile>
                <InfoTile label="Hora de inicio">
                    <p className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="size-5 text-primary/70" />
                        {formatHora(horario.horaInicio)}
                    </p>
                </InfoTile>
                <InfoTile label="Hora de fin">
                    <p className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="size-5 text-primary/70" />
                        {formatHora(horario.horaFin)}
                    </p>
                </InfoTile>
            </div>

            <p className="px-1 text-center text-sm text-muted-foreground">
                Este bloque aplica para todos los instructores del establecimiento.
            </p>

            <div className="flex justify-center">
                <Button asChild variant="outline">
                    <Link to="/horarios">
                        <ArrowLeft className="size-4" />
                        Volver a horarios
                    </Link>
                </Button>
            </div>
        </section>
    );
}
