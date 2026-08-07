import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { horarioAtencionSchema } from "../schemas/horarioAtencionSchema";
import { FormError } from "./FormError";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

export function HorarioAtencionForm({
    onSubmit,
    diasSemana,
    initialData = null,
    submitText = "Registrar horario",
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(horarioAtencionSchema),
        defaultValues: {
            diaSemanaId: initialData?.diaSemanaId ? String(initialData.diaSemanaId) : "",
            horaInicio: initialData?.horaInicio ? initialData.horaInicio.slice(11, 16) : "",
            horaFin: initialData?.horaFin ? initialData.horaFin.slice(11, 16) : "",
        },
    });

    function handleValidSubmit(formData) {
        onSubmit(formData);
    }

    return (
        <Card className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-border shadow-sm gap-0">
            <div className="navy-band relative px-6 py-6 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                />
                <p className="boarding-label text-white/55">Horario de atenciÃ³n</p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight">Datos del horario</h2>
                <p className="mt-1 text-sm text-white/70">
                    Configure el rango de atenciÃ³n del establecimiento y guarde los datos en la API.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6 p-6">
                    <div className="grid gap-5 md:grid-cols-3">
                        <div>
                            <label htmlFor="diaSemanaId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="h-4 w-4 text-primary" />
                                DÃ­a de la semana
                            </label>
                            <Controller
                                name="diaSemanaId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.diaSemanaId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un dÃ­a" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {diasSemana.map((dia) => (
                                                <SelectItem key={dia.id} value={String(dia.id)}>
                                                    {dia.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.diaSemanaId?.message} />
                        </div>

                        <div>
                            <label htmlFor="horaInicio" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                Hora de inicio
                            </label>
                            <Input
                                id="horaInicio"
                                type="time"
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
                                className={errors.horaFin ? "border-destructive" : ""}
                                {...register("horaFin")}
                            />
                            <FormError message={errors.horaFin?.message} />
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

HorarioAtencionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    diasSemana: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};
