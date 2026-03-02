"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Edit, Trash2, FileDown } from "lucide-react"
import DetaineeForm from "./forms/detainee-form"
import Swal from "sweetalert2"
import { useCases } from "@/hooks/use-cases"
import { pdf } from "@react-pdf/renderer"
import { CasePDF } from "@/components/pdf-templates/case-pdf"
import { DetaineePDF } from "@/components/pdf-templates/detainee-pdf"
import { useRouter } from "next/navigation"

interface CaseDetailViewProps {
  caseId: number
  onBack: () => void
  userRole?: string
  onEdit?: (caseId: number) => void
}

export default function CaseDetailView({ caseId, onBack, userRole }: CaseDetailViewProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [showDetaineeForm, setShowDetaineeForm] = useState(false)
  const { cases, removeCase } = useCases()
  const router = useRouter()

  const caseData = cases.find(c => c.id === caseId)

  if (!caseData) {
    return (
      <div className="p-8 text-center">
        <p>Caso no encontrado</p>
        <Button onClick={onBack} className="mt-4">Volver</Button>
      </div>
    )
  }

  // Helper to safely access nested data or return defaults
  const fullData = caseData.fullData || {}
  const detenidos = fullData.detenido ? [fullData.detenido] : []
  const delitos = fullData.delitos || []
  const evidencias = fullData.evidencias || []
  const victimas = fullData.victima ? [fullData.victima] : []

  // Determine if user has admin privileges
  const isAdmin = userRole === "DIRECTOR"

  const handleEdit = () => {
    // Redirect to edit page - in future this could pass case data
    router.push(`/dashboard/cases/new?edit=${caseId}`)
  }

  const handleDelete = () => {
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
        removeCase(caseId)
        Swal.fire({
          title: "¡Eliminado!",
          text: "El caso ha sido eliminado.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Volver al listado inmediatamente después de eliminar
          onBack()
        })
      }
    })
  }

  const handleGeneratePDF = async () => {
    try {
      const blob = await pdf(<CasePDF caseData={caseData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Caso_${caseData.numero}_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      Swal.fire({
        title: "¡PDF Generado!",
        text: "El reporte ha sido descargado.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el PDF.",
        icon: "error"
      })
    }
  }

  const handleGenerateDetaineePDF = async () => {
    if (!fullData.detenido) {
      Swal.fire({
        title: "Sin Datos",
        text: "No hay información de detenido para generar el PDF.",
        icon: "warning"
      })
      return
    }

    try {
      const blob = await pdf(<DetaineePDF detainee={fullData.detenido} caseNumber={caseData.numero} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Detenido_${fullData.detenido.numero_pasaporte}_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      Swal.fire({
        title: "¡PDF Generado!",
        text: "La ficha del detenido ha sido descargada.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el PDF.",
        icon: "error"
      })
    }
  }

  if (showDetaineeForm) {
    return (
      <div>
        <Button variant="outline" onClick={() => setShowDetaineeForm(false)} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <DetaineeForm caseNumber={caseData.numero} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Button>

        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              PDF Caso
            </Button>
            <Button variant="outline" onClick={handleGenerateDetaineePDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              PDF Detenido
            </Button>
            <Button className="gap-2" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Expediente {caseData.numero}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Partes</h3>
              <p>{caseData.partes}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Situación</h3>
              <p>{caseData.estado}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Fecha Ingreso</h3>
              <p>{caseData.fecha}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delitos">Delitos</TabsTrigger>
          <TabsTrigger value="detenidos">Detenidos</TabsTrigger>
          <TabsTrigger value="victimas">Víctimas</TabsTrigger>
          <TabsTrigger value="evidencia">Evidencia</TabsTrigger>
          <TabsTrigger value="fiscalia">Fiscalía</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General del Caso</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Número de Expediente</p>
                <p className="font-mono font-semibold text-lg">{caseData.numero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Situación Jurídica</p>
                <p className="font-semibold">{caseData.estado}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Encargado</p>
                <p className="font-semibold">{caseData.encargado || "No asignado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="font-semibold">{caseData.descripcion}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detenidos" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowDetaineeForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Detenido
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Detenidos</CardTitle>
              <CardDescription>Personas detenidas relacionadas con el caso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detenidos.length > 0 ? detenidos.map((det: any, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <p className="font-semibold">
                      {det.nombre} {det.apellido}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                      <div>Edad: {det.edad}</div>
                      <div>Sexo: {det.sexo}</div>
                      <div>Cédula: {det.cedula || det.numero_pasaporte}</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground">No hay detenidos registrados</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delitos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {delitos.length > 0 ? delitos.map((delito: any) => (
                  <div key={delito.id} className="p-3 border rounded">
                    <p className="font-semibold">{delito.tipo_delito}</p>
                    <div className="text-sm text-muted-foreground mt-1">
                      Nivel: {delito.nivel_delito} {delito.peso_droga && `| Peso: ${delito.peso_droga}`}
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground">No hay delitos registrados</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="victimas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Víctimas</CardTitle>
            </CardHeader>
            <CardContent>
              {victimas.length > 0 && victimas[0].nombre ? (
                victimas.map((vic: any, idx: number) => (
                  <div key={idx} className="p-3 border rounded">
                    <p className="font-semibold">{vic.nombre} {vic.apellido}</p>
                    <p className="text-sm text-muted-foreground">Cédula: {vic.cedula}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Sin víctimas registradas</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evidencias.length > 0 ? evidencias.map((ev: any) => (
                  <div key={ev.id} className="p-3 border rounded">
                    <p className="font-semibold">{ev.tipo_evidencia}</p>
                    <p className="text-sm text-muted-foreground">Incautación: {ev.fecha_incautacion} en {ev.lugar_incautacion}</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground">No hay evidencias registradas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiscalia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Fiscalía</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sin información de fiscalía registrada</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
