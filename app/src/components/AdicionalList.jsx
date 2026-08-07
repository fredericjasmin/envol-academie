import { AdicionalCard } from "./AdicionalCard";
import PropTypes from "prop-types";

export function AdicionalList({ adicionales }) {
    return (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adicionales.map((adicional) => (
                <AdicionalCard key={adicional.id} adicional={adicional} />
            ))}
        </div>
    );
}

AdicionalList.propTypes = {
    adicionales: PropTypes.array.isRequired,
};