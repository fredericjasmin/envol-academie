import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert } from "../components/ui/alert";
import {
    cambiarEstadoAdicional,
    getAdicionalById,
} from "../services/adicionalService";
import { useAuth } from "../auth/useAuth";
import { formatMoney } from "../lib/format";

export function AdicionalDetailPage() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const [adicional, setAdicional] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const esAdmin = hasRole(["Administrador"]);

    useEffect(() => {
        async function loadAdicional() {
            try {
                setLoading(true);
                setError("");
                const data = await getAdicionalById(id);
                if (!data) {
                    setAdicional(null);
                    return;
                }
                setAdicional(data.data);
            } catch {
                setError("Ocurrió un error al cargar el servicio adicional.");
            } finally {
                setLoading(false);
            }
        }
        loadAdicional();
    }, [id]);

    async function handleToggleEstado() {
        if (!adicional) return;
        try {
            const data = await cambiarEstadoAdicional(adicional.id, !adicional.activo);
            setAdicional(data.data);
            toast.success(
                data.data.activo
                    ? "El servicio adicional fue activado."
                    : "El servicio adicional fue desactivado."
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
    if (!adicional) {
        return (
            <section className="space-y-6">
                <PageHeader
                    title="Adicional no encontrado"
                    description="No existe un servicio adicional asociado al identificador solicitado."
                    actions={
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/adicionales">
                                <ArrowLeft className="size-4" />
                                Volver a adicionales
                            </Link>
                        </Button>
                    }
                />
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <PageHeader
                code={`Adicional · #${adicional.id}`}
                title={adicional.nombre}
                description="Información detallada del servicio adicional seleccionado."
                actions={
                    esAdmin && (
                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                                <Link to={`/adicionales/${adicional.id}/editar`}>
                                    <Pencil className="size-4" />
                                    Editar adicional
                                </Link>
                            </Button>
                            <Button
                                type="button"
                                variant={adicional.activo ? "destructive" : "default"}
                                onClick={handleToggleEstado}
                                className={
                                    adicional.activo
                                        ? "border-transparent bg-white/15 text-white hover:bg-white/25"
                                        : "border-transparent bg-white text-foreground hover:bg-white/85"
                                }
                            >
                                {adicional.activo ? "Desactivar" : "Activar"}
                            </Button>
                        </div>
                    )
                }
            />

            <div className="grid gap-6 px-1 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {adicional.descripcion && (
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="space-y-3 p-5">
                                <p className="boarding-label text-muted-foreground">
                                    Descripción
                                </p>
                                <p className="leading-relaxed text-muted-foreground">
                                    {adicional.descripcion}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className="space-y-4">
                    <InfoTile label="Tarifa">
                        <p className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-primary">
                            <DollarSign className="size-6" />
                            {formatMoney(adicional.precio)}
                        </p>
                    </InfoTile>
                    <InfoTile label="Estado">
                        {adicional.activo ? (
                            <Badge>Activo</Badge>
                        ) : (
                            <Badge variant="destructive">Inactivo</Badge>
                        )}
                    </InfoTile>
                    <InfoTile label="Referencia">
                        <p className="text-lg font-semibold">#{adicional.id}</p>
                    </InfoTile>
                </aside>
            </div>
        </section>
    );
}
