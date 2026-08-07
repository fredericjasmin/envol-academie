import { z } from "zod";

export const empleadoSchema = z.object({
    usuarioId: z.coerce.number()
        .int("Debe seleccionar un usuario.")
        .min(1, "Debe seleccionar un usuario."),
    especialidadId: z.coerce.number()
        .int("Debe seleccionar una especialidad.")
        .min(1, "Debe seleccionar una especialidad."),
    codigoEmpleado: z.string()
        .trim()
        .min(3, "El código debe contener al menos 3 caracteres.")
        .max(30, "El código no puede superar 30 caracteres.")
        .regex(/^[A-Za-z0-9_-]+$/, "Solo letras, números, guiones y guiones bajos."),
    descripcion: z.union([
        z.string().trim()
            .min(3, "La descripción debe contener al menos 3 caracteres.")
            .max(500, "La descripción no puede superar 500 caracteres."),
        z.literal(""),
    ]).optional(),
    servicioIds: z.array(z.coerce.number().int().min(1))
        .min(1, "Debe asignar al menos un curso.")
        .max(20, "No puede asignar más de 20 cursos."),
});
