import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Pencil } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";
import { formatMoney } from "@/lib/format";

export function AdicionalCard({ adicional }) {
    const { hasRole } = useAuth();
    const canManage = hasRole(["Administrador"]);

    return (
        <Card className="group/card card-lift gap-0 overflow-hidden rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 pb-2 pt-4">
                <CardTitle className="text-lg font-bold leading-snug tracking-tight">
                    {adicional.nombre}
                </CardTitle>
                {adicional.activo ? (
                    <Badge>Activo</Badge>
                ) : (
                    <Badge variant="destructive">Inactivo</Badge>
                )}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pb-4">
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {adicional.descripcion}
                </p>

                <div className="dash-sep" />

                <div className="flex items-center justify-between gap-2">
                    <span className="boarding-label text-muted-foreground">Tarifa</span>
                    <span className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-primary">
                        <DollarSign className="size-5" />
                        {formatMoney(adicional.precio)}
                    </span>
                </div>
            </CardContent>

            <div className="flex gap-2 px-4 pb-4">
                <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                >
                    <Link to={`/adicionales/${adicional.id}`}>
                        <span className="font-semibold">Ver detalle</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
                {canManage && (
                    <Button asChild variant="outline" size="icon" aria-label="Editar adicional">
                        <Link to={`/adicionales/${adicional.id}/editar`}>
                            <Pencil className="size-4" />
                        </Link>
                    </Button>
                )}
            </div>
        </Card>
    );
}

AdicionalCard.propTypes = {
    adicional: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        activo: PropTypes.bool.isRequired,
    }).isRequired,
};
