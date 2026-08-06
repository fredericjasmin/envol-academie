import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { ServicioForm } from "../components/ServicioForm"
import { Alert } from "../components/ui/alert"
import { crearServicios } from "../services/servicioService"
import { getEspecialidades } from "../services/especialidadService"

export function CreateServicioPage() {
    const navigate = useNavigate()
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true)
                const especialidadesData = await getEspecialidades()
                setEspecialidades(especialidadesData.data)
            } catch {
                setError("No se pudieron cargar los datos del formulario.")
            } finally {
                setLoading(false)
            }
        }
        loadFormData()
    }, [])

    async function handleCreateServicio(formData) {
        try {
            const nuevoServicio = await crearServicios(formData)
            toast.success(`El curso "${nuevoServicio.data.nombre}" fue registrado correctamente.`)
            navigate("/servicios")
        } catch (error) {
            console.error("Error al crear el curso", error)
            toast.error(error.message)
        }
    }

    if (loading) {
        return <p>Cargando datos del formulario...</p>
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear curso"
                description="Complete la información del curso y guarde los datos en la API."
            />
            {error && (
                <Alert variant="destructive">
                    {error}
                </Alert>
            )}
            <ServicioForm
                onSubmit={handleCreateServicio}
                especialidades={especialidades}
            />
        </section>
    )
}