import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { AdicionalForm } from "../components/AdicionalForm"
import { Alert } from "../components/ui/alert"
import {
    actualizarAdicional,
    getAdicionalById
} from "../services/adicionalService"

export function EditAdicionalPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [adicional, setAdicional] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true)

                const adicionalData = await getAdicionalById(id)

                if (!adicionalData) {
                    setError("El servicio adicional solicitado no existe.")
                    return
                }

                setAdicional(adicionalData.data)
            } catch {
                setError("No se pudieron cargar los datos para editar el adicional.")
            } finally {
                setLoading(false)
            }
        }

        loadEditData()
    }, [id])

    async function handleUpdateAdicional(formData) {
        try {
            const adicionalActualizado = await actualizarAdicional(id, formData)
            toast.success(`El adicional "${adicionalActualizado.data.nombre}" fue actualizado correctamente.`)
            navigate("/adicionales")
        } catch (error) {
            console.error("Error al actualizar el adicional", error)
            toast.error(error.message)
        }
    }

    if (loading) {
        return <p>Cargando datos del adicional...</p>
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
                title="Editar servicio adicional"
                description="Modifique la información del adicional seleccionado."
            />

            <AdicionalForm
                onSubmit={handleUpdateAdicional}
                initialData={adicional}
                submitText="Actualizar adicional"
            />
        </section>
    )
}