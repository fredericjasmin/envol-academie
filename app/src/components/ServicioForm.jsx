import PropTypes from "prop-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, DollarSign, Hash, Text, Type } from "lucide-react"

import { servicioSchema } from "../schemas/servicioSchema"
import { FormError } from "./FormError"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "./ui/card"
import { Controller, useForm } from "react-hook-form"
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
                : ""
        }
    })

    function handleValidSubmit(formData) {
        onSubmit(formData)
    }

    return (
        <Card className="mx-auto max-w-4xl border-border/70 shadow-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Datos del curso</CardTitle>
                <CardDescription>
                    Complete la información principal del curso y guarde los datos en la API.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="nombre" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Type className="h-4 w-4 text-primary" />
                                Nombre del curso
                            </label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Vuelo de familiarización"
                                className={errors.nombre ? "border-destructive" : ""}
                                {...register("nombre")}
                            />

                            <FormError message={errors.nombre?.message} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Text className="h-4 w-4 text-primary" />
                                Descripción
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
                            <label htmlFor="especialidadId" className="mb-2 flex items-center gap-2 text-sm font-medium">
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
                            <label htmlFor="precioBase" className="mb-2 flex items-center gap-2 text-sm font-medium">
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
                            <label htmlFor="duracionMinutos" className="mb-2 flex items-center gap-2 text-sm font-medium">
                                <Clock className="h-4 w-4 text-primary" />
                                Duración (minutos)
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
                </CardContent>

                <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
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
                </CardFooter>
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