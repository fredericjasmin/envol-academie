import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    CalendarPlus,
    CalendarRange,
    ChevronDown,
    Clock,
    Home,
    LogOut,
    Plane,
    Plus,
    Settings,
    UserRound,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const linkClass = ({ isActive }) =>
    cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

function initialsOf(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

export function Navbar() {
    const { user, isAuthenticated, logout, hasRole } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const menuRef = useRef(null);
    const createRef = useRef(null);

    const isAdmin = hasRole(["Administrador"]);
    const isEmpleado = hasRole(["Empleado"]);
    const canSeeCitas = hasRole(["Administrador", "Empleado", "Cliente"]);
    const canSeeAgenda = isAdmin || isEmpleado;
    const fullName = user
        ? `${user.nombre} ${user.primerApellido ?? ""}`.trim()
        : "";
    const roleName = user?.rol?.nombre;

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (createRef.current && !createRef.current.contains(event.target)) {
                setCreateOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function closeMenus() {
        setMenuOpen(false);
        setCreateOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/80 bg-[#fbfdff]/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
                <NavLink
                    to="/"
                    className="flex shrink-0 items-center gap-2"
                    onClick={closeMenus}
                >
                    <img src={logo} alt="Envol Académie" className="h-12 w-auto" />
                </NavLink>

                <div className="flex items-center justify-center gap-1 overflow-x-auto text-sm">
                    <NavLink to="/" className={linkClass} onClick={closeMenus}>
                        <Home className="size-4" />
                        Inicio
                    </NavLink>
                    <NavLink to="/servicios" className={linkClass} onClick={closeMenus}>
                        <Plane className="size-4" />
                        Cursos
                    </NavLink>
                    <NavLink to="/adicionales" className={linkClass} onClick={closeMenus}>
                        Adicionales
                    </NavLink>
                    {canSeeCitas && (
                        <NavLink to="/citas" className={linkClass} onClick={closeMenus}>
                            Citas
                        </NavLink>
                    )}
                    {canSeeAgenda && (
                        <NavLink
                            to={isAdmin ? "/agenda-diaria" : "/mi-agenda"}
                            className={linkClass}
                            onClick={closeMenus}
                        >
                            <CalendarRange className="size-4" />
                            Agenda
                        </NavLink>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {!isAuthenticated ? (
                        <>
                            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                                <Link to="/login">Iniciar sesión</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link to="/register">Registrarse</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            {isAdmin ? (
                                <div className="relative" ref={createRef}>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setCreateOpen((open) => !open)}
                                        aria-expanded={createOpen}
                                        aria-haspopup="menu"
                                    >
                                        <Plus className="size-4" />
                                        Crear
                                        <ChevronDown className="size-3.5 opacity-70" />
                                    </Button>
                                    {createOpen && (
                                        <div
                                            role="menu"
                                            className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
                                        >
                                            <MenuLink to="/citas/crear" icon={<CalendarPlus className="size-4" />} onClick={closeMenus}>
                                                Nueva cita
                                            </MenuLink>
                                            <MenuLink to="/servicios/crear" icon={<Plane className="size-4" />} onClick={closeMenus}>
                                                Nuevo curso
                                            </MenuLink>
                                            <MenuLink to="/adicionales/crear" icon={<Plus className="size-4" />} onClick={closeMenus}>
                                                Nuevo adicional
                                            </MenuLink>
                                            <Separator />
                                            <MenuLink to="/empleados/crear" icon={<UserRound className="size-4" />} onClick={closeMenus}>
                                                Nuevo empleado
                                            </MenuLink>
                                            <MenuLink to="/horarios/crear" icon={<Clock className="size-4" />} onClick={closeMenus}>
                                                Nuevo horario
                                            </MenuLink>
                                            <MenuLink to="/restricciones/crear" icon={<Settings className="size-4" />} onClick={closeMenus}>
                                                Nueva restricción
                                            </MenuLink>
                                        </div>
                                    )}
                                </div>
                            ) : isEmpleado ? (
                                <Button asChild size="sm">
                                    <Link to="/citas/crear" onClick={closeMenus}>
                                        <CalendarPlus className="size-4" />
                                        Nueva cita
                                    </Link>
                                </Button>
                            ) : null}

                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((open) => !open)}
                                    className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-muted"
                                    aria-expanded={menuOpen}
                                    aria-haspopup="menu"
                                >
                                    <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        {initialsOf(fullName) || "U"}
                                    </span>
                                    <span className="hidden text-left sm:block">
                                        <span className="block text-sm font-semibold leading-tight">
                                            {fullName || "Usuario"}
                                        </span>
                                        <span className="block text-xs text-muted-foreground leading-tight">
                                            {roleName}
                                        </span>
                                    </span>
                                    <ChevronDown className="size-3.5 text-muted-foreground" />
                                </button>
                                {menuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
                                    >
                                        <MenuLink to="/perfil" icon={<UserRound className="size-4" />} onClick={closeMenus}>
                                            Mi perfil
                                        </MenuLink>
                                        {isAdmin && (
                                            <>
                                                <Separator />
                                                <MenuLink to="/empleados" icon={<UserRound className="size-4" />} onClick={closeMenus}>
                                                    Empleados
                                                </MenuLink>
                                                <MenuLink to="/horarios" icon={<Clock className="size-4" />} onClick={closeMenus}>
                                                    Horarios
                                                </MenuLink>
                                                <MenuLink to="/restricciones" icon={<Settings className="size-4" />} onClick={closeMenus}>
                                                    Restricciones
                                                </MenuLink>
                                                <MenuLink to="/agenda-diaria" icon={<CalendarRange className="size-4" />} onClick={closeMenus}>
                                                    Agenda diaria
                                                </MenuLink>
                                            </>
                                        )}
                                        <Separator />
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={() => {
                                                closeMenus();
                                                logout();
                                            }}
                                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                                        >
                                            <LogOut className="size-4" />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

function MenuLink({ to, icon, onClick, children }) {
    return (
        <Link
            to={to}
            role="menuitem"
            onClick={onClick}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
            <span className="text-muted-foreground">{icon}</span>
            {children}
        </Link>
    );
}

MenuLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
};

function Separator() {
    return <div className="my-1 h-px bg-border" aria-hidden="true" />;
}
