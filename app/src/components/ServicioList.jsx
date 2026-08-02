import { ServicioCard } from "./ServicioCard";
import PropTypes from "prop-types";

export function ServicioList({ servicios }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => (
                <ServicioCard key={servicio.id} servicio={servicio} />
            ))}
        </div>
    );
}

ServicioList.propTypes = {
    servicios: PropTypes.array.isRequired,
};
