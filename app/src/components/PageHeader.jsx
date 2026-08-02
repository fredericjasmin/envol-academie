import PropTypes from "prop-types";

export function PageHeader({ title, description }) {
    return (
        <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {title}
            </h1>
            {description && (
                <p className="text-muted-foreground text-lg max-w-[750px]">
                    {description}
                </p>
            )}
        </div>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
};