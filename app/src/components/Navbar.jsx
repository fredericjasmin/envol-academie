import { useEffect, useState } from "react";
import { CalendarDays, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode])

    function toggleTheme() {
        setDarkMode((prev) => !prev);
        
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <CalendarDays className="h-5 w-5" />
                    </div>

                    <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                        Sistema de{" "}
                        <span className="text-primary">Eventos</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 p-1 shadow-sm">
                    <Button
                        variant="ghost"
                        className="rounded-full px-4 text-foreground hover:bg-primary hover:text-white"
                    >
                        Inicio
                    </Button>

                    <Button
                        variant="ghost"
                        className="rounded-full px-4 text-foreground hover:bg-primary hover:text-white"
                    >
                        Eventos
                    </Button>

                    <Button
                        variant="ghost"
                        className="rounded-full px-4 text-foreground hover:bg-primary hover:text-white"
                    >
                        Crear evento
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Cambiar tema"
                        className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                        {darkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </nav>
        </header>
    );
}
