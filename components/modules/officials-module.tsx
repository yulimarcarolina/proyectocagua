"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, Edit, UserPlus } from "lucide-react"
import { useOfficials } from "@/hooks/use-officials"
import NewOfficialForm from "./new-official-form"
import Swal from "sweetalert2"
import { useAuth } from "@/hooks/use-auth"

export default function OfficialsModule() {
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const { officials, removeOfficial } = useOfficials()
    const { user } = useAuth()
    const canManage = user?.rol === "DIRECTOR" || user?.rol === "COORDINADOR"

    const filteredOfficials = officials.filter(
        (off) =>
            off.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            off.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
            off.cedula.includes(searchQuery) ||
            off.jerarquia.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (id: string) => {
        setEditingId(id)
        setIsCreating(true)
    }

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                removeOfficial(id)
                Swal.fire({
                    title: "¡Eliminado!",
                    text: "El funcionario ha sido eliminado.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                })
            }
        })
    }

    const handleBack = () => {
        setIsCreating(false)
        setEditingId(null)
    }

    if (isCreating) {
        const initialData = editingId ? officials.find(o => o.id === editingId) : undefined
        return <NewOfficialForm onBack={handleBack} initialData={initialData} />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Funcionarios</h2>
                    <p className="text-muted-foreground">Administración del personal policial</p>
                </div>
                {canManage && (
                    <Button onClick={() => setIsCreating(true)} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Nuevo Funcionario
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Funcionarios</CardTitle>
                    <CardDescription>Personal registrado en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, cédula o jerarquía..."
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
                                    <th className="py-3 px-4 text-left font-medium">Nombre Completo</th>
                                    <th className="py-3 px-4 text-left font-medium">Cédula</th>
                                    <th className="py-3 px-4 text-left font-medium">Jerarquía</th>
                                    <th className="py-3 px-4 text-left font-medium">Cargo</th>
                                    <th className="py-3 px-4 text-left font-medium">Teléfono</th>
                                    <th className="py-3 px-4 text-left font-medium">Estatus</th>
                                    <th className="py-3 px-4 text-right font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOfficials.length > 0 ? (
                                    filteredOfficials.map((official) => (
                                        <tr key={official.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="py-3 px-4 font-medium">
                                                {official.nombre} {official.apellido}
                                            </td>
                                            <td className="py-3 px-4">{official.cedula}</td>
                                            <td className="py-3 px-4">{official.jerarquia}</td>
                                            <td className="py-3 px-4">{official.cargo || "-"}</td>
                                            <td className="py-3 px-4">{official.telefono || "-"}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${official.estatus === "Activo"
                                                        ? "bg-green-100 text-green-800"
                                                        : official.estatus === "Inactivo"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {official.estatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {canManage && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(official.id)}
                                                                title="Editar"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive/90"
                                                                onClick={() => handleDelete(official.id)}
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                            No se encontraron funcionarios registrados
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
