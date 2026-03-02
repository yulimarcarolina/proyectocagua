"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useRouter } from "next/navigation"
import { useIncidents } from "@/hooks/use-incidents"

interface NewIncidentFormProps {
  onBack: () => void
  onSave?: (incidentData: any) => void
}

export default function NewIncidentForm({ onBack, onSave }: NewIncidentFormProps) {
  const router = useRouter()
  const { addIncident } = useIncidents()
  const [formData, setFormData] = useState({
    // NOVEDAD campos
    tipoNovedad: "",
    fechaNovedad: "",
    descripcion: "",
    ubicacion: "",
    funcionarioReporta: "",

    // TRASLADO campos (si aplica)
    tipoTraslado: "",
    detenidoTraslado: "",
    evidenciaTraslado: "",
    funcionarioResponsable: "",
    unidad: "",
    diaTraslado: "",
    horaTraslado: "",
    observacionesTraslado: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    if (!formData.tipoNovedad || !formData.fechaNovedad || !formData.ubicacion || !formData.funcionarioReporta) {
      alert("Por favor completa todos los campos requeridos (marcados con *)")
      return
    }

    const newIncident = {
      id: Date.now(),
      tipo: formData.tipoTraslado ? "Traslado" : (formData.tipoNovedad === "visitante" ? "Visita" : (formData.tipoNovedad === "medico" ? "Médico" : "Novedad")),
      descripcion: formData.descripcion,
      fecha: formData.fechaNovedad,
      funcionario: formData.funcionarioReporta,
      fullData: formData
    }

    addIncident(newIncident)
    console.log("Nueva novedad creada:", newIncident)

    if (onSave) {
      onSave(formData)
    } else {
      router.push("/dashboard/incidents")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Registrar Nueva Novedad</h1>
          <p className="text-muted-foreground">Evento operacional del centro</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="novedad" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="novedad">Novedad Operacional</TabsTrigger>
            <TabsTrigger value="traslado">Traslado (Opcional)</TabsTrigger>
          </TabsList>

          {/* TAB 1: NOVEDAD OPERACIONAL */}
          <TabsContent value="novedad" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Novedad</CardTitle>
                <CardDescription>Datos principales del evento operacional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Novedad *</label>
                    <Select value={formData.tipoNovedad} onValueChange={(val) => handleChange("tipoNovedad", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de novedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visitante">Visita de Familiar</SelectItem>
                        <SelectItem value="medico">Atención Médica</SelectItem>
                        <SelectItem value="disciplina">Incidente Disciplinario</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="fugaIntento">Intento de Fuga</SelectItem>
                        <SelectItem value="pelea">Pelea/Altercado</SelectItem>
                        <SelectItem value="autoflagelo">Auto-flagelación</SelectItem>
                        <SelectItem value="contrabando">Contrabando Detectado</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Funcionario que Reporta *</label>
                    <Input
                      placeholder="Nombre del funcionario"
                      value={formData.funcionarioReporta}
                      onChange={(e) => handleChange("funcionarioReporta", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Fecha de la Novedad *</label>
                    <Input
                      type="date"
                      value={formData.fechaNovedad}
                      onChange={(e) => handleChange("fechaNovedad", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ubicación del Evento *</label>
                    <Input
                      placeholder="Patio, módulo, celda, etc."
                      value={formData.ubicacion}
                      onChange={(e) => handleChange("ubicacion", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción Detallada del Evento *</label>
                  <textarea
                    placeholder="Describe con detalle qué sucedió, quiénes estuvieron involucrados, causas y consecuencias"
                    value={formData.descripcion}
                    onChange={(e) => handleChange("descripcion", e.target.value)}
                    className="w-full p-3 border rounded-lg text-sm min-h-40 resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: TRASLADO (OPCIONAL) */}
          <TabsContent value="traslado" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Traslado</CardTitle>
                <CardDescription>Datos del movimiento de detenido o evidencia (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Esta sección es opcional. Complétala solo si hay traslado asociado a la novedad.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Traslado</label>
                    <Select value={formData.tipoTraslado} onValueChange={(val) => handleChange("tipoTraslado", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detenido">Traslado de Detenido</SelectItem>
                        <SelectItem value="evidencia">Traslado de Evidencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Funcionario Responsable del Traslado</label>
                    <Input
                      placeholder="Nombre del funcionario"
                      value={formData.funcionarioResponsable}
                      onChange={(e) => handleChange("funcionarioResponsable", e.target.value)}
                    />
                  </div>
                </div>

                {formData.tipoTraslado === "detenido" && (
                  <div>
                    <label className="text-sm font-medium">Identificación del Detenido</label>
                    <Input
                      placeholder="Nombre, número de expediente o ID"
                      value={formData.detenidoTraslado}
                      onChange={(e) => handleChange("detenidoTraslado", e.target.value)}
                    />
                  </div>
                )}

                {formData.tipoTraslado === "evidencia" && (
                  <div>
                    <label className="text-sm font-medium">Descripción de la Evidencia</label>
                    <Input
                      placeholder="Tipo y descripción de la evidencia"
                      value={formData.evidenciaTraslado}
                      onChange={(e) => handleChange("evidenciaTraslado", e.target.value)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Día del Traslado</label>
                    <Input
                      type="date"
                      value={formData.diaTraslado}
                      onChange={(e) => handleChange("diaTraslado", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hora del Traslado</label>
                    <Input
                      type="time"
                      value={formData.horaTraslado}
                      onChange={(e) => handleChange("horaTraslado", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Unidad de Transporte</label>
                  <Input
                    placeholder="Placa o identificación del vehículo"
                    value={formData.unidad}
                    onChange={(e) => handleChange("unidad", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Observaciones del Traslado</label>
                  <textarea
                    placeholder="Incidencias, comportamiento del detenido, condiciones de la evidencia, etc."
                    value={formData.observacionesTraslado}
                    onChange={(e) => handleChange("observacionesTraslado", e.target.value)}
                    className="w-full p-3 border rounded-lg text-sm min-h-32 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botones de Acción */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Registrar Novedad
          </Button>
        </div>
      </form>
    </div>
  )
}
