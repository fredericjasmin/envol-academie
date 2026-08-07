import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyhole, Mail, UserPlus, UserRound, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { registerUser } from "@/services/authService"
import { registerSchema } from "@/schemas/registerSchema"
import { useAuth } from "@/auth/useAuth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterPage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })
    async function onSubmit(data) {
        try {
            await registerUser({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            })
            toast.success("Usuario registrado correctamente. Ahora puede iniciar sesión.")
            reset()
            navigate("/login", { replace: true })
        } catch (error) {
            toast.error(error.message || "No se pudo registrar el usuario.")
        }
    }
    // Vista en caso de estar ya autenticado
    if (isAuthenticated) {
        return (
            <section className="mx-auto max-w-md py-12 px-4">
                <Card className="border-muted/60 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Sesión activa</CardTitle>
                        <CardDescription>
                            Debe cerrar la sesión actual antes de registrar otra cuenta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button type="button" className="w-full shadow-sm" onClick={() => navigate("/events")}>
                            Ir a eventos
                        </Button>
                    </CardContent>
                </Card>
            </section>
        )
    }

    return (
        <section className="mx-auto max-w-md py-12 px-4">
            <Card className="border-muted/60 shadow-xl backdrop-blur-[2px]">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                        <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Crear cuenta</CardTitle>
                    <CardDescription>
                        Registre sus datos para acceder a TechEvents CR.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {/* CAMPO: Nombre Completo */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>
                                Nombre completo
                            </Label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Ana Rodríguez"
                                    autoComplete="name"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("fullName")}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-xs font-medium text-destructive">{errors.fullName.message}</p>
                            )}
                        </div>
                        {/* CAMPO: Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                        {/* CAMPO: Contraseña */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                                Contraseña
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                            )}
                        </div>
                        {/* CAMPO: Confirmar Contraseña */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
                                Confirmar contraseña
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repita la contraseña"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        {/* Botón de Envío */}
                        <Button type="submit" className="w-full shadow-sm font-medium" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Crear cuenta
                                </>
                            )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            ¿Ya tiene una cuenta?{" "}
                            <Link to="/login" className="font-semibold text-primary transition-colors hover:underline">
                                Iniciar sesión
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}