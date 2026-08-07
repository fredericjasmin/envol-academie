import { Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { PageHeader } from "../components/PageHeader";
import { InfoTile } from "../components/InfoTile";
import { Badge } from "../components/ui/badge";

export function PerfilPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <PageHeader
                title="Mi perfil"
                description="No hay una sesión activa."
            />
        );
    }

    const fullName = [
        user.nombre,
        user.primerApellido,
        user.segundoApellido,
    ].filter(Boolean).join(" ");

    const iniciales = [user.nombre?.[0], user.primerApellido?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase();

    return (
        <section className="space-y-8">
            <PageHeader
                code="Pasajero"
                title="Mi perfil"
                description="Información de su cuenta en Envol Académie."
            />

            <div className="mx-auto grid max-w-3xl gap-6 px-1 sm:grid-cols-[auto_1fr]">
                <div className="flex items-start">
                    <span className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-extrabold tracking-tight text-primary">
                        {iniciales || <User className="size-8" />}
                    </span>
                </div>

                <div className="space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{fullName}</h2>
                        <div className="mt-2">
                            <Badge variant="secondary">{user.rol?.nombre ?? "Sin rol asignado"}</Badge>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoTile label="Correo">
                            <p className="flex items-center gap-2 font-semibold">
                                <Mail className="size-5 text-primary/70" />
                                <span className="break-all">{user.correo}</span>
                            </p>
                        </InfoTile>
                        <InfoTile label="Teléfono">
                            <p className="flex items-center gap-2 font-semibold">
                                <Phone className="size-5 text-primary/70" />
                                {user.telefono || "Sin teléfono registrado"}
                            </p>
                        </InfoTile>
                        <InfoTile label="Rol">
                            <p className="flex items-center gap-2 font-semibold">
                                <ShieldCheck className="size-5 text-primary/70" />
                                {user.rol?.nombre ?? "Sin rol asignado"}
                            </p>
                        </InfoTile>
                        <InfoTile label="Identificador">
                            <p className="font-semibold">#{user.id}</p>
                        </InfoTile>
                    </div>
                </div>
            </div>
        </section>
    );
}
