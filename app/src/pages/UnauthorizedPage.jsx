import { Link } from "react-router-dom"
import { ShieldAlert, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UnauthorizedPage() {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-border shadow-sm">
            <div className="navy-band relative px-6 py-20 text-center text-white">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
                    <ShieldX className="size-64" />
                </div>
                <div className="relative">
                    <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/10">
                        <ShieldAlert className="size-8" />
                    </span>
                    <p className="mt-5 boarding-label text-white/55">Acceso restringido</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Acceso no autorizado
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-white/70">
                        Su usuario no tiene permisos para ingresar a esta sección del hangar.
                    </p>
                    <Button
                        asChild
                        className="mt-8 border-transparent bg-white text-foreground hover:bg-white/85"
                    >
                        <Link to="/">
                            Volver al inicio
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
