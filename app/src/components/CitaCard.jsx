import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFecha, formatHora, formatMoney } from "@/lib/format";
import PropTypes from "prop-types";

export function CitaCard({ cita }) {
    const estado = cita.estadoCita;
    const estadoColor =
        estado?.color === "success"
            ? "default"
            : estado?.color === "destructive" || estado?.nombre === "Cancelada"
                ? "destructive"
                : "secondary";

    return (
        <Card className="group/card card-lift gap-0 overflow-hidden rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 pb-2 pt-4">
                <div className="min-w-0">
                    <p className="boarding-label text-primary/70">Cita Â· #{cita.id}</p>
                    <CardTitle className="mt-0.5 truncate text-lg font-bold tracking-tight">
                        {cita.servicio?.nombre}
                    </CardTitle>
                </div>
                {estado && <Badge variant={estadoColor}>{estado.nombre}</Badge>}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pb-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                        <UserRound className="size-4 shrink-0 text-primary/70" />
                        <span className="truncate">
                            {cita.cliente?.nombre} {cita.cliente?.primerApellido}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <UserRound className="size-4 shrink-0 text-primary/70" />
                        <span className="truncate">
                            {cita.empleado?.usuario?.nombre}{" "}
                            {cita.empleado?.usuario?.primerApellido}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 shrink-0 text-primary/70" />
                        {formatFecha(cita.fecha)} Â· {formatHora(cita.horaInicio)} -{" "}
                        {formatHora(cita.horaFin)}
                    </p>
                    {cita.adicionales?.length > 0 && (
                        <p className="text-xs">
                            {cita.adicionales.length} adicional
                            {cita.adicionales.length !== 1 ? "es" : ""}
                        </p>
                    )}
                </div>

                <div className="dash-sep" />

                <div className="flex items-center justify-between gap-2">
                    <span className="boarding-label text-muted-foreground">Total</span>
                    <span className="text-lg font-extrabold tracking-tight text-primary">
                        {formatMoney(cita.costoTotal)}
                    </span>
                </div>
            </CardContent>

            <div className="px-4 pb-4">
                <Button
                    asChild
                    variant="outline"
                    className="w-full border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                >
                    <Link to={`/citas/${cita.id}`}>
                        <span className="font-semibold">Ver detalle</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
        </Card>
    );
}

CitaCard.propTypes = {
    cita: PropTypes.shape({
        id: PropTypes.number.isRequired,
        fecha: PropTypes.string.isRequired,
        horaInicio: PropTypes.string.isRequired,
        horaFin: PropTypes.string.isRequired,
        costoTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        servicio: PropTypes.shape({ nombre: PropTypes.string }),
        cliente: PropTypes.shape({ nombre: PropTypes.string, primerApellido: PropTypes.string }),
        empleado: PropTypes.shape({
            usuario: PropTypes.shape({ nombre: PropTypes.string, primerApellido: PropTypes.string }),
        }),
        estadoCita: PropTypes.shape({ nombre: PropTypes.string, color: PropTypes.string }),
        adicionales: PropTypes.array,
    }).isRequired,
};
