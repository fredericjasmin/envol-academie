import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogIn, Mail, LockKeyhole, Plane } from "lucide-react"
import toast from "react-hot-toast"

import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isAuthenticated } = useAuth()

    const [formData, setFormData] = useState({
        correo: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        if (!formData.correo.trim() || !formData.password.trim()) {
            toast.error("Debe completar todos los campos.")
            return
        }
        try {
            setLoading(true)
            const user = await login({
                correo: formData.correo.trim(),
                password: formData.password
            })
            toast.success(`Bienvenido, ${user.nombre}.`)
            const previousRoute = location.state?.from?.pathname
            navigate(previousRoute || "/servicios", {
                replace: true
            })
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (isAuthenticated) {
        return (
            <section className="mx-auto max-w-md">
                <Card className="overflow-hidden rounded-2xl border-border shadow-sm gap-0">
                    <div className="navy-band px-6 py-6 text-white">
                        <p className="boarding-label text-white/55">SesiÃ³n activa</p>
                        <h2 className="mt-1.5 text-2xl font-bold tracking-tight">SesiÃ³n activa</h2>
                        <p className="mt-1 text-sm text-white/70">
                            Ya existe un usuario autenticado en la aplicaciÃ³n.
                        </p>
                    </div>
                    <CardContent className="p-6">
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => navigate("/servicios")}
                        >
                            Ir a cursos
                        </Button>
                    </CardContent>
                </Card>
            </section>
        )
    }

    return (
        <section className="mx-auto max-w-md py-8">
            <Card className="overflow-hidden rounded-2xl border-border shadow-sm gap-0">
                <div className="navy-band relative px-6 pb-7 pt-6 text-white">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                    />
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-full bg-white/10">
                            <Plane className="size-5" />
                        </span>
                        <div>
                            <p className="boarding-label text-white/55">Envol AcadÃ©mie</p>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Iniciar sesiÃ³n
                            </h2>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-white/70">
                        Ingrese sus credenciales para acceder a su cuenta de vuelo.
                    </p>
                </div>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="correo" className="boarding-label text-muted-foreground">
                                Correo electrÃ³nico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="usuario@email.com"
                                    autoComplete="email"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="boarding-label text-muted-foreground">
                                ContraseÃ±a
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingrese su contraseÃ±a"
                                    autoComplete="current-password"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            {loading ? "Iniciando sesiÃ³n..." : "Iniciar sesiÃ³n"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Â¿No tiene una cuenta?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-primary hover:underline"
                            >
                                Registrarse
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}
