import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { ServicioForm } from "../components/ServicioForm"
import { Alert } from "../components/ui/alert"
import {
    actualizarServicio,
    getServicioById
} from "../services/servicioService"
import { getEspecialidades } from "../services/especialidadService"

export function EditServicioPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [servicio, setServicio] = useState(null)
    const [especialidades, setEspecialidades] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true)

                const [servicioData, especialidadesData] = await Promise.all([
                    getServicioById(id),
                    getEspecialidades()
                ])

                if (!servicioData) {
                    setError("El curso solicitado no existe.")
                    return
                }

                setServicio(servicioData.data)
                setEspecialidades(especialidadesData.data)
            } catch {
                setError("No se pudieron cargar los datos para editar el curso.")
            } finally {
                setLoading(false)
            }
        }

        loadEditData()
    }, [id])

    async function handleUpdateServicio(formData) {
        try {
            const servicioData = {
                ...formData,
                imagen: servicio.imagen
            }
            const servicioActualizado = await actualizarServicio(id, servicioData)
            toast.success(`El curso "${servicioActualizado.data.nombre}" fue actualizado correctamente.`)
            navigate("/servicios")
        } catch (error) {
            console.error("Error al actualizar el curso", error)
            toast.error(error.message)
        }
    }

    if (loading) {
        return <p>Cargando datos del curso...</p>
    }

    if (error) {
        return (
            <Alert variant="destructive">
                {error}
            </Alert>
        )
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar curso"
                description="Modifique la información del curso seleccionado."
            />

            <ServicioForm
                onSubmit={handleUpdateServicio}
                especialidades={especialidades}
                initialData={servicio}
                submitText="Actualizar curso"
            />
        </section>
    )
}