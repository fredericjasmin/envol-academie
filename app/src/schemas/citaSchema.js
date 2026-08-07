import { z } from "zod";

const horaPattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const fechaPattern = /^\d{4}-\d{2}-\d{2}$/;

export const citaSchema = z.object({
    clienteId: z.coerce.number()
        .int("Debe seleccionar un cliente.")
        .min(1, "Debe seleccionar un cliente."),
    empleadoId: z.coerce.number()
        .int("Debe seleccionar un empleado.")
        .min(1, "Debe seleccionar un empleado."),
    servicioId: z.coerce.number()
        .int("Debe seleccionar un curso.")
        .min(1, "Debe seleccionar un curso."),
    estadoCitaId: z.coerce.number()
        .int("Debe seleccionar un estado.")
        .min(1, "Debe seleccionar un estado."),
    fecha: z.string()
        .regex(fechaPattern, "La fecha debe tener formato YYYY-MM-DD."),
    horaInicio: z.string()
        .regex(horaPattern, "La hora de inicio debe tener formato HH:mm."),
    horaFin: z.string()
        .regex(horaPattern, "La hora de fin debe tener formato HH:mm."),
    duracionMinutos: z.coerce.number()
        .int("La duración debe ser un número entero.")
        .positive("La duración debe ser mayor a cero.")
        .max(1440, "La duración no puede superar 1440 minutos."),
    precioServicio: z.coerce.number()
        .positive("El precio del curso debe ser mayor a cero."),
    costoAdicionales: z.coerce.number()
        .nonnegative("El costo de adicionales debe ser mayor o igual a cero."),
    costoTotal: z.coerce.number()
        .positive("El costo total debe ser mayor a cero."),
    observaciones: z.union([
        z.string().trim()
            .min(3, "Las observaciones deben contener al menos 3 caracteres.")
            .max(500, "Las observaciones no pueden superar 500 caracteres."),
        z.literal(""),
    ]).optional(),
    adicionalIds: z.array(z.coerce.number().int().min(1)),
}).refine((data) => data.horaInicio < data.horaFin, {
    path: ["horaFin"],
    message: "La hora de fin debe ser mayor que la hora de inicio.",
}).refine((data) => data.fecha >= fechaDeHoy(), {
    path: ["fecha"],
    message: "La fecha de la cita no puede ser anterior a hoy.",
});

function fechaDeHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}
