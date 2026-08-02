import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

const linkClass = ({ isActive }) =>
    isActive
        ? "font-semibold text-primary"
        : "font-medium text-muted-foreground hover:text-primary transition-colors";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <NavLink to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Envol Académie"
                        className="h-12 w-auto"
                    />
                </NavLink>

                <div className="flex items-center gap-6 text-sm">
                    <NavLink to="/" className={linkClass}>Inicio</NavLink>
                    <NavLink to="/servicios" className={linkClass}>Cursos</NavLink>
                </div>
            </nav>
        </header>
    );
}