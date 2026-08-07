import { CitaCard } from "./CitaCard";
import PropTypes from "prop-types";

export function CitaList({ citas }) {
    return (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {citas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} />
            ))}
        </div>
    );
}

CitaList.propTypes = {
    citas: PropTypes.array.isRequired,
};
