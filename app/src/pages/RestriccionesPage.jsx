import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/auth/useAuth";
import {
    cambiarEstadoRestriccionHorario,
    getRestriccionesHorario,
} from "../services/restriccionHorarioService";
import { formatFecha, formatHora } from "../lib/format";

export function RestriccionesPage() {
    const { hasRole } = useAuth();
    const [restricciones, setRestricciones] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function fetchRestricciones() {
            try {
                setLoading(true);
                const data = await getRestriccionesHorario();
                setRestricciones(data.data);
            } catch {
                setError("Error al cargar las restricciones de horario.");
            } finally {
                setLoading(false);
            }
        }
        fetchRestricciones();
    }, []);

    const filteredRestricciones = restricciones.filter((restriccion) => {
        const motivo = restriccion.motivo?.toLowerCase() || "";
        const empleado = `${restriccion.empleado?.usuario?.nombre ?? ""} ${restriccion.empleado?.usuario?.primerApellido ?? ""}`.toLowerCase();
        const tipo = restriccion.tipoRestriccion?.nombre?.toLowerCase() || "";
        const termino = search.toLowerCase();
        return motivo.includes(termino) || empleado.includes(termino) || tipo.includes(termino);
    });

    async function handleToggleEstado(restriccion) {
        try {
            const data = await cambiarEstadoRestriccionHorario(restriccion.id, !restriccion.activo);
            setRestricciones((actuales) =>
                actuales.map((item) =>
                    item.id === restriccion.id ? { ...item, activo: data.data.activo } : item
                )
            );
            toast.success(
                data.data.activo
                    ? "La restricción fue activada."
                    : "La restricción fue desactivada."
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
                title="Restricciones de horario"
                description="Cierres globales y bloqueos de horario de los instructores."
                actions={
                    esAdmin && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/restricciones/crear">
                                <PlusCircle className="size-4" />
                                Nueva restricción
                            </Link>
                        </Button>
                    )
                }
            />

            <div className="px-1">
                <SearchBar value={search} onChange={setSearch} />
            </div>

            {loading ? (
                <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
            ) : error ? (
                <Alert>{error}</Alert>
            ) : filteredRestricciones.length === 0 ? (
                <EmptyState
                    title="Sin restricciones"
                    description="No hay restricciones de horario que coincidan con tu búsqueda."
                />
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/60">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Fecha</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Instructor</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Tipo</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Horario</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground">Estado</th>
                                <th className="px-5 py-3.5 text-right font-semibold text-muted-foreground">Detalle</th>
                                {esAdmin && (
                                    <th className="px-5 py-3.5 text-right font-semibold text-muted-foreground">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredRestricciones.map((restriccion) => (
                                <tr key={restriccion.id} className="transition-colors hover:bg-muted/40">
                                    <td className="px-5 py-3.5 font-semibold tabular-nums">
                                        {formatFecha(restriccion.fecha)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {restriccion.empleado ? (
                                            `${restriccion.empleado.usuario?.nombre} ${restriccion.empleado.usuario?.primerApellido}`
                                        ) : (
                                            <Badge variant="outline">Todo el establecimiento</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {restriccion.tipoRestriccion?.nombre}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {restriccion.todoElDia
                                            ? "Todo el día"
                                            : `${formatHora(restriccion.horaInicio)} - ${formatHora(restriccion.horaFin)}`}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {restriccion.activo ? (
                                            <Badge>Activo</Badge>
                                        ) : (
                                            <Badge variant="destructive">Inactivo</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex justify-end">
                                            <Button asChild variant="outline" size="sm">
                                                <Link to={`/restricciones/${restriccion.id}`}>Detalle</Link>
                                            </Button>
                                        </div>
                                    </td>
                                    {esAdmin && (
                                        <td className="px-5 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/restricciones/${restriccion.id}/editar`}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={restriccion.activo ? "destructive" : "default"}
                                                    onClick={() => handleToggleEstado(restriccion)}
                                                >
                                                    {restriccion.activo ? "Desactivar" : "Activar"}
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
