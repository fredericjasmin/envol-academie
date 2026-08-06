import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import PropTypes from "prop-types"

import { AuthContext } from "./AuthContext"
import { getProfile, loginUser } from "@/services/authService"

const TOKEN_KEY = "token"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    const clearSession = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        let isMounted = true

        async function restoreSession() {
            const storedToken = localStorage.getItem(TOKEN_KEY)
            if (!storedToken) {
                if (isMounted) {
                    setLoading(false)
                }
                return
            }
            try {
                const response = await getProfile(storedToken)
                const profile = response.data ?? response
                if (!isMounted) {
                    return
                }
                setToken(storedToken)
                setUser(profile)
            } catch (error) {
                console.error(
                    "No se pudo restaurar la sesión:",
                    error
                )
                if (isMounted) {
                    clearSession()
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        restoreSession()
        return () => {
            isMounted = false
        }
    }, [clearSession])

    const login = useCallback(async (credentials) => {
        const loginResponse = await loginUser(credentials)
        const newToken = loginResponse.data?.token
        if (!newToken) {
            throw new Error(
                "El API no devolvió un token válido."
            )
        }
        const profileResponse = await getProfile(newToken)
        const profile =
            profileResponse.data ?? profileResponse
        localStorage.setItem(TOKEN_KEY, newToken)
        setToken(newToken)
        setUser(profile)
        return profile
    }, [])

    const logout = useCallback(() => {
        clearSession()
    }, [clearSession])

    const isAuthenticated = Boolean(token && user)

    const hasRole = useCallback(
        (allowedRoles) => {
            if (!isAuthenticated) {
                return false
            }
            if (!Array.isArray(allowedRoles)) {
                return false
            }
            if (allowedRoles.length === 0) {
                return false
            }
            const userRole = user?.rol?.nombre
            if (!userRole) {
                return false
            }
            return allowedRoles.includes(userRole)
        },
        [isAuthenticated, user]
    )

    const contextValue = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
            hasRole
        }),
        [
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
            hasRole
        ]
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}