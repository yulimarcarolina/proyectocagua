"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
    usuario: string
    nombre: string
    rol: string
    jerarquia: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem("pst_user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Error parsing user from localStorage", e)
                localStorage.removeItem("pst_user")
            }
        }
        setLoading(false)
    }, [])

    const login = (userData: User) => {
        localStorage.setItem("pst_user", JSON.stringify(userData))
        setUser(userData)
        router.push("/dashboard")
    }

    const logout = () => {
        localStorage.removeItem("pst_user")
        setUser(null)
        router.push("/")
    }

    return { user, loading, login, logout }
}
