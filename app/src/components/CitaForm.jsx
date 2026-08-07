import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    BadgeCheck,
    CalendarDays,
    Clock,
    DollarSign,
    FileText,
    Search,
    User,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { citaSchema } from "../schemas/citaSchema";
import { FormError } from "./FormError";
import { Alert } from "./ui/alert";
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
import { getEmpleadosActivos } from "../services/empleadoService";
import { verificarDisponibilidad } from "../services/citaService";
import { formatHora, formatMoney, sumarMinutos } from "../lib/format";
import { AgendaEmpleadoPanel } from "./AgendaEmpleadoPanel";

export function CitaForm({
    onSubmit,
    clientes,
    servicios,
    adicionales,
    estados,
    creadoPorUsuarioId,
    initialData = null,
    submitText = "Registrar cita",
}) {
    const isEditing = Boolean(initialData);

    const {
        register,
        handleSubmit,
        control,
        watch,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(citaSchema),
        defaultValues: {
            clienteId: initialData?.clienteId ? String(initialData.clienteId) : "",
            empleadoId: initialData?.empleadoId ? String(initialData.empleadoId) : "",
            servicioId: initialData?.servicioId ? String(initialData.servicioId) : "",
            estadoCitaId: initialData?.estadoCitaId ? String(initialData.estadoCitaId) : "",
            fecha: initialData?.fecha ? String(initialData.fecha).slice(0, 10) : "",
            horaInicio: initialData?.horaInicio ? formatHora(initialData.horaInicio) : "",
            horaFin: initialData?.horaFin ? formatHora(initialData.horaFin) : "",
            duracionMinutos: initialData?.duracionMinutos || "",
            precioServicio: initialData?.precioServicio || "",
            costoAdicionales: initialData?.costoAdicionales || "0",
            costoTotal: initialData?.costoTotal || "",
            observaciones: initialData?.observaciones || "",
            adicionalIds: initialData?.adicionales?.length
                ? initialData.adicionales.map((adicional) => String(adicional.id))
                : [],
        },
    });

    const servicioId = watch("servicioId");
    const empleadoId = watch("empleadoId");
    const horaInicio = watch("horaInicio");
    const horaFin = watch("horaFin");
    const fecha = watch("fecha");
    const duracionMinutos = watch("duracionMinutos");
    const adicionalIds = watch("adicionalIds");
    const [empleados, setEmpleados] = useState([]);
    const [empleadosLoading, setEmpleadosLoading] = useState(false);
    const [disponibilidad, setDisponibilidad] = useState(null);
    const [disponibilidadLoading, setDisponibilidadLoading] = useState(false);
    const servicioInicialRef = useRef(initialData?.servicioId ? String(initialData.servicioId) : null);

    useEffect(() => {
        if (!servicioId) {
            setEmpleados([]);
            return;
        }
        let activo = true;
        async function cargarEmpleados() {
            setEmpleadosLoading(true);
            try {
                const data = await getEmpleadosActivos(servicioId);
                if (!activo) return;
                setEmpleados(data.data);
                const cambioDeServicio =
                    servicioInicialRef.current !== null &&
                    servicioInicialRef.current !== servicioId;
                if (cambioDeServicio) {
                    setValue("empleadoId", "", { shouldValidate: true });
                }
            } catch {
                if (activo) setEmpleados([]);
            } finally {
                if (activo) setEmpleadosLoading(false);
            }
        }
        cargarEmpleados();
        return () => {
            activo = false;
        };
    }, [servicioId, setValue]);

    useEffect(() => {
        if (!servicioId) return;
        const servicio = servicios.find((item) => String(item.id) === servicioId);
        if (!servicio) return;
        const cambioDeServicio =
            servicioInicialRef.current !== null &&
            servicioInicialRef.current !== servicioId;
        if (isEditing && !cambioDeServicio) return;
        setValue("duracionMinutos", servicio.duracionMinutos, { shouldValidate: true });
        setValue("precioServicio", servicio.precioBase, { shouldValidate: true });
    }, [servicioId, servicios, setValue, isEditing]);

    useEffect(() => {
        if (!horaInicio || !duracionMinutos) return;
        const horaFin = sumarMinutos(horaInicio, duracionMinutos);
        if (horaFin) {
            setValue("horaFin", horaFin, { shouldValidate: true });
        }
    }, [horaInicio, duracionMinutos, setValue]);

    useEffect(() => {
        const ids = adicionalIds ?? [];
        const costoAdicionales = ids.reduce((total, id) => {
            const adicional = adicionales.find((item) => String(item.id) === id);
            return adicional ? total + Number(adicional.precio) : total;
        }, 0);
        const precioServicio = Number(getValues("precioServicio")) || 0;
        const costoTotal = precioServicio + costoAdicionales;
        setValue("costoAdicionales", String(costoAdicionales), { shouldValidate: true });
        setValue("costoTotal", String(costoTotal), { shouldValidate: true });
    }, [adicionalIds, adicionales, getValues, setValue]);

    function toggleAdicional(id) {
        const actual = [...(getValues("adicionalIds") || [])];
        const seleccion = actual.includes(id)
            ? actual.filter((item) => item !== id)
            : [...actual, id];
        setValue("adicionalIds", seleccion, { shouldValidate: true });
    }

    async function handleVerificarDisponibilidad() {
        const { empleadoId, servicioId: sId, fecha, horaInicio: hIni, horaFin: hFin } = getValues();
        if (!empleadoId || !sId || !fecha || !hIni || !hFin) {
            setDisponibilidad({ disponible: false, motivo: "Complete los datos para verificar la disponibilidad." });
            return;
        }
        setDisponibilidadLoading(true);
        setDisponibilidad(null);
        try {
            const data = await verificarDisponibilidad({
                empleadoId: Number(empleadoId),
                servicioId: Number(sId),
                fecha,
                horaInicio: hIni,
                horaFin: hFin,
                citaIdExcluir: initialData?.id ?? null,
            });
            setDisponibilidad(data.data);
        } catch (error) {
            setDisponibilidad({ disponible: false, motivo: error.message });
        } finally {
            setDisponibilidadLoading(false);
        }
    }

    function handleValidSubmit(formData) {
        const payload = {
            clienteId: Number(formData.clienteId),
            empleadoId: Number(formData.empleadoId),
            servicioId: Number(formData.servicioId),
            fecha: formData.fecha,
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin,
            duracionMinutos: Number(formData.duracionMinutos),
            precioServicio: Number(formData.precioServicio),
            costoAdicionales: Number(formData.costoAdicionales),
            costoTotal: Number(formData.costoTotal),
            observaciones: formData.observaciones?.trim() ? formData.observaciones.trim() : null,
            adicionalIds: (formData.adicionalIds || []).map(Number),
        };
        if (!isEditing) {
            payload.estadoCitaId = Number(formData.estadoCitaId);
            payload.creadoPorUsuarioId = creadoPorUsuarioId;
        }
        onSubmit(payload);
    }

    const costoAdicionales = Number(getValues("costoAdicionales")) || 0;
    const precioServicio = Number(getValues("precioServicio")) || 0;

    return (
        <Card className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-border shadow-sm gap-0">
            <div className="navy-band relative px-6 py-6 text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px runway-stripes text-white/25"
                />
                <p className="boarding-label text-white/55">
                    {isEditing ? "EdiciÃ³n de cita" : "Nueva cita"}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight">Datos de la cita</h2>
                <p className="mt-1 text-sm text-white/70">
                    Seleccione el curso, el instructor, la fecha y los adicionales de la cita.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="servicioId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4 text-primary" />
                                Curso
                            </label>
                            <Controller
                                name="servicioId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.servicioId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un curso" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {servicios.map((servicio) => (
                                                <SelectItem key={servicio.id} value={String(servicio.id)}>
                                                    {servicio.nombre} - {formatMoney(servicio.precioBase)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.servicioId?.message} />
                        </div>

                        <div>
                            <label htmlFor="empleadoId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4 text-primary" />
                                Instructor
                            </label>
                            <Controller
                                name="empleadoId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setDisponibilidad(null);
                                        }}
                                    >
                                        <SelectTrigger className={errors.empleadoId ? "border-destructive" : ""}>
                                            <SelectValue
                                                placeholder={
                                                    empleadosLoading
                                                        ? "Cargando instructores..."
                                                        : "Seleccione un instructor"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {empleados.length === 0 && !empleadosLoading && (
                                                <SelectItem value="" disabled>
                                                    Seleccione primero un curso
                                                </SelectItem>
                                            )}
                                            {empleados.map((empleado) => (
                                                <SelectItem key={empleado.id} value={String(empleado.id)}>
                                                    {empleado.usuario?.nombre} {empleado.usuario?.primerApellido} ({empleado.codigoEmpleado})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.empleadoId?.message} />
                        </div>

                        <div>
                            <label htmlFor="clienteId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4 text-primary" />
                                Cliente
                            </label>
                            <Controller
                                name="clienteId"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.clienteId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione un cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={String(cliente.id)}>
                                                    {cliente.nombre} {cliente.primerApellido}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormError message={errors.clienteId?.message} />
                        </div>

                        {!isEditing && (
                            <div>
                                <label htmlFor="estadoCitaId" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                    <BadgeCheck className="h-4 w-4 text-primary" />
                                    Estado inicial
                                </label>
                                <Controller
                                    name="estadoCitaId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className={errors.estadoCitaId ? "border-destructive" : ""}>
                                                <SelectValue placeholder="Seleccione un estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {estados.map((estado) => (
                                                    <SelectItem key={estado.id} value={String(estado.id)}>
                                                        {estado.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormError message={errors.estadoCitaId?.message} />
                            </div>
                        )}

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

                        <div>
                            <label htmlFor="duracionMinutos" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                DuraciÃ³n (minutos)
                            </label>
                            <Input
                                id="duracionMinutos"
                                type="number"
                                min="1"
                                max="1440"
                                className={errors.duracionMinutos ? "border-destructive" : ""}
                                {...register("duracionMinutos")}
                            />
                            <FormError message={errors.duracionMinutos?.message} />
                        </div>

                        <div>
                            <label htmlFor="precioServicio" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                Precio del curso
                            </label>
                            <Input
                                id="precioServicio"
                                type="number"
                                step="0.01"
                                min="0"
                                className={errors.precioServicio ? "border-destructive" : ""}
                                {...register("precioServicio")}
                            />
                            <FormError message={errors.precioServicio?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <BadgeCheck className="h-4 w-4 text-primary" />
                                Servicios adicionales
                            </label>
                            {adicionales.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No hay servicios adicionales activos.
                                </p>
                            ) : (
                                <div className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
                                    {adicionales.map((adicional) => {
                                        const seleccionado = adicionalIds.includes(String(adicional.id));
                                        return (
                                            <label
                                                key={adicional.id}
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
                                                    onChange={() => toggleAdicional(String(adicional.id))}
                                                />
                                                <span className="flex-1">{adicional.nombre}</span>
                                                <span className="font-medium text-primary">
                                                    {formatMoney(adicional.precio)}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                            <FormError message={errors.adicionalIds?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="observaciones" className="boarding-label mb-2 flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4 text-primary" />
                                Observaciones
                            </label>
                            <Textarea
                                id="observaciones"
                                placeholder="Comentarios adicionales (opcional)"
                                rows={3}
                                className={errors.observaciones ? "border-destructive" : ""}
                                {...register("observaciones")}
                            />
                            <FormError message={errors.observaciones?.message} />
                        </div>

                        <div className="md:col-span-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleVerificarDisponibilidad}
                                disabled={disponibilidadLoading}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                {disponibilidadLoading ? "Verificando..." : "Verificar disponibilidad"}
                            </Button>
                            {disponibilidad && (
                                <div className="mt-3">
                                    {disponibilidad.disponible ? (
                                        <Alert>Horario disponible.</Alert>
                                    ) : (
                                        <Alert variant="destructive">{disponibilidad.motivo}</Alert>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <AgendaEmpleadoPanel
                                empleadoId={empleadoId}
                                fecha={fecha}
                                destacarInicio={horaInicio}
                                destacarFin={horaFin}
                            />
                        </div>
                    </div>
                </CardContent>

                <div className="dash-sep flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4 text-primary/70" />
                            Curso: {formatMoney(precioServicio)}
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4 text-primary/70" />
                            Adicionales: {formatMoney(costoAdicionales)}
                        </p>
                        <p className="flex items-center gap-2 text-lg font-bold text-primary">
                            <DollarSign className="h-5 w-5" />
                            Total: {formatMoney(costoAdicionales + precioServicio)}
                        </p>
                    </div>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <Button type="button" variant="outline" onClick={() => reset()}>
                            Limpiar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {submitText}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
}

CitaForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    clientes: PropTypes.array.isRequired,
    servicios: PropTypes.array.isRequired,
    adicionales: PropTypes.array.isRequired,
    estados: PropTypes.array,
    creadoPorUsuarioId: PropTypes.number,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};
