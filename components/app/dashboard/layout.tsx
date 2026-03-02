"use client"

import Sidebar from "@/components/layout/sidebar"
import TopBar from "@/components/layout/top-bar"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Cargando...</div>
    }

    if (!user) {
        return null // Will redirect
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar user={user} />
                <main className="flex-1 overflow-auto">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    )
}
