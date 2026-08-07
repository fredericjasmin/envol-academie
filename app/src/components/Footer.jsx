import { Plane } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="navy-band mt-auto text-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="flex items-center gap-2 text-sm text-[#c6d8f0]">
                        <Plane className="size-4 rotate-45 text-[#9cc8ff]" />
                        ENVOL <span className="font-bold text-white">ACADÉMIE</span>
                        <span className="text-white/40">·</span>
                        Escuela de vuelo
                    </p>
                    <p className="text-sm text-[#c6d8f0]">
                        © {currentYear}{" "}
                        <span className="font-semibold text-[#9cc8ff]">ISW-613</span>.
                        Casi todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
