import { Plane } from "lucide-react";
import PropTypes from "prop-types";

export function PageHeader({ title, description, actions, code }) {
    return (
        <section className="full-bleed navy-band relative -mt-4 overflow-hidden text-white">
            <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:gap-12 md:py-16">
                <div className="max-w-2xl space-y-4">
                    {code && <p className="boarding-label text-[#9cc8ff]">{code}</p>}
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-lg leading-relaxed text-[#c6d8f0]">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-wrap items-center gap-3 md:shrink-0">
                        {actions}
                    </div>
                )}
            </div>
            <div aria-hidden="true" className="relative mx-auto max-w-6xl px-4 pb-7">
                <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 shrink-0 rotate-45 text-white/40" />
                    <div className="flex flex-1 items-center gap-2">
                        {Array.from({ length: 14 }).map((_, index) => (
                            <span
                                key={index}
                                className="h-1 flex-1 rounded-full bg-white/15"
                            />
                        ))}
                    </div>
                    <Plane className="h-4 w-4 shrink-0 rotate-45 text-white/40" />
                </div>
            </div>
        </section>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actions: PropTypes.node,
    code: PropTypes.string,
};
