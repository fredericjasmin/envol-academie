import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, UserRound } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";
import PropTypes from "prop-types";

export function EmpleadoCard({ empleado }) {
    const { hasRole } = useAuth();
    const canManage = hasRole(["Administrador"]);
    const fullName = `${empleado.usuario?.nombre ?? ""} ${empleado.usuario?.primerApellido ?? ""}`.trim();

    return (
        <Card className="group/card card-lift gap-0 overflow-hidden rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                            {(fullName || "E").charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <CardTitle className="truncate text-lg font-bold tracking-tight">
                                {fullName || "Sin nombre"}
                            </CardTitle>
                            <p className="boarding-label mt-0.5 text-primary/70">
                                {empleado.codigoEmpleado}
                            </p>
                        </div>
                    </div>
                    {empleado.activo ? (
                        <Badge>Activo</Badge>
                    ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pb-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                        <GraduationCap className="size-4 text-primary/70" />
                        {empleado.especialidad?.nombre || "Sin especialidad"}
                    </p>
                    {empleado.usuario?.correo && (
                        <p className="truncate">{empleado.usuario.correo}</p>
                    )}
                </div>

                <div className="dash-sep" />

                {typeof empleado._count === "number" && (
                    <div className="flex items-center justify-between">
                        <span className="boarding-label text-muted-foreground">
                            Citas asignadas
                        </span>
                        <span className="text-lg font-extrabold text-primary">
                            {empleado._count}
                        </span>
                    </div>
                )}
            </CardContent>

            <div className="flex gap-2 px-4 pb-4">
                <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                >
                    <Link to={`/empleados/${empleado.id}`}>
                        <span className="font-semibold">Ver detalle</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
                {canManage && (
                    <Button asChild variant="outline" size="icon" aria-label="Editar empleado">
                        <Link to={`/empleados/${empleado.id}/editar`}>
                            <UserRound className="size-4" />
                        </Link>
                    </Button>
                )}
            </div>
        </Card>
    );
}

EmpleadoCard.propTypes = {
    empleado: PropTypes.shape({
        id: PropTypes.number.isRequired,
        codigoEmpleado: PropTypes.string.isRequired,
        activo: PropTypes.bool.isRequired,
        _count: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        especialidad: PropTypes.shape({
            nombre: PropTypes.string,
        }),
        usuario: PropTypes.shape({
            nombre: PropTypes.string,
            primerApellido: PropTypes.string,
            correo: PropTypes.string,
        }),
    }).isRequired,
};
