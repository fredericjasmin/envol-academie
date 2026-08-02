import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="space-y-4">
            <h1>404 - Página no encontrada</h1>
            <p>La ruta no existe</p>
            <Link to="/" className="text-primary font-medium">Volver al inicio</Link>
        </div>
    )
}