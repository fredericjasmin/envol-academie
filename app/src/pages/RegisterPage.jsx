import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    LockKeyhole,
    Mail,
    Phone,
    UserPlus,
    UserRound,
    Loader2
} from "lucide-react"
import toast from "react-hot-toast"

import { registerUser } from "@/services/authService"
import { registerSchema } from "@/schemas/registerSchema"
import { useAuth } from "@/auth/useAuth"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterPage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            nombre: "",
            primerApellido: "",
            segundoApellido: "",
            correo: "",
            telefono: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(data) {
        try {
            await registerUser({
                nombre: data.nombre,
                primerApellido: data.primerApellido,
                segundoApellido: data.segundoApellido?.trim() || null,
                correo: data.correo,
                telefono: data.telefono?.trim() || null,
                password: data.password
            })
            toast.success("Usuario registrado correctamente. Ahora puede iniciar sesiÃ³n.")
            reset()
            navigate("/login", { replace: true })
        } catch (error) {
            toast.error(error.message || "No se pudo registrar el usuario.")
        }
    }

    if (isAuthenticated) {
        return (
            <section className="mx-auto max-w-md py-12 px-4">
                <Card className="overflow-hidden rounded-2xl border-border shadow-sm gap-0">
                    <div className="navy-band px-6 py-6 text-white">
                        <p className="boarding-label text-white/55">SesiÃ³n activa</p>
                        <h2 className="mt-1.5 text-2xl font-bold tracking-tight">SesiÃ³n activa</h2>
                        <p className="mt-1 text-sm text-white/70">
                            Debe cerrar la sesiÃ³n actual antes de registrar otra cuenta.
                        </p>
                    </div>
                    <CardContent className="p-6">
                        <Button type="button" className="w-full" onClick={() => navigate("/servicios")}>
                            Ir a cursos
                        </Button>
                    </CardContent>
                </Card>
            </section>
        )
    }

    return (
        <section className="mx-auto max-w-md py-12 px-4">
            <Card className="overflow-hidden rounded-2xl border-border shadow-sm gap-0">
                <div className="navy-band relative px-6 pb-7 pt-6 text-white">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                    />
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-full bg-white/10">
                            <UserPlus className="size-5" />
                        </span>
                        <div>
                            <p className="boarding-label text-white/55">Envol AcadÃ©mie</p>
                            <h2 className="text-2xl font-bold tracking-tight">Crear cuenta</h2>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-white/70">
                        Registre sus datos para comenzar a volar con nosotros.
                    </p>
                </div>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <div className="space-y-1.5">
                            <Label htmlFor="nombre" className={`boarding-label ${errors.nombre ? "text-destructive" : "text-muted-foreground"}`}>
                                Nombre
                            </Label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="nombre"
                                    type="text"
                                    placeholder="MarÃ­a"
                                    autoComplete="given-name"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("nombre")}
                                />
                            </div>
                            {errors.nombre && (
                                <p className="text-xs font-medium text-destructive">{errors.nombre.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="primerApellido" className={`boarding-label ${errors.primerApellido ? "text-destructive" : "text-muted-foreground"}`}>
                                Primer apellido
                            </Label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="primerApellido"
                                    type="text"
                                    placeholder="LÃ³pez"
                                    autoComplete="family-name"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.primerApellido ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("primerApellido")}
                                />
                            </div>
                            {errors.primerApellido && (
                                <p className="text-xs font-medium text-destructive">{errors.primerApellido.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="segundoApellido" className={`boarding-label ${errors.segundoApellido ? "text-destructive" : "text-muted-foreground"}`}>
                                Segundo apellido (opcional)
                            </Label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="segundoApellido"
                                    type="text"
                                    placeholder="Mora"
                                    autoComplete="additional-name"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.segundoApellido ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("segundoApellido")}
                                />
                            </div>
                            {errors.segundoApellido && (
                                <p className="text-xs font-medium text-destructive">{errors.segundoApellido.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="correo" className={`boarding-label ${errors.correo ? "text-destructive" : "text-muted-foreground"}`}>
                                Correo electrÃ³nico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="correo"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.correo ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("correo")}
                                />
                            </div>
                            {errors.correo && (
                                <p className="text-xs font-medium text-destructive">{errors.correo.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="telefono" className={`boarding-label ${errors.telefono ? "text-destructive" : "text-muted-foreground"}`}>
                                TelÃ©fono (opcional)
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="telefono"
                                    type="tel"
                                    placeholder="8888-8888"
                                    autoComplete="tel"
                                    disabled={isSubmitting}
                                    className={`pl-9 bg-background/50 focus-visible:ring-1 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("telefono")}
                                />
                            </div>
                            {errors.telefono && (
                                <p className="text-xs font-medium text-destructive">{errors.telefono.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className={`boarding-label ${errors.password ? "text-destructive" : "text-muted-foreground"}`}>
                                ContraseÃ±a
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="MÃ­nimo 8 caracteres"
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

                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className={`boarding-label ${errors.confirmPassword ? "text-destructive" : "text-muted-foreground"}`}>
                                Confirmar contraseÃ±a
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repita la contraseÃ±a"
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
                            Â¿Ya tiene una cuenta?{" "}
                            <Link to="/login" className="font-semibold text-primary transition-colors hover:underline">
                                Iniciar sesiÃ³n
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}