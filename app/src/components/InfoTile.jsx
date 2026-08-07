import PropTypes from "prop-types";

export function InfoTile({ label, children }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="boarding-label text-muted-foreground">{label}</p>
            <div className="mt-1.5">{children}</div>
        </div>
    );
}

InfoTile.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
};
