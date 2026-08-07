import PropTypes from "prop-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { DollarSign, Text, Type } from "lucide-react"

import { adicionalSchema } from "../schemas/adicionalSchema"
import { FormError } from "./FormError"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
    Card,
    CardContent
} from "./ui/card"
import { useForm } from "react-hook-form"

export function AdicionalForm({
    onSubmit,
    initialData = null,
    submitText = "Registrar adicional"
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(adicionalSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precio: initialData?.precio || ""
        }
    })

    function handleValidSubmit(formData) {
        onSubmit(formData)
    }

    return (
        <Card className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-border shadow-sm gap-0">
            <div className="navy-band relative px-6 py-6 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                />
                <p className="boarding-label text-white/55">
                    {initialData ? "EdiciÃ³n de adicional" : "Nuevo adicional"}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight">Datos del adicional</h2>
                <p className="mt-1 text-sm text-white/70">
                    Complete la informaciÃ³n del servicio adicional y guarde los datos en la API.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="nombre" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Type className="h-4 w-4 text-primary" />
                                Nombre del adicional
                            </label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Video del vuelo"
                                className={errors.nombre ? "border-destructive" : ""}
                                {...register("nombre")}
                            />

                            <FormError message={errors.nombre?.message} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Text className="h-4 w-4 text-primary" />
                                DescripciÃ³n
                            </label>
                            <Textarea
                                id="descripcion"
                                placeholder="Describa brevemente el adicional"
                                rows={4}
                                className={errors.descripcion ? "border-destructive" : ""}
                                {...register("descripcion")}
                            />

                            <FormError message={errors.descripcion?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="precio" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                Precio
                            </label>
                            <Input
                                id="precio"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Ej: 25000"
                                className={errors.precio ? "border-destructive" : ""}
                                {...register("precio")}
                            />
                            <FormError message={errors.precio?.message} />
                        </div>
                    </div>
                </CardContent>

                <div className="dash-sep flex flex-col-reverse gap-3 px-6 py-4 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        Limpiar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {submitText}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
AdicionalForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string
}