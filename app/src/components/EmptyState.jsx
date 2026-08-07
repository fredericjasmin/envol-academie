import { Plane } from "lucide-react";
import PropTypes from "prop-types";

export function EmptyState({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Plane className="size-6 rotate-45" />
            </span>
            <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            {description && (
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
};
