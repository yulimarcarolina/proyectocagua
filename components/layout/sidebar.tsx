"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, AlertCircle, Users, LogOut, BarChart3, CalendarDays, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  user?: {
    usuario: string
    nombre: string
    rol: string
    jerarquia: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    { id: "dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { id: "cases", href: "/dashboard/cases", icon: <FileText className="h-5 w-5" />, label: "Módulo Judicial" },
    { id: "incidents", href: "/dashboard/incidents", icon: <AlertCircle className="h-5 w-5" />, label: "Operacional" },
    { id: "visits", href: "/dashboard/visits", icon: <CalendarDays className="h-5 w-5" />, label: "Gestión de Visitas" }, // Added Visits link
    { id: "guards", href: "/dashboard/guards", icon: <Shield className="h-5 w-5" />, label: "Gestión de Guardias" },
    { id: "statistics", href: "/dashboard/statistics", icon: <BarChart3 className="h-5 w-5" />, label: "Estadísticas" },
    { id: "users", href: "/dashboard/users", icon: <Users className="h-5 w-5" />, label: "Usuarios" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true
    if (href !== "/dashboard" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
            PST
          </div>
          <div>
            <h1 className="font-bold text-lg">Sistema PST</h1>
            <p className="text-xs opacity-75">Expedientes Judiciales</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <Button
              variant={isActive(item.href) ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${isActive(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      {/* Footer - User Info and Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="p-3 bg-sidebar-accent/50 rounded-md text-xs">
            <div className="font-semibold text-sidebar-foreground">{user.nombre}</div>
            <div className="text-sidebar-foreground/70">{user.jerarquia}</div>
            <div className="text-sidebar-foreground/50 truncate">{user.usuario}</div>
          </div>
        )}
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  )
}
