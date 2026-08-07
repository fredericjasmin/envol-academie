import { Link } from "react-router-dom";
import { Compass, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-border shadow-sm">
            <div className="navy-band relative px-6 py-20 text-center text-white">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
                    <Plane className="size-64" />
                </div>
                <div className="relative">
                    <p className="boarding-label text-white/55">Ruta no encontrada</p>
                    <p className="mt-4 text-7xl font-extrabold tracking-tight sm:text-8xl">404</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Fuera de la ruta de vuelo
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-white/70">
                        La página que busca no existe o fue movida a otro destino.
                    </p>
                    <Button
                        asChild
                        className="mt-8 border-transparent bg-white text-foreground hover:bg-white/85"
                    >
                        <Link to="/">
                            <Compass className="size-4" />
                            Volver al inicio
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
