"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useVisits } from "@/hooks/use-visits"
import { useCases } from "@/hooks/use-cases"

interface NewVisitFormProps {
    onBack: () => void
    onSave?: (visitData: any) => void
    initialData?: any
}

export default function NewVisitForm({ onBack, onSave, initialData }: NewVisitFormProps) {
    const { addVisit, updateVisit } = useVisits()
    const { cases } = useCases()

    // Extract detainees from cases
    const detainees = cases.map(c => {
        const detaineeData = c.fullData?.detenido
        return {
            id: c.id,
            name: detaineeData ? `${detaineeData.nombre} ${detaineeData.apellido}` : c.partes.split(" vs ")[1] || "Desconocido",
            cedula: detaineeData?.numero_pasaporte || "S/D"
        }
    })

    const [formData, setFormData] = useState({
        visitorName: "",
        visitorId: "",
        detaineeId: "",
        reason: "Visita Familiar",
        date: new Date().toISOString().split('T')[0],
        timeIn: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: "En Curso"
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                visitorName: initialData.visitorName || "",
                visitorId: initialData.visitorId || "",
                detaineeId: initialData.detaineeId || "",
                reason: initialData.reason || "Visita Familiar",
                date: initialData.date || new Date().toISOString().split('T')[0],
                timeIn: initialData.timeIn || "",
                status: initialData.status || "En Curso"
            })
        }
    }, [initialData])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.visitorName || !formData.visitorId || !formData.detaineeId) {
            alert("Por favor complete los campos obligatorios (*)")
            return
        }

        const selectedDetainee = detainees.find(d => String(d.id) === formData.detaineeId)

        const visitData = {
            id: initialData ? initialData.id : Date.now().toString(),
            ...formData,
            detaineeName: selectedDetainee ? selectedDetainee.name : "Desconocido",
            status: formData.status as "En Curso" | "Finalizada"
        }

        if (initialData) {
            updateVisit(initialData.id, visitData)
        } else {
            addVisit(visitData)
        }

        if (onSave) {
            onSave(visitData)
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
                    <h1 className="text-3xl font-bold">{initialData ? "Editar Visita" : "Registrar Nueva Visita"}</h1>
                    <p className="text-muted-foreground">Control de acceso de visitantes</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos de la Visita</CardTitle>
                    <CardDescription>Información del visitante y el detenido</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre del Visitante *</label>
                                <Input
                                    value={formData.visitorName}
                                    onChange={(e) => handleChange("visitorName", e.target.value)}
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cédula del Visitante *</label>
                                <Input
                                    value={formData.visitorId}
                                    onChange={(e) => handleChange("visitorId", e.target.value)}
                                    placeholder="V-xx.xxx.xxx"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Detenido a Visitar *</label>
                                <Select value={formData.detaineeId} onValueChange={(val) => handleChange("detaineeId", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione detenido" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {detainees.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name} ({d.cedula})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Motivo de Visita</label>
                                <Select value={formData.reason} onValueChange={(val) => handleChange("reason", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione motivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Visita Familiar">Visita Familiar</SelectItem>
                                        <SelectItem value="Abogado">Abogado</SelectItem>
                                        <SelectItem value="Conyugal">Conyugal</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange("date", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hora de Entrada</label>
                                <Input
                                    type="time"
                                    value={formData.timeIn}
                                    onChange={(e) => handleChange("timeIn", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="gap-2">
                                <Save className="h-4 w-4" />
                                Registrar Entrada
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
