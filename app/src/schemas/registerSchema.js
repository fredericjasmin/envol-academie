import { z } from "zod";

export const registerSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, { error: "El nombre es obligatorio." })
        .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
        .max(100, { error: "El nombre no debe superar 100 caracteres." }),
    primerApellido: z
        .string()
        .trim()
        .min(1, { error: "El primer apellido es obligatorio." })
        .min(2, { error: "El primer apellido debe tener al menos 2 caracteres." })
        .max(100, { error: "El primer apellido no debe superar 100 caracteres." }),
    segundoApellido: z
        .string()
        .trim()
        .optional(),
    correo: z
        .string()
        .trim()
        .min(1, { error: "El correo electrónico es obligatorio." })
        .max(150, { error: "El correo electrónico no debe superar 150 caracteres." })
        .pipe(
            z.email({ error: "Debe ingresar un correo electrónico válido." })
        ),
    telefono: z
        .string()
        .trim()
        .optional(),
    password: z
        .string()
        .min(1, { error: "La contraseña es obligatoria." })
        .min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
        .max(100, { error: "La contraseña no debe superar 100 caracteres." })
        .regex(/[A-Z]/, { error: "La contraseña debe contener al menos una letra mayúscula." })
        .regex(/[a-z]/, { error: "La contraseña debe contener al menos una letra minúscula." })
        .regex(/[0-9]/, { error: "La contraseña debe contener al menos un número." }),
    confirmPassword: z
        .string()
        .min(1, { error: "Debe confirmar la contraseña." })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});