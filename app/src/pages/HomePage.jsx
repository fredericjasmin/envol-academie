import { Link } from "react-router-dom";
import {
    ArrowRight,
    Clock3,
    GraduationCap,
    Plane,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
    {
        icon: GraduationCap,
        title: "Clases prácticas y teóricas",
        description: "Vuelos reales y teoría aeronáutica.",
    },
    {
        icon: ShieldCheck,
        title: "Instructores certificados",
        description: "Acompañamiento profesional en cada etapa.",
    },
    {
        icon: Clock3,
        title: "Lunes a sábado, 6:00 a 17:00",
        description: "Horarios que se adaptan a ti.",
    },
];

function BoardingPass() {
    return (
        <article className="relative w-full max-w-md rounded-2xl bg-white text-foreground shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between gap-4 border-b border-dashed border-border px-6 py-4">
                <div>
                    <p className="text-sm font-extrabold tracking-tight">
                        ENVOL <span className="text-primary">ACADÉMIE</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Escuela de vuelo</p>
                </div>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    Vuelo
                    <span className="rounded-md bg-chart-2/10 px-1.5 py-0.5 font-semibold text-chart-2">
                        ENV-001
                    </span>
                </p>
            </div>

            <div className="space-y-6 px-6 py-6">
                <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                        Destino
                    </p>
                    <p className="text-2xl font-extrabold tracking-tight">
                        Tu licencia de piloto
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                            Pasajero
                        </p>
                        <p className="font-semibold">Tú</p>
                    </div>
                    <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                            Horario
                        </p>
                        <p className="font-semibold">06:00 – 17:00</p>
                    </div>
                    <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                            Instructor
                        </p>
                        <p className="font-semibold">Certificado</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-6 border-t border-dashed border-border bg-muted px-6 py-4">
                <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                        Puerta
                    </p>
                    <p className="font-semibold">Aeroclub</p>
                </div>
                <div
                    aria-hidden="true"
                    className="h-9 w-32 shrink-0 bg-[repeating-linear-gradient(90deg,var(--foreground)_0px,var(--foreground)_2px,transparent_2px,transparent_4px,var(--foreground)_4px,var(--foreground)_5px,transparent_5px,transparent_9px)]"
                />
            </div>
        </article>
    );
}

export function HomePage() {
    return (
        <>
            <section className="full-bleed relative -mt-4 bg-foreground text-white">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-[#1a3a75] via-foreground to-[#0d1f42]"
                />

                <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 md:py-24 lg:flex-row lg:items-center lg:gap-16">
                    <div className="flex-1 space-y-6">
                        <h1 className="animate-fade-up text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                            Despega<span className="text-[#9cc8ff]">.</span>
                        </h1>
                        <p
                            className="animate-fade-up max-w-xl text-lg leading-relaxed text-[#c6d8f0]"
                            style={{ animationDelay: "100ms" }}
                        >
                            Clases prácticas y teóricas con instructores
                            certificados. Reserva tu próxima clase y despega.
                        </p>
                        <div className="animate-fade-up pt-2" style={{ animationDelay: "180ms" }}>
                            <Button asChild size="lg" className="group h-12 px-7 text-base">
                                <Link to="/servicios">
                                    Ver cursos
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div
                        className="animate-fade-up flex flex-1 justify-start lg:justify-end"
                        style={{ animationDelay: "260ms" }}
                    >
                        <BoardingPass />
                    </div>
                </div>

                <div aria-hidden="true" className="relative mx-auto max-w-6xl px-4 pb-8">
                    <div className="mx-auto flex max-w-3xl items-center gap-2">
                        <Plane className="h-4 w-4 shrink-0 rotate-45 text-white/50" />
                        <div className="flex flex-1 items-center gap-2">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <span key={index} className="h-1 flex-1 rounded-full bg-white/15" />
                            ))}
                        </div>
                        <Plane className="h-4 w-4 shrink-0 rotate-45 text-white/50" />
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-6xl space-y-14 py-14 md:py-16">
                <section className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
                    {highlights.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-start gap-4 md:px-8 md:first:pl-0 md:last:pr-0"
                        >
                            <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <item.icon className="h-5 w-5" />
                            </span>
                            <div className="space-y-1">
                                <h2 className="font-semibold leading-snug">
                                    {item.title}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="flex flex-col gap-6 border-t border-border pt-12 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Empieza con un vuelo de familiarización
                        </h2>
                        <p className="text-muted-foreground">
                            El curso ideal para tu primer acercamiento a la aviación.
                        </p>
                    </div>
                    <Button asChild size="lg" className="group h-12 px-7 text-base shrink-0">
                        <Link to="/servicios">
                            Ver cursos
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </section>
            </div>
        </>
    );
}
