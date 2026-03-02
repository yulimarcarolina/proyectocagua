"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, Shield } from "lucide-react"
import { useGuards } from "@/hooks/use-guards"
import NewGuardForm from "./new-guard-form"
import Swal from "sweetalert2"
import { useAuth } from "@/hooks/use-auth"

export default function GuardsModule() {
    const [isCreating, setIsCreating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { guards, removeGuard } = useGuards()
    const { user } = useAuth()
    const canManage = user?.rol === "DIRECTOR" || user?.rol === "COORDINADOR"

    const filteredGuards = guards.filter(
        (guard) =>
            guard.officialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guard.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "¿Eliminar asignación?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                removeGuard(id)
                Swal.fire("Eliminado", "La asignación ha sido eliminada", "success")
            }
        })
    }

    if (isCreating) {
        return <NewGuardForm onBack={() => setIsCreating(false)} />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Guardias</h2>
                    <p className="text-muted-foreground">Asignación de turnos y servicios</p>
                </div>
                {canManage && (
                    <Button onClick={() => setIsCreating(true)} className="gap-2">
                        <Shield className="h-4 w-4" />
                        Nueva Asignación
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cronograma de Guardias</CardTitle>
                    <CardDescription>Turnos activos y programados</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por funcionario o ubicación..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="py-3 px-4 text-left font-medium">Funcionario</th>
                                    <th className="py-3 px-4 text-left font-medium">Fecha</th>
                                    <th className="py-3 px-4 text-left font-medium">Turno</th>
                                    <th className="py-3 px-4 text-left font-medium">Ubicación</th>
                                    <th className="py-3 px-4 text-left font-medium">Estatus</th>
                                    <th className="py-3 px-4 text-right font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGuards.length > 0 ? (
                                    filteredGuards.map((guard) => (
                                        <tr key={guard.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="py-3 px-4 font-medium">{guard.officialName}</td>
                                            <td className="py-3 px-4">{guard.date}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 ${guard.shift === 'Nocturno' ? 'text-indigo-600' : 'text-orange-600'}`}>
                                                    <Calendar className="h-3 w-3" />
                                                    {guard.shift}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{guard.location}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${guard.status === "En Curso"
                                                        ? "bg-green-100 text-green-800"
                                                        : guard.status === "Pendiente"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {guard.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {canManage && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDelete(guard.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            No hay guardias asignadas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
