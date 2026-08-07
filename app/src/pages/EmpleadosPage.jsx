import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { EmpleadoList } from "@/components/EmpleadoList";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/auth/useAuth";
import { getEmpleados } from "../services/empleadoService";

export function EmpleadosPage() {
    const { hasRole } = useAuth();
    const [empleados, setEmpleados] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchEmpleados() {
            try {
                setLoading(true);
                const data = await getEmpleados();
                setEmpleados(data.data);
            } catch (error) {
                console.error("Error al cargar empleados", error);
                setError("Error al cargar los empleados");
            } finally {
                setLoading(false);
            }
        }
        fetchEmpleados();
    }, []);

    const filteredEmpleados = empleados.filter((empleado) => {
        const fullName = `${empleado.usuario?.nombre ?? ""} ${empleado.usuario?.primerApellido ?? ""}`.toLowerCase();
        const codigo = empleado.codigoEmpleado.toLowerCase();
        const especialidad = empleado.especialidad?.nombre?.toLowerCase() || "";
        const termino = search.toLowerCase();
        return (
            fullName.includes(termino) ||
            codigo.includes(termino) ||
            especialidad.includes(termino)
        );
    });

    return (
        <section className="space-y-8">
            <PageHeader
                code="ENVOL · EQUIPO"
                title="Empleados"
                description="Instructores de vuelo certificados que forman parte de Envol Académie."
                actions={
                    hasRole(["Administrador"]) && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/empleados/crear">
                                <PlusCircle className="size-4" />
                                Nuevo empleado
                            </Link>
                        </Button>
                    )
                }
            />
            <div className="px-1">
                <SearchBar value={search} onChange={setSearch} />
            </div>

            {loading ? (
                <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-60 animate-pulse rounded-2xl border border-border bg-card"
                        />
                    ))}
                </div>
            ) : error ? (
                <EmptyState title="No se pudieron cargar los empleados" description={error} />
            ) : filteredEmpleados.length === 0 ? (
                <EmptyState
                    title="Sin resultados"
                    description="No hay empleados que coincidan con tu búsqueda."
                />
            ) : (
                <EmpleadoList empleados={filteredEmpleados} />
            )}
        </section>
    );
}
