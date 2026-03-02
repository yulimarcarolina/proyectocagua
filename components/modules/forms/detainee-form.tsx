"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DetaineeFormProps {
  caseNumber: string
}

export default function DetaineeForm({ caseNumber }: DetaineeFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    fechaAprehension: "",
  })

  const [auditData] = useState({
    fechaRegistro: new Date().toISOString().split("T")[0],
    usuarioRegistro: "FUNC-001",
    modificado: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registrar Detenido</h1>
        <p className="text-muted-foreground">Caso: {caseNumber}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Detenido</CardTitle>
          <CardDescription>Complete todos los campos obligatorios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campos Editables */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Juan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edad">Edad *</Label>
              <Input
                id="edad"
                name="edad"
                type="number"
                value={formData.edad}
                onChange={handleChange}
                placeholder="35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo *</Label>
              <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                <SelectTrigger id="sexo">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="fechaAprehension">Fecha de Aprehensión *</Label>
              <Input
                id="fechaAprehension"
                name="fechaAprehension"
                type="date"
                value={formData.fechaAprehension}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Auditoría Colapsable */}
          <Accordion type="single" collapsible className="border-t pt-4">
            <AccordionItem value="auditoria">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                📋 Auditoría / Trazabilidad
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Fecha de Registro</Label>
                    <Input value={auditData.fechaRegistro} disabled className="bg-muted text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">ID Usuario Registro</Label>
                    <Input value={auditData.usuarioRegistro} disabled className="bg-muted text-muted-foreground" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1">Guardar Detenido</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
