import { z } from "zod";

const horaPattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const horarioAtencionSchema = z.object({
    diaSemanaId: z.coerce.number()
        .int("Debe seleccionar un día.")
        .min(1, "Debe seleccionar un día."),
    horaInicio: z.string()
        .regex(horaPattern, "La hora de inicio debe tener formato HH:mm."),
    horaFin: z.string()
        .regex(horaPattern, "La hora de fin debe tener formato HH:mm."),
}).refine((data) => data.horaInicio < data.horaFin, {
    path: ["horaFin"],
    message: "La hora de fin debe ser mayor que la hora de inicio.",
});
