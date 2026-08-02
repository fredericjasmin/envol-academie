import { useState } from "react";
import { useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { ServicioList } from "../components/ServicioList";
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
                console.log(data);
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
    if (loading) return <p className="text-center text-gray-500">Cargando cursos...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <section>
            <PageHeader
                title="Cursos"
                description="Clases de vuelo disponibles en Envol Académie"
            />
            <SearchBar value={search} onChange={setSearch} />
            {filteredServicios.length === 0 ? (
                <p className="text-center text-gray-400">No hay resultados</p>
            ) : (
                <ServicioList servicios={filteredServicios} />
            )}
        </section>
    );
}