"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, LogOut, Clock } from "lucide-react"
import { useVisits } from "@/hooks/use-visits"
import NewVisitForm from "./new-visit-form"
import Swal from "sweetalert2"
import { useAuth } from "@/hooks/use-auth"

export default function VisitsModule() {
    const [isCreating, setIsCreating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { visits, updateVisit } = useVisits()
    const { user } = useAuth()
    const canEdit = user?.rol === "DIRECTOR" || user?.rol === "COORDINADOR"

    const filteredVisits = visits.filter(
        (visit) =>
            visit.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            visit.detaineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            visit.visitorId.includes(searchQuery)
    )

    const handleCheckout = (id: string) => {
        const visit = visits.find(v => v.id === id)
        if (!visit) return

        Swal.fire({
            title: "¿Finalizar visita?",
            text: `Se registrará la salida para ${visit.visitorName}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, finalizar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                updateVisit(id, {
                    ...visit,
                    status: "Finalizada",
                    timeOut: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })
                })
                Swal.fire("¡Listo!", "Visita finalizada correctamente", "success")
            }
        })
    }

    if (isCreating) {
        return <NewVisitForm onBack={() => setIsCreating(false)} />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Visitas</h2>
                    <p className="text-muted-foreground">Control de entrada y salida de visitantes</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Registrar Visita
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registro de Visitas</CardTitle>
                    <CardDescription>Historial y visitas en curso</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por visitante, detenido o cédula..."
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
                                    <th className="py-3 px-4 text-left font-medium">Visitante</th>
                                    <th className="py-3 px-4 text-left font-medium">Cédula</th>
                                    <th className="py-3 px-4 text-left font-medium">Detenido a Visitar</th>
                                    <th className="py-3 px-4 text-left font-medium">Fecha</th>
                                    <th className="py-3 px-4 text-left font-medium">Entrada</th>
                                    <th className="py-3 px-4 text-left font-medium">Salida</th>
                                    <th className="py-3 px-4 text-left font-medium">Estatus</th>
                                    <th className="py-3 px-4 text-right font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVisits.length > 0 ? (
                                    filteredVisits.map((visit) => (
                                        <tr key={visit.id} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="py-3 px-4 font-medium">{visit.visitorName}</td>
                                            <td className="py-3 px-4">{visit.visitorId}</td>
                                            <td className="py-3 px-4">{visit.detaineeName}</td>
                                            <td className="py-3 px-4">{visit.date}</td>
                                            <td className="py-3 px-4">{visit.timeIn}</td>
                                            <td className="py-3 px-4">{visit.timeOut || "-"}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${visit.status === "En Curso"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {visit.status === "En Curso" && <Clock className="h-3 w-3" />}
                                                    {visit.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {visit.status === "En Curso" && canEdit && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleCheckout(visit.id)}
                                                    >
                                                        <LogOut className="h-3 w-3" />
                                                        Salida
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                            No hay visitas registradas
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
