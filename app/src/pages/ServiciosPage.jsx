import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { ServicioList } from "../components/ServicioList";
import { EmptyState } from "../components/EmptyState";
import { getServicios } from "../services/servicioService";

export function ServiciosPage() {
    const [servicios, setServicios] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchServicios() {
            try {
                setLoading(true);
                const data = await getServicios();
                setServicios(data.data);
            } catch (error) {
                console.error("Error al cargar cursos", error);
                setError("Error al cargar los cursos");
            } finally {
                setLoading(false);
            }
        }
        fetchServicios();
    }, []);

    const filteredServicios = servicios.filter((servicio) =>
        servicio.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="space-y-8">
            <PageHeader
                code="ENVOL · CATÁLOGO"
                title="Cursos"
                description="Clases prácticas y teóricas con instructores certificados. Elige el curso y despega."
            />
            <div className="px-1">
                <SearchBar value={search} onChange={setSearch} />
            </div>

            {loading ? (
                <LoadingGrid count={6} />
            ) : error ? (
                <EmptyState title="No se pudieron cargar los cursos" description={error} />
            ) : filteredServicios.length === 0 ? (
                <EmptyState
                    title="Sin resultados"
                    description="No hay cursos que coincidan con tu búsqueda."
                />
            ) : (
                <ServicioList servicios={filteredServicios} />
            )}
        </section>
    );
}

function LoadingGrid({ count }) {
    return (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="h-80 animate-pulse rounded-2xl border border-border bg-card"
                />
            ))}
        </div>
    );
}

LoadingGrid.propTypes = {
    count: PropTypes.number,
};
