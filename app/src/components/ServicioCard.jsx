import { Link } from "react-router-dom";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

export function ServicioCard({ servicio }) {
    const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
    const FALLBACK_IMAGE = `${IMAGE_URL}/image-not-found.jpg`;
    const imagenSrc = servicio.imagen
        ? `${IMAGE_URL}/${servicio.imagen}`
        : FALLBACK_IMAGE;

    return (
        <Card className="group/card card-lift gap-0 overflow-hidden rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
            <div className="relative h-44 overflow-hidden">
                <img
                    src={imagenSrc}
                    alt={servicio.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
                    onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm backdrop-blur">
                    Curso Â· #{servicio.id}
                </span>
            </div>

            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg font-bold leading-snug tracking-tight">
                    {servicio.nombre}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pb-4">
                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1.5">
                        <GraduationCap className="size-4 shrink-0 text-primary/70" />
                        <span className="truncate">
                            {servicio.especialidad?.nombre || "Especialidad"}
                        </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                        <Clock className="size-4 text-primary/70" />
                        {servicio.duracionMinutos} min
                    </span>
                </div>

                <div className="dash-sep" />

                <div className="flex items-center justify-between gap-2">
                    <span className="boarding-label text-muted-foreground">Tarifa</span>
                    <span className="text-xl font-extrabold tracking-tight text-primary">
                        {formatMoney(servicio.precioBase)}
                    </span>
                </div>
            </CardContent>

            <div className="px-4 pb-4">
                <Button
                    asChild
                    variant="outline"
                    className="w-full border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                >
                    <Link to={`/servicios/${servicio.id}`}>
                        <span className="font-semibold">Ver curso</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
        </Card>
    );
}

ServicioCard.propTypes = {
    servicio: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        precioBase: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        duracionMinutos: PropTypes.number.isRequired,
        imagen: PropTypes.string,
        especialidad: PropTypes.shape({
            nombre: PropTypes.string,
        }),
    }).isRequired,
};
