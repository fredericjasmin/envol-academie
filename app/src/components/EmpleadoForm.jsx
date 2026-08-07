import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, BookOpen, GraduationCap, Hash, Text, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { empleadoSchema } from "../schemas/empleadoSchema";
import { FormError } from "./FormError";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Card,
    CardContent,
} from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function EmpleadoForm({
    onSubmit,
    usuarios,
    especialidades,
    servicios,
    initialData = null,
    submitText = "Registrar empleado",
}) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(empleadoSchema),
        defaultValues: {
            usuarioId: initialData?.usuarioId ? String(initialData.usuarioId) : "",
            especialidadId: initialData?.especialidadId ? String(initialData.especialidadId) : "",
            codigoEmpleado: initialData?.codigoEmpleado || "",
            descripcion: initialData?.descripcion || "",
            servicioIds: initialData?.servicios?.length
                ? initialData.servicios.map((servicio) => String(servicio.id))
                : [],
        },
    });

    const especialidadId = watch("especialidadId");
    const servicioIds = watch("servicioIds");

    const serviciosFiltrados = especialidadId
        ? servicios.filter((servicio) => String(servicio.especialidadId) === especialidadId)
        : [];

    function toggleServicio(servicioId) {
        const actual = Array.isArray(servicioIds) ? servicioIds : [];
        const seleccion = actual.includes(servicioId)
            ? actual.filter((id) => id !== servicioId)
            : [...actual, servicioId];
        setValue("servicioIds", seleccion, { shouldValidate: true });
    }

    function handleValidSubmit(formData) {
        onSubmit({
            ...formData,
            descripcion: formData.descripcion?.trim() ? formData.descripcion.trim() : null,
            servicioIds: (formData.servicioIds || []).map(Number),
        });
    }

    return (
        <Card className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-border shadow-sm gap-0">
            <div className="navy-band relative px-6 py-6 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                />
                <p className="boarding-label text-white/55">
                    {initialData ? "EdiciÃ³n de instructor" : "Nuevo instructor"}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight">Datos del empleado</h2>
                <p className="mt-1 text-sm text-white/70">
                    Complete la informaciÃ³n del instructor y guarde los datos en la API.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="usuarioId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4 text-primary" />
                                Usuario
                            </label>
                            <Controller
                                name="usuarioId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.usuarioId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un usuario" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {usuarios.map((usuario) => (
                                                <SelectItem key={usuario.id} value={String(usuario.id)}>
                                                    {usuario.nombre} {usuario.primerApellido} ({usuario.correo})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.usuarioId?.message} />
                        </div>

                        <div>
                            <label htmlFor="especialidadId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Especialidad
                            </label>
                            <Controller
                                name="especialidadId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setValue("servicioIds", [], { shouldValidate: true });
                                        }}
                                    >
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
                            <label htmlFor="codigoEmpleado" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Hash className="h-4 w-4 text-primary" />
                                CÃ³digo de empleado
                            </label>
                            <Input
                                id="codigoEmpleado"
                                placeholder="Ej: EMP-001"
                                className={errors.codigoEmpleado ? "border-destructive" : ""}
                                {...register("codigoEmpleado")}
                            />
                            <FormError message={errors.codigoEmpleado?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Text className="h-4 w-4 text-primary" />
                                DescripciÃ³n
                            </label>
                            <Textarea
                                id="descripcion"
                                placeholder="Breve descripciÃ³n del instructor (opcional)"
                                rows={4}
                                className={errors.descripcion ? "border-destructive" : ""}
                                {...register("descripcion")}
                            />
                            <FormError message={errors.descripcion?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Cursos que puede impartir
                            </label>
                            {!especialidadId ? (
                                <p className="text-sm text-muted-foreground">
                                    Seleccione primero una especialidad para ver sus cursos.
                                </p>
                            ) : serviciosFiltrados.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    La especialidad seleccionada no tiene cursos registrados.
                                </p>
                            ) : (
                                <div className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
                                    {serviciosFiltrados.map((servicio) => {
                                        const seleccionado = servicioIds.includes(String(servicio.id));
                                        return (
                                            <label
                                                key={servicio.id}
                                                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                                                    seleccionado
                                                        ? "border-primary/60 bg-primary/5"
                                                        : "hover:bg-accent/50"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4"
                                                    checked={seleccionado}
                                                    onChange={() => toggleServicio(String(servicio.id))}
                                                />
                                                <span className="flex items-center gap-2">
                                                    <BadgeCheck className="h-4 w-4 text-primary/70" />
                                                    {servicio.nombre}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                            <FormError message={errors.servicioIds?.message} />
                        </div>
                    </div>
                </CardContent>

                <div className="dash-sep flex flex-col-reverse gap-3 px-6 py-4 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => reset()}>
                        Limpiar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {submitText}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

EmpleadoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    usuarios: PropTypes.array.isRequired,
    especialidades: PropTypes.array.isRequired,
    servicios: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};
