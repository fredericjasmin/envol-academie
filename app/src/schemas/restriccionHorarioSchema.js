import { z } from "zod";

const horaPattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const fechaPattern = /^\d{4}-\d{2}-\d{2}$/;

export const restriccionHorarioSchema = z.object({
    tipoRestriccionId: z.coerce.number()
        .int("Debe seleccionar un tipo de restricción.")
        .min(1, "Debe seleccionar un tipo de restricción."),
    empleadoId: z.union([
        z.coerce.number().int().min(1),
        z.literal(""),
    ]),
    fecha: z.string()
        .regex(fechaPattern, "La fecha debe tener formato YYYY-MM-DD."),
    horaInicio: z.union([
        z.string().regex(horaPattern, "Formato HH:mm."),
        z.literal(""),
    ]),
    horaFin: z.union([
        z.string().regex(horaPattern, "Formato HH:mm."),
        z.literal(""),
    ]),
    todoElDia: z.boolean(),
    motivo: z.string()
        .trim()
        .min(5, "El motivo debe contener al menos 5 caracteres.")
        .max(255, "El motivo no puede superar 255 caracteres."),
}).superRefine((data, ctx) => {
    if (data.todoElDia) {
        if (data.horaInicio !== "") {
            ctx.addIssue({
                code: "custom",
                path: ["horaInicio"],
                message: "Debe quedar vacía cuando la restricción aplica todo el día.",
            });
        }
        if (data.horaFin !== "") {
            ctx.addIssue({
                code: "custom",
                path: ["horaFin"],
                message: "Debe quedar vacía cuando la restricción aplica todo el día.",
            });
        }
        return;
    }
    if (!data.horaInicio) {
        ctx.addIssue({
            code: "custom",
            path: ["horaInicio"],
            message: "La hora de inicio es obligatoria.",
        });
    }
    if (!data.horaFin) {
        ctx.addIssue({
            code: "custom",
            path: ["horaFin"],
            message: "La hora de fin es obligatoria.",
        });
    }
    if (data.horaInicio && data.horaFin && data.horaInicio >= data.horaFin) {
        ctx.addIssue({
            code: "custom",
            path: ["horaFin"],
            message: "La hora de fin debe ser mayor que la hora de inicio.",
        });
    }
});
