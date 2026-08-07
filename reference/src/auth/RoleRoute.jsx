import PropTypes from "prop-types"
import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"
export function RoleRoute({
    children,
    allowedRoles
}) {
    const {
        loading,
        hasRole
    } = useAuth()
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Verificando permisos...
            </p>
        )
    }
    if (!hasRole(allowedRoles)) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        )
    }
    return children
}
RoleRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired
}
