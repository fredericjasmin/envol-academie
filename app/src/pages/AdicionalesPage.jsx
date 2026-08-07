import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { AdicionalList } from "../components/AdicionalList";
import { EmptyState } from "../components/EmptyState";
import { getAdicionales } from "../services/adicionalService";

export function AdicionalesPage() {
    const [adicionales, setAdicionales] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAdicionales() {
            try {
                setLoading(true);
                const data = await getAdicionales();
                setAdicionales(data.data);
            } catch (error) {
                console.error("Error al cargar adicionales", error);
                setError("Error al cargar los servicios adicionales");
            } finally {
                setLoading(false);
            }
        }
        fetchAdicionales();
    }, []);

    const filteredAdicionales = adicionales.filter((adicional) =>
        adicional.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="space-y-8">
            <PageHeader
                code="ENVOL · COMPLEMENTOS"
                title="Servicios adicionales"
                description="Complementos opcionales que puedes sumar a tu clase de vuelo."
            />
            <div className="px-1">
                <SearchBar value={search} onChange={setSearch} />
            </div>

            {loading ? (
                <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-56 animate-pulse rounded-2xl border border-border bg-card"
                        />
                    ))}
                </div>
            ) : error ? (
                <EmptyState
                    title="No se pudieron cargar los adicionales"
                    description={error}
                />
            ) : filteredAdicionales.length === 0 ? (
                <EmptyState
                    title="Sin resultados"
                    description="No hay servicios adicionales que coincidan con tu búsqueda."
                />
            ) : (
                <AdicionalList adicionales={filteredAdicionales} />
            )}
        </section>
    );
}
