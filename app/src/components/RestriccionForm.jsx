import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, Globe, User, Users } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { restriccionHorarioSchema } from "../schemas/restriccionHorarioSchema";
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
import { formatHora } from "../lib/format";

export function RestriccionForm({
    onSubmit,
    tiposRestriccion,
    empleados,
    initialData = null,
    submitText = "Registrar restricciÃ³n",
}) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(restriccionHorarioSchema),
        defaultValues: {
            tipoRestriccionId: initialData?.tipoRestriccionId
                ? String(initialData.tipoRestriccionId)
                : "",
            empleadoId: initialData?.empleadoId ? String(initialData.empleadoId) : "",
            fecha: initialData?.fecha ? String(initialData.fecha).slice(0, 10) : "",
            horaInicio: initialData?.horaInicio ? formatHora(initialData.horaInicio) : "",
            horaFin: initialData?.horaFin ? formatHora(initialData.horaFin) : "",
            todoElDia: initialData?.todoElDia ?? false,
            motivo: initialData?.motivo || "",
        },
    });

    const todoElDia = watch("todoElDia");

    function handleValidSubmit(formData) {
        onSubmit({
            ...formData,
            empleadoId: formData.empleadoId ? Number(formData.empleadoId) : null,
            horaInicio: formData.horaInicio || null,
            horaFin: formData.horaFin || null,
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
                    {initialData ? "EdiciÃ³n de restricciÃ³n" : "Nueva restricciÃ³n"}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight">Datos de la restricciÃ³n</h2>
                <p className="mt-1 text-sm text-white/70">
                    Registre cierres globales o bloqueos de horario de un instructor.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="tipoRestriccionId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                Tipo de restricciÃ³n
                            </label>
                            <Controller
                                name="tipoRestriccionId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.tipoRestriccionId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposRestriccion.map((tipo) => (
                                                <SelectItem key={tipo.id} value={String(tipo.id)}>
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.tipoRestriccionId?.message} />
                        </div>

                        <div>
                            <label htmlFor="empleadoId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4 text-primary" />
                                Instructor
                            </label>
                            <Controller
                                name="empleadoId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.empleadoId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Todo el establecimiento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">
                                                <span className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    Todo el establecimiento
                                                </span>
                                            </SelectItem>
                                            {empleados.map((empleado) => (
                                                <SelectItem key={empleado.id} value={String(empleado.id)}>
                                                    <span className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        {empleado.usuario?.nombre} {empleado.usuario?.primerApellido}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.empleadoId?.message} />
                        </div>

                        <div>
                            <label htmlFor="fecha" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="h-4 w-4 text-primary" />
                                Fecha
                            </label>
                            <Input
                                id="fecha"
                                type="date"
                                className={errors.fecha ? "border-destructive" : ""}
                                {...register("fecha")}
                            />
                            <FormError message={errors.fecha?.message} />
                        </div>

                        <div className="flex items-end pb-1">
                            <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-accent/50">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    {...register("todoElDia")}
                                />
                                <span className="font-medium">Aplica todo el dÃ­a</span>
                            </label>
                        </div>

                        <div>
                            <label htmlFor="horaInicio" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                Hora de inicio
                            </label>
                            <Input
                                id="horaInicio"
                                type="time"
                                disabled={todoElDia}
                                className={errors.horaInicio ? "border-destructive" : ""}
                                {...register("horaInicio")}
                            />
                            <FormError message={errors.horaInicio?.message} />
                        </div>

                        <div>
                            <label htmlFor="horaFin" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                Hora de fin
                            </label>
                            <Input
                                id="horaFin"
                                type="time"
                                disabled={todoElDia}
                                className={errors.horaFin ? "border-destructive" : ""}
                                {...register("horaFin")}
                            />
                            <FormError message={errors.horaFin?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="motivo" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4 text-primary" />
                                Motivo
                            </label>
                            <Textarea
                                id="motivo"
                                placeholder="Ej: CapacitaciÃ³n institucional."
                                rows={3}
                                className={errors.motivo ? "border-destructive" : ""}
                                {...register("motivo")}
                            />
                            <FormError message={errors.motivo?.message} />
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

RestriccionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    tiposRestriccion: PropTypes.array.isRequired,
    empleados: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};
