"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useIncidents } from "@/hooks/use-incidents"
import Swal from "sweetalert2"
import { useAuth } from "@/hooks/use-auth"

interface IncidentModuleProps {
  onNewIncident?: () => void
}

export default function IncidentModule({ onNewIncident }: IncidentModuleProps) {
  const { incidents, removeIncident } = useIncidents()
  const { user } = useAuth()
  const canDelete = user?.rol === "DIRECTOR" || user?.rol === "COORDINADOR"

  const handleDelete = (id: number) => {
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
        removeIncident(id)
        Swal.fire({
          title: "¡Eliminado!",
          text: "El registro ha sido eliminado.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Módulo Operacional</h1>
          <p className="text-muted-foreground">Gestión de Novedades, Traslados y Guardias</p>
        </div>
        <Link href="/dashboard/incidents/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Novedad
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="novedades" className="w-full">
        <TabsList>
          <TabsTrigger value="novedades">Novedades</TabsTrigger>
          <TabsTrigger value="traslados">Traslados</TabsTrigger>
          <TabsTrigger value="guardias">Guardias</TabsTrigger>
        </TabsList>

        <TabsContent value="novedades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Novedades Operacionales</CardTitle>
              <CardDescription>Eventos y situaciones del centro preventivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Buscar novedades por fecha, tipo o funcionario..." className="flex-1" />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{incident.descripcion}</p>
                        <p className="text-sm text-muted-foreground mt-1">Reportado por: {incident.funcionario}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                          {incident.tipo}
                        </span>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(incident.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{incident.fecha}</p>
                  </div>
                ))}
                {incidents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay novedades registradas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traslados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Traslados</CardTitle>
              <CardDescription>Movimiento de detenidos y evidencia entre centros o juzgados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Buscar traslados..." className="flex-1" />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {incidents
                  .filter((i) => i.tipo === "Traslado")
                  .map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{incident.descripcion}</p>
                          <p className="text-sm text-muted-foreground mt-1">Responsable: {incident.funcionario}</p>
                          <p className="text-xs text-muted-foreground mt-2">{incident.fecha}</p>
                        </div>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(incident.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                {incidents.filter((i) => i.tipo === "Traslado").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay traslados registrados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Guardias y Servicios</CardTitle>
              <CardDescription>Asignación de servicios, coordinadores y funcionarios en guardia</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Módulo de guardias en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
