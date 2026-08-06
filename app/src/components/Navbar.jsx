import { Link, NavLink } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";

const linkClass = ({ isActive }) =>
    isActive
        ? "font-semibold text-primary"
        : "font-medium text-muted-foreground hover:text-primary transition-colors";

export function Navbar() {
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const roleName = user?.rol?.nombre;
    const fullName = user
        ? `${user.nombre} ${user.primerApellido}`.trim()
        : "";

    const canCreateCourse = hasRole(["Administrador"]);

    function handleLogout() {
        logout();
    }

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

                    {canCreateCourse && (
                        <NavLink to="/servicios/crear" className={linkClass}>
                            <span className="flex items-center gap-1.5">
                                <PlusCircle className="h-4 w-4" />
                                Nuevo curso
                            </span>
                        </NavLink>
                    )}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold">{fullName}</p>
                                <p className="text-xs text-muted-foreground">{roleName}</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
                                Cerrar sesión
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link to="/login">Iniciar sesión</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link to="/register">Registrarse</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}