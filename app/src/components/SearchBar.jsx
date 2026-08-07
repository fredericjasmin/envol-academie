import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange }) {
    return (
        <div className="group relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
                placeholder="Buscar..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 border-border bg-card pl-10 pr-4 shadow-sm transition-all group-focus-within:border-ring group-focus-within:ring-3 group-focus-within:ring-ring/20 hover:border-primary/50"
            />
        </div>
    );
}

SearchBar.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
