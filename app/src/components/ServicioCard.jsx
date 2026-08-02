import { Link } from "react-router-dom";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

export function ServicioCard({ servicio }) {
    const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
    return (
        <Card className="overflow-hidden border-border bg-card text-card-foreground hover:border-primary/50 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                {servicio.imagen ? (
                    <img
                        src={`${IMAGE_URL}/${servicio.imagen}`}
                        alt={servicio.nombre}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        Sin imagen
                    </div>
                )}
            </div>

            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold tracking-tight">
                    {servicio.nombre}
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2.5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary/70" />
                    {servicio.especialidad?.nombre}
                </p>
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary/70" />
                        {servicio.duracionMinutos} min
                    </p>
                    <p className="font-bold text-primary">${servicio.precioBase}</p>
                </div>
            </CardContent>

            <CardFooter className="pt-3">
                <Button asChild variant="ghost" className="w-full bg-secondary/50 hover:bg-accent">
                    <Link to={`/servicios/${servicio.id}`}>
                        <span className="font-semibold">Ver detalles</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

ServicioCard.propTypes = {
    servicio: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        precioBase: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        duracionMinutos: PropTypes.number.isRequired,
        imagen: PropTypes.string,
        especialidad: PropTypes.shape({
            nombre: PropTypes.string,
        }),
    }).isRequired,
};
