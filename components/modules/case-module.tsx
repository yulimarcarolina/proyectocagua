
"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import CaseDetailView from "./case-detail-view"
import { useAuth } from "@/hooks/use-auth"
import { useCases } from "@/hooks/use-cases"

interface CaseModuleProps {
  onNewCase?: () => void
}

export default function CaseModule({ onNewCase }: CaseModuleProps) {
  const [selectedCase, setSelectedCase] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const { cases } = useCases()

  const filteredCases = cases.filter(
    (c) =>
      c.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.estado.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedCase) {
    return (
      <CaseDetailView
        caseId={selectedCase}
        onBack={() => setSelectedCase(null)}
        userRole={user?.rol}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Módulo Judicial</h2>
          <p className="text-muted-foreground">Gestión de expedientes y casos judiciales</p>
        </div>
        {user?.rol === "DIRECTOR" && (
          <Link href="/dashboard/cases/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Caso
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expedientes Registrados</CardTitle>
          <CardDescription>
            {filteredCases.length} {filteredCases.length === 1 ? "caso" : "casos"} encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, partes o estado..."
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
                  <th className="py-3 px-4 text-left font-medium">Expediente</th>
                  <th className="py-3 px-4 text-left font-medium">Partes</th>
                  <th className="py-3 px-4 text-left font-medium">Estado</th>
                  <th className="py-3 px-4 text-left font-medium">Fecha</th>
                  <th className="py-3 px-4 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length > 0 ? (
                  filteredCases.map((caso) => (
                    <tr key={caso.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{caso.numero}</td>
                      <td className="py-3 px-4">{caso.partes}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${caso.estado === "Presentación"
                            ? "bg-yellow-100 text-yellow-800"
                            : caso.estado === "Fase de Juicio"
                              ? "bg-blue-100 text-blue-800"
                              : caso.estado === "Sentenciado"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {caso.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4">{caso.fecha}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCase(caso.id)}
                        >
                          Ver Detalles
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      {searchQuery ? "No se encontraron casos con ese criterio" : "No hay casos registrados"}
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
