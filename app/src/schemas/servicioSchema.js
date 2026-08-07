import { z } from "zod"

export const servicioSchema = z.object({
    nombre: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(120, "El nombre no debe superar 120 caracteres."),
    descripcion: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(500, "La descripción no debe superar 500 caracteres."),
    precioBase: z.coerce.number()
        .positive("El precio debe ser mayor a 0."),
    duracionMinutos: z.coerce.number()
        .int("La duración debe ser un número entero.")
        .min(15, "La duración mínima es de 15 minutos.")
        .max(480, "La duración no puede superar 480 minutos."),
    especialidadId: z.coerce.number()
        .int("Debe seleccionar una especialidad.")
        .min(1, "Debe seleccionar una especialidad."),
    imagen: z.union([
        z.literal(""),
        z.string()
            .trim()
            .min(1, "Ingrese el nombre del archivo de imagen.")
            .max(255, "El nombre de la imagen no puede superar 255 caracteres.")
            .regex(
                /^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i,
                "El archivo debe ser JPG, PNG o WEBP."
            ),
    ]).optional(),
})