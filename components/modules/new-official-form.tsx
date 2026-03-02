"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useOfficials } from "@/hooks/use-officials"

interface NewOfficialFormProps {
    onBack: () => void
    onSave?: (officialData: any) => void
    initialData?: any
}

export default function NewOfficialForm({ onBack, onSave, initialData }: NewOfficialFormProps) {
    const { addOfficial, updateOfficial } = useOfficials()
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        jerarquia: "",
        cargo: "",
        estatus: "Activo",
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || "",
                apellido: initialData.apellido || "",
                cedula: initialData.cedula || "",
                telefono: initialData.telefono || "",
                jerarquia: initialData.jerarquia || "",
                cargo: initialData.cargo || "",
                estatus: initialData.estatus || "Activo",
            })
        }
    }, [initialData])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()


        const officialData = {
            id: initialData ? initialData.id : Date.now().toString(),
            ...formData,
            estatus: formData.estatus as "Activo" | "Inactivo" | "Vacaciones" | "Reposo",
        }

        if (initialData) {
            updateOfficial(initialData.id, officialData)
        } else {
            addOfficial(officialData)
        }

        if (onSave) {
            onSave(officialData)
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
                    <h1 className="text-3xl font-bold">{initialData ? "Editar Funcionario" : "Registrar Nuevo Funcionario"}</h1>
                    <p className="text-muted-foreground">Gestión de personal policial</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del Funcionario</CardTitle>
                    <CardDescription>Información personal y profesional</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre *</label>
                                <Input
                                    value={formData.nombre}
                                    onChange={(e) => handleChange("nombre", e.target.value)}
                                    placeholder="Nombres"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apellido *</label>
                                <Input
                                    value={formData.apellido}
                                    onChange={(e) => handleChange("apellido", e.target.value)}
                                    placeholder="Apellidos"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cédula de Identidad *</label>
                                <Input
                                    value={formData.cedula}
                                    onChange={(e) => handleChange("cedula", e.target.value)}
                                    placeholder="V-12.345.678"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Teléfono</label>
                                <Input
                                    value={formData.telefono}
                                    onChange={(e) => handleChange("telefono", e.target.value)}
                                    placeholder="0412-1234567"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Jerarquía *</label>
                                <Select value={formData.jerarquia} onValueChange={(val) => handleChange("jerarquia", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione jerarquía" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Comisionado Jefe">Comisionado Jefe</SelectItem>
                                        <SelectItem value="Comisionado Agregado">Comisionado Agregado</SelectItem>
                                        <SelectItem value="Comisionado">Comisionado</SelectItem>
                                        <SelectItem value="Supervisor Jefe">Supervisor Jefe</SelectItem>
                                        <SelectItem value="Supervisor Agregado">Supervisor Agregado</SelectItem>
                                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                                        <SelectItem value="Oficial Jefe">Oficial Jefe</SelectItem>
                                        <SelectItem value="Oficial Agregado">Oficial Agregado</SelectItem>
                                        <SelectItem value="Oficial">Oficial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cargo</label>
                                <Input
                                    value={formData.cargo}
                                    onChange={(e) => handleChange("cargo", e.target.value)}
                                    placeholder="Ej. Jefe de Patrulla"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estatus</label>
                                <Select value={formData.estatus} onValueChange={(val) => handleChange("estatus", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione estatus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                                        <SelectItem value="Reposo">Reposo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="gap-2">
                                <Save className="h-4 w-4" />
                                Guardar Funcionario
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
