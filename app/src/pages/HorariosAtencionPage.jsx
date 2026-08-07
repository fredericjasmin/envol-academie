import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/auth/useAuth";
import {
    cambiarEstadoHorarioAtencion,
    getHorariosAtencion,
} from "../services/horarioAtencionService";
import { getDiasSemana } from "../services/diaSemanaService";
import { formatHora } from "../lib/format";

export function HorariosAtencionPage() {
    const { hasRole } = useAuth();
    const [horarios, setHorarios] = useState([]);
    const [diasSemana, setDiasSemana] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function fetchHorarios() {
            try {
                setLoading(true);
                const [horariosData, diasData] = await Promise.all([
                    getHorariosAtencion(),
                    getDiasSemana(),
                ]);
                setHorarios(horariosData.data);
                setDiasSemana(diasData.data);
            } catch {
                setError("Error al cargar los horarios de atención.");
            } finally {
                setLoading(false);
            }
        }
        fetchHorarios();
    }, []);

    const nombreDia = (diaSemanaId) =>
        diasSemana.find((dia) => dia.id === diaSemanaId)?.nombre || "Día desconocido";

    async function handleToggleEstado(horario) {
        try {
            const data = await cambiarEstadoHorarioAtencion(horario.id, !horario.activo);
            setHorarios((actuales) =>
                actuales.map((item) =>
                    item.id === horario.id ? { ...item, activo: data.data.activo } : item
                )
            );
            toast.success(
                data.data.activo
                    ? "El horario fue activado."
                    : "El horario fue desactivado."
            );
        } catch (error) {
            console.error("Error al cambiar el estado", error);
            toast.error(error.message);
        }
    }

    return (
        <section className="space-y-8">
            <PageHeader
                code="ENVOL · OPERACIONES"
                title="Horarios de atención"
                description="Días y rangos horarios en los que el establecimiento atiende."
                actions={
                    esAdmin && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/horarios/crear">
                                <PlusCircle className="size-4" />
                                Nuevo horario
                            </Link>
                        </Button>
                    )
                }
            />

            {loading ? (
                <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
            ) : error ? (
                <Alert>{error}</Alert>
            ) : horarios.length === 0 ? (
                <EmptyState
                    title="Sin horarios registrados"
                    description="No hay bloques de atención configurados para el establecimiento."
                />
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/60">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Día</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Hora de inicio</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Hora de fin</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Estado</th>
                                <th className="px-5 py-3.5 text-right font-semibold text-muted-foreground">Detalle</th>
                                {esAdmin && (
                                    <th className="px-5 py-3.5 text-right font-semibold text-muted-foreground">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {horarios.map((horario) => (
                                <tr key={horario.id} className="transition-colors hover:bg-muted/40">
                                    <td className="px-5 py-3.5 font-semibold">
                                        {nombreDia(horario.diaSemanaId)}
                                    </td>
                                    <td className="px-5 py-3.5 tabular-nums">{formatHora(horario.horaInicio)}</td>
                                    <td className="px-5 py-3.5 tabular-nums">{formatHora(horario.horaFin)}</td>
                                    <td className="px-5 py-3.5">
                                        {horario.activo ? (
                                            <Badge>Activo</Badge>
                                        ) : (
                                            <Badge variant="destructive">Inactivo</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex justify-end">
                                            <Button asChild variant="outline" size="sm">
                                                <Link to={`/horarios/${horario.id}`}>Detalle</Link>
                                            </Button>
                                        </div>
                                    </td>
                                    {esAdmin && (
                                        <td className="px-5 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/horarios/${horario.id}/editar`}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={horario.activo ? "destructive" : "default"}
                                                    onClick={() => handleToggleEstado(horario)}
                                                >
                                                    {horario.activo ? "Desactivar" : "Activar"}
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
