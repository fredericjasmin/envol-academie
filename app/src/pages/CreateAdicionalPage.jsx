import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { PageHeader } from "../components/PageHeader"
import { AdicionalForm } from "../components/AdicionalForm"
import { crearAdicional } from "../services/adicionalService"

export function CreateAdicionalPage() {
    const navigate = useNavigate()

    async function handleCreateAdicional(formData) {
        try {
            const nuevoAdicional = await crearAdicional(formData)
            toast.success(`El adicional "${nuevoAdicional.data.nombre}" fue registrado correctamente.`)
            navigate("/adicionales")
        } catch (error) {
            console.error("Error al crear el adicional", error)
            toast.error(error.message)
        }
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear servicio adicional"
                description="Complete la información del adicional y guarde los datos en la API."
            />
            <AdicionalForm onSubmit={handleCreateAdicional} />
        </section>
    )
}