import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { CitaList } from "@/components/CitaList";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/auth/useAuth";
import { getCitas, getCitasPorCliente, getCitasPorEmpleado } from "../services/citaService";

export function CitasPage() {
    const { user, hasRole } = useAuth();
    const [citas, setCitas] = useState([]);
    const [search, setSearch] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const esAdmin = hasRole(["Administrador"]);
    const esEmpleado = hasRole(["Empleado"]);
    const esCliente = hasRole(["Cliente"]);
    const puedeCrear = esAdmin || esEmpleado;

    useEffect(() => {
        async function fetchCitas() {
            try {
                setLoading(true);
                let data;
                if (esAdmin) {
                    data = await getCitas();
                } else if (esEmpleado) {
                    data = await getCitasPorEmpleado(user.empleado?.id);
                } else if (esCliente) {
                    data = await getCitasPorCliente(user.id);
                } else {
                    data = { data: [] };
                }
                setCitas(data.data);
            } catch (error) {
                console.error("Error al cargar citas", error);
                setError("Error al cargar las citas");
            } finally {
                setLoading(false);
            }
        }
        fetchCitas();
    }, [esAdmin, esEmpleado, esCliente, user.id, user.empleado?.id]);

    const estadosUnicos = [...new Set(citas.map((cita) => cita.estadoCita?.nombre).filter(Boolean))];

    const filteredCitas = citas.filter((cita) => {
        const termino = search.toLowerCase();
        const cliente = `${cita.cliente?.nombre ?? ""} ${cita.cliente?.primerApellido ?? ""}`.toLowerCase();
        const servicio = cita.servicio?.nombre?.toLowerCase() || "";
        const empleado = `${cita.empleado?.usuario?.nombre ?? ""} ${cita.empleado?.usuario?.primerApellido ?? ""}`.toLowerCase();
        const coincideTexto =
            cliente.includes(termino) || servicio.includes(termino) || empleado.includes(termino);
        const coincideEstado =
            estadoFiltro === "todos" || cita.estadoCita?.nombre === estadoFiltro;
        return coincideTexto && coincideEstado;
    });

    return (
        <section className="space-y-8">
            <PageHeader
                code="ENVOL · VUELOS"
                title="Citas"
                description={
                    esCliente
                        ? "Tus citas registradas en Envol Académie."
                        : "Citas registradas en Envol Académie."
                }
                actions={
                    puedeCrear && (
                        <Button asChild className="border-transparent bg-white text-foreground hover:bg-white/85">
                            <Link to="/citas/crear">
                                <PlusCircle className="size-4" />
                                Nueva cita
                            </Link>
                        </Button>
                    )
                }
            />

            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <SearchBar value={search} onChange={setSearch} />
                <select
                    value={estadoFiltro}
                    onChange={(event) => setEstadoFiltro(event.target.value)}
                    className="h-11 rounded-xl border border-border bg-card px-3 pr-8 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
                >
                    <option value="todos">Todos los estados</option>
                    {estadosUnicos.map((nombre) => (
                        <option key={nombre} value={nombre}>
                            {nombre}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-64 animate-pulse rounded-2xl border border-border bg-card"
                        />
                    ))}
                </div>
            ) : error ? (
                <EmptyState title="No se pudieron cargar las citas" description={error} />
            ) : filteredCitas.length === 0 ? (
                <EmptyState
                    title="Sin citas"
                    description={
                        esCliente
                            ? "Aún no tienes citas registradas. Explora los cursos y reserva tu primer vuelo."
                            : "No hay citas que coincidan con los filtros."
                    }
                />
            ) : (
                <CitaList citas={filteredCitas} />
            )}
        </section>
    );
}
