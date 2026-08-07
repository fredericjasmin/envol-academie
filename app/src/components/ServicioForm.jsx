import PropTypes from "prop-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, DollarSign, Hash, Image as ImageIcon, Text, Type } from "lucide-react"

import { servicioSchema } from "../schemas/servicioSchema"
import { FormError } from "./FormError"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
    Card,
    CardContent
} from "./ui/card"
import { Controller, useForm, useWatch } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select"

export function ServicioForm({
    onSubmit,
    especialidades,
    initialData = null,
    submitText = "Registrar curso"
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(servicioSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precioBase: initialData?.precioBase || "",
            duracionMinutos: initialData?.duracionMinutos || "",
            especialidadId: initialData?.especialidadId
                ? String(initialData.especialidadId)
                : "",
            imagen: initialData?.imagen || ""
        }
    })

    const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
    const FALLBACK_IMAGE = `${IMAGE_URL}/image-not-found.jpg`
    const imagenActual = useWatch({ control, name: "imagen" }) || ""

    function handleValidSubmit(formData) {
        onSubmit({
            ...formData,
            imagen: formData.imagen?.trim() ? formData.imagen.trim() : null
        })
    }

    return (
        <Card className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-border shadow-sm gap-0">
            <div className="navy-band relative px-6 py-6 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                />
                <p className="boarding-label text-white/55">
                    {initialData ? "EdiciÃ³n de curso" : "Nuevo curso"}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight">Datos del curso</h2>
                <p className="mt-1 text-sm text-white/70">
                    Complete la informaciÃ³n principal del curso y guarde los datos en la API.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="nombre" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Type className="h-4 w-4 text-primary" />
                                Nombre del curso
                            </label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Vuelo de familiarizaciÃ³n"
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
                                placeholder="Describa brevemente el curso"
                                rows={4}
                                className={errors.descripcion ? "border-destructive" : ""}
                                {...register("descripcion")}
                            />

                            <FormError message={errors.descripcion?.message} />
                        </div>

                        <div>
                            <label htmlFor="especialidadId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Hash className="h-4 w-4 text-primary" />
                                Especialidad
                            </label>
                            <Controller
                                name="especialidadId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.especialidadId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione una especialidad" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {especialidades.map((especialidad) => (
                                                <SelectItem key={especialidad.id} value={String(especialidad.id)}>
                                                    {especialidad.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.especialidadId?.message} />
                        </div>

                        <div>
                            <label htmlFor="precioBase" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                Precio base
                            </label>
                            <Input
                                id="precioBase"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="Ej: 125000"
                                className={errors.precioBase ? "border-destructive" : ""}
                                {...register("precioBase")}
                            />
                            <FormError message={errors.precioBase?.message} />
                        </div>

                        <div>
                            <label htmlFor="duracionMinutos" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                DuraciÃ³n (minutos)
                            </label>
                            <Input
                                id="duracionMinutos"
                                type="number"
                                min="15"
                                max="480"
                                placeholder="Ej: 60"
                                className={errors.duracionMinutos ? "border-destructive" : ""}
                                {...register("duracionMinutos")}
                            />
                            <FormError message={errors.duracionMinutos?.message} />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="imagen" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <ImageIcon className="h-4 w-4 text-primary" />
                                Imagen representativa
                            </label>
                            <Input
                                id="imagen"
                                placeholder="Ej: servicio-1783628774262.png"
                                className={errors.imagen ? "border-destructive" : ""}
                                {...register("imagen")}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Ingrese el nombre del archivo de imagen (JPG, PNG o WEBP) disponible en la
                                carpeta de imÃ¡genes del API.
                            </p>
                            <FormError message={errors.imagen?.message} />
                        </div>

                        <div>
                            <label className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <ImageIcon className="h-4 w-4 text-primary" />
                                Vista previa
                            </label>
                            <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted">
                                <img
                                    src={imagenActual ? `${IMAGE_URL}/${imagenActual}` : FALLBACK_IMAGE}
                                    alt="Vista previa del curso"
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.src = FALLBACK_IMAGE
                                    }}
                                />
                            </div>
                            {imagenActual && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {`${IMAGE_URL}/${imagenActual}`}
                                </p>
                            )}
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
ServicioForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    especialidades: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string
}