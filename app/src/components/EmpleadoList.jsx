import { EmpleadoCard } from "./EmpleadoCard";
import PropTypes from "prop-types";

export function EmpleadoList({ empleados }) {
    return (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {empleados.map((empleado) => (
                <EmpleadoCard key={empleado.id} empleado={empleado} />
            ))}
        </div>
    );
}

EmpleadoList.propTypes = {
    empleados: PropTypes.array.isRequired,
};
