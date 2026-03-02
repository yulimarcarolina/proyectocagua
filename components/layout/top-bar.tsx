"use client"

import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

interface TopBarProps {
  user?: {
    usuario: string
    nombre: string
    rol: string
    jerarquia: string
  }
}

export default function TopBar({ user }: TopBarProps) {
  const { logout } = useAuth()

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold">Bienvenido al Sistema PST</h2>
        <p className="text-xs text-muted-foreground">Gestión de Expedientes Judiciales</p>
      </div>
      <div className="flex items-center gap-4">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user && (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.nombre}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.usuario}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  <div className="space-y-1">
                    <div>
                      Rol: <span className="font-semibold">{user.rol.replace(/_/g, " ")}</span>
                    </div>
                    <div>
                      Jerarquía: <span className="font-semibold">{user.jerarquia}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
