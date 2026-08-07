import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, { error: "El nombre completo es obligatorio." })
        .min(3, { error: "El nombre completo debe tener al menos 3 caracteres." })
        .max(100, { error: "El nombre completo no debe superar 100 caracteres." }),
    email: z
        .string()
        .trim()
        .min(1, { error: "El correo electrónico es obligatorio." })
        .max(150, { error: "El correo electrónico no debe superar 150 caracteres." })
        .pipe(
            z.email({ error: "Debe ingresar un correo electrónico válido." })
        ),
    password: z
        .string()
        .min(1, { error: "La contraseña es obligatoria." })
        .min(6, { error: "La contraseña debe tener al menos 6 caracteres." })
        .max(50, { error: "La contraseña no debe superar 50 caracteres." }),
    confirmPassword: z
        .string()
        .min(1, { error: "Debe confirmar la contraseña." }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});