import { useEffect, useState } from "react"
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom"
import {
    CalendarDays,
    ChevronDown,
    LogIn,
    LogOut,
    Moon,
    PlusCircle,
    Sun,
    UserPlus,
    UserRound
} from "lucide-react"

import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const THEME_KEY = "theme"

export function Navbar() {
    const navigate = useNavigate()

    const {
        user,
        isAuthenticated,
        logout,
        hasRole
    } = useAuth()

    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_KEY)

        if (savedTheme) {
            return savedTheme === "dark"
        }

        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    })

    const roleName = user?.role?.name

    const canCreateEvent = hasRole([
        "Administrador"
    ])

    const linkClass = ({ isActive }) =>
        isActive
            ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            : "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            darkMode
        )

        localStorage.setItem(
            THEME_KEY,
            darkMode ? "dark" : "light"
        )
    }, [darkMode])

    function toggleTheme() {
        setDarkMode((previousMode) => !previousMode)
    }

    function getInitials(fullName) {
        if (!fullName) {
            return "U"
        }

        return fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) =>
                word.charAt(0).toUpperCase()
            )
            .join("")
    }

    function handleLogout() {
        logout()

        navigate("/", {
            replace: true
        })
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <h1 className="hidden text-lg font-bold tracking-tight text-foreground sm:block md:text-xl">
                            Sistema de{" "}
                            <span className="text-primary">
                                Eventos
                            </span>
                        </h1>
                    </Link>

                    <div className="hidden items-center gap-1 rounded-full border border-border bg-card/70 p-1 shadow-sm md:flex">
                        <NavLink
                            to="/"
                            className={linkClass}
                        >
                            Inicio
                        </NavLink>

                        <NavLink
                            to="/events"
                            className={linkClass}
                        >
                            Eventos
                        </NavLink>

                        {canCreateEvent && (
                            <NavLink
                                to="/create"
                                className={linkClass}
                            >
                                <span className="flex items-center gap-1.5">
                                    <PlusCircle className="h-4 w-4" />
                                    Crear evento
                                </span>
                            </NavLink>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={
                            darkMode
                                ? "Activar tema claro"
                                : "Activar tema oscuro"
                        }
                        title={
                            darkMode
                                ? "Activar tema claro"
                                : "Activar tema oscuro"
                        }
                        className="rounded-full border-border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        {darkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex h-auto items-center gap-2 rounded-full px-2 py-1.5"
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>
                                        {isAuthenticated
                                            ? getInitials(
                                                user?.fullName
                                            )
                                            : "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="hidden text-left sm:block">
                                    <p className="max-w-40 truncate text-sm font-medium">
                                        {isAuthenticated
                                            ? user?.fullName
                                            : "Invitado"}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {isAuthenticated
                                            ? roleName
                                            : "Sin sesión"}
                                    </p>
                                </div>

                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-64"
                        >
                            <DropdownMenuLabel>
                                {isAuthenticated ? (
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {user?.fullName}
                                        </p>

                                        <p className="text-xs font-normal text-muted-foreground">
                                            {user?.email}
                                        </p>

                                        <p className="text-xs font-normal text-muted-foreground">
                                            Rol: {roleName}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            Cuenta de usuario
                                        </p>

                                        <p className="text-xs font-normal text-muted-foreground">
                                            Inicie sesión o cree una cuenta.
                                        </p>
                                    </div>
                                )}
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                disabled={isAuthenticated}
                                onSelect={() =>
                                    navigate("/login")
                                }
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Iniciar sesión
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                disabled={isAuthenticated}
                                onSelect={() =>
                                    navigate("/register")
                                }
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Registrarse
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                disabled={!isAuthenticated}
                            >
                                <UserRound className="mr-2 h-4 w-4" />
                                Usuario autenticado
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                disabled={!isAuthenticated}
                                onSelect={handleLogout}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    )
}

