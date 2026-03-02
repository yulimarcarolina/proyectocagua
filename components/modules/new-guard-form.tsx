"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useGuards } from "@/hooks/use-guards"
import { useOfficials } from "@/hooks/use-officials"

interface NewGuardFormProps {
    onBack: () => void
    onSave?: (guardData: any) => void
    initialData?: any
}

export default function NewGuardForm({ onBack, onSave, initialData }: NewGuardFormProps) {
    const { addGuard, updateGuard } = useGuards()
    const { officials } = useOfficials()

    // Filter only active officials
    const activeOfficials = officials.filter(o => o.estatus === "Activo")

    const [formData, setFormData] = useState({
        officialId: "",
        date: new Date().toISOString().split('T')[0],
        shift: "Diurno",
        location: "Recepción Principal",
        status: "Pendiente",
        notes: ""
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                officialId: initialData.officialId || "",
                date: initialData.date || new Date().toISOString().split('T')[0],
                shift: initialData.shift || "Diurno",
                location: initialData.location || "Recepción Principal",
                status: initialData.status || "Pendiente",
                notes: initialData.notes || ""
            })
        }
    }, [initialData])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.officialId || !formData.date || !formData.location) {
            alert("Por favor complete los campos obligatorios (*)")
            return
        }

        const selectedOfficial = officials.find(o => o.id === formData.officialId)

        const guardData = {
            id: initialData ? initialData.id : Date.now().toString(),
            ...formData,
            officialName: selectedOfficial ? `${selectedOfficial.nombre} ${selectedOfficial.apellido}` : "Desconocido",
            shift: formData.shift as "Diurno" | "Nocturno",
            status: formData.status as "Pendiente" | "En Curso" | "Completada"
        }

        if (initialData) {
            updateGuard(initialData.id, guardData)
        } else {
            addGuard(guardData)
        }

        if (onSave) {
            onSave(guardData)
        } else {
            onBack()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{initialData ? "Editar Guardia" : "Asignar Nueva Guardia"}</h1>
                    <p className="text-muted-foreground">Gestión de turnos y servicios</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos de la Guardia</CardTitle>
                    <CardDescription>Asignación de turno y ubicación</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Funcionario *</label>
                                <Select value={formData.officialId} onValueChange={(val) => handleChange("officialId", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione funcionario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeOfficials.map((o) => (
                                            <SelectItem key={o.id} value={o.id}>
                                                {o.nombre} {o.apellido} ({o.jerarquia})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha *</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange("date", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Turno *</label>
                                <Select value={formData.shift} onValueChange={(val) => handleChange("shift", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione turno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Diurno">Diurno</SelectItem>
                                        <SelectItem value="Nocturno">Nocturno</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ubicación / Servicio *</label>
                                <Select value={formData.location} onValueChange={(val) => handleChange("location", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione ubicación" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Recepción Principal">Recepción Principal</SelectItem>
                                        <SelectItem value="Calabozos">Calabozos</SelectItem>
                                        <SelectItem value="Patrullaje">Patrullaje</SelectItem>
                                        <SelectItem value="Punto de Control">Punto de Control</SelectItem>
                                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estatus</label>
                                <Select value={formData.status} onValueChange={(val) => handleChange("status", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione estatus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                                        <SelectItem value="En Curso">En Curso</SelectItem>
                                        <SelectItem value="Completada">Completada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notas Adicionales</label>
                            <Input
                                value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                placeholder="Observaciones sobre el servicio..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="gap-2">
                                <Save className="h-4 w-4" />
                                Guardar Asignación
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
