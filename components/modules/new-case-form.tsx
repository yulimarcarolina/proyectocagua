"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Trash2, Plus, Upload, X, Camera } from "lucide-react"
import { useCases } from "@/hooks/use-cases"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface NewCaseFormProps {
  onBack?: () => void
  onSave?: (caseData: any) => void
  initialData?: any
}

interface RepresentanteLegal {
  id: string
  parentesco: string
  nombre: string
  apellido: string
  cedula_identidad: string
  edad: string
  telefono_contacto: string
  direccion: string
  profesion_oficio: string
  verificacion_siipol: boolean
}

interface PhotoDetainee {
  frontal: string | null
  lateral_izquierda: string | null
  lateral_derecha: string | null
  perfil: string | null
}

interface DelitoRegistro {
  id: string
  tipo_delito: string
  nivel_delito: string
  reincidente: boolean
  nombre_bandas: string
  peso_droga: string
}

interface EvidenciaRegistro {
  id: string
  tipo_evidencia: string
  fecha_incautacion: string
  hora_incautacion: string
  lugar_incautacion: string
  id_oficial_cargo: string
  descripcion_detallada: string
  estado_encontrado: string
  caracteristica: string
  archivos: string[]
}

export default function NewCaseForm({ onBack, onSave, initialData }: NewCaseFormProps) {
  // CASO_JUDICIAL
  const [caseData, setCaseData] = useState({
    numero_expediente: "",
    partes_involucradas: "",
    circuito_judicial: "",
    jurisdiccion_penal: "",
    tipo_proceso: "",
    situacion_juridica: "",
    fase_proceso: "",
    tiempo_fase_procesal: "",
    tipo_defensa: "",
    medida_coercion: "",
    fecha_coercion: "",
    posee_computos: false,
    fecha_oficio_computo: "",
    anio_computo: "",
    mes_computo: "",
    dias_computo: "",
  })

  // DETENIDO
  const [detainee, setDetainee] = useState({
    numero_pasaporte: "",
    indocumentado: false,
    tipo_documentacion: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    edad: "",
    pais_origen: "",
    nacionalidad: "",
    gentilicio: "",
    sexo: "",
    clasificacion_edad: "",
    raza: "",
    estado_civil: "",
    grado_instruccion: "",
    profesion_oficio: "",
    color_ojos: "",
    color_piel: "",
    color_cabello: "",
    estatura_cm: "",
    contextura: "",
    peso_kg: "",
    marcas_cicatrices_tatuajes: "",
    fecha_aprehension: "",
    direccion_aprehension: "",
    organismo_aprehensor: "",
    forma_aprehension: "",
    tiempo_aprehendido: "",
    tipo_discapacidad: "",
    patologia_enfermedad: "",
    tipo_enfermedad: "",
    medicamento: "",
    tratamiento: "",
    tiempo_gestacion: "",
    esta_lactando: false,
  })

  // DELITO - Registro actual siendo editado
  const [delitoActual, setDelitoActual] = useState({
    tipo_delito: "",
    nivel_delito: "",
    reincidente: false,
    nombre_bandas: "",
    peso_droga: "",
  })

  // Lista de delitos registrados
  const [delitosRegistrados, setDelitosRegistrados] = useState<DelitoRegistro[]>([])

  // EVIDENCIA - Registro actual siendo editado
  const [evidenciaActual, setEvidenciaActual] = useState({
    tipo_evidencia: "",
    fecha_incautacion: "",
    hora_incautacion: "",
    lugar_incautacion: "",
    id_oficial_cargo: "",
    descripcion_detallada: "",
    estado_encontrado: "",
    caracteristica: "",
  })

  // Archivos de evidencia actuales
  const [evidenciaArchivos, setEvidenciaArchivos] = useState<string[]>([])

  // Lista de evidencias registradas
  const [evidenciasRegistradas, setEvidenciasRegistradas] = useState<EvidenciaRegistro[]>([])

  // VÍCTIMA
  const [victima, setVictima] = useState({
    tipo_victima: "",
    nombre: "",
    apellido: "",
    cedula: "",
    edad: "",
    fecha_nacimiento: "",
  })

  // MENOR_EDAD
  const [minorInfo, setMinorInfo] = useState({
    nombre: "",
    apellido: "",
    causa: "",
    consejero_nombre: "",
    consejero_apellido: "",
    consejero_cedula_o_codigo: "",
    consejero_telefono: "",
    nota_observacion: "",
  })

  // REPRESENTANTE_LEGAL
  const [representantes, setRepresentantes] = useState<RepresentanteLegal[]>([])
  const [newRepresentante, setNewRepresentante] = useState<RepresentanteLegal>({
    id: Date.now().toString(),
    parentesco: "",
    nombre: "",
    apellido: "",
    cedula_identidad: "",
    edad: "",
    telefono_contacto: "",
    direccion: "",
    profesion_oficio: "",
    verificacion_siipol: false,
  })

  // Fotos del detenido
  const [photoDetainee, setPhotoDetainee] = useState<PhotoDetainee>({
    frontal: null,
    lateral_izquierda: null,
    lateral_derecha: null,
    perfil: null,
  })

  // Archivos de cicatrices/tatuajes
  const [marksFiles, setMarksFiles] = useState<string[]>([])

  const [isMinor, setIsMinor] = useState(false)
  const [activeTab, setActiveTab] = useState("caso") // State for active tab

  useEffect(() => {
    if (initialData) {
      if (initialData.caso_judicial) setCaseData(initialData.caso_judicial)
      if (initialData.detenido) {
        const { foto_detenido_url, ...detenidoData } = initialData.detenido
        setDetainee(detenidoData)
        if (foto_detenido_url) setPhotoDetainee(foto_detenido_url)

        // Check if minor
        const edad = Number.parseInt(detenidoData.edad) || 0
        if (edad < 14) setIsMinor(true)
      }
      if (initialData.delitos) setDelitosRegistrados(initialData.delitos)
      if (initialData.evidencias) setEvidenciasRegistradas(initialData.evidencias)
      if (initialData.victima) setVictima(initialData.victima)
      if (initialData.menor_edad) setMinorInfo(initialData.menor_edad)
      if (initialData.representantes_legales) setRepresentantes(initialData.representantes_legales)
      if (initialData.marcas_cicatrices_tatuajes_files) setMarksFiles(initialData.marcas_cicatrices_tatuajes_files)
    }
  }, [initialData])

  // Handlers
  const handleCaseChange = (field: string, value: any) => {
    setCaseData({ ...caseData, [field]: value })
  }

  const handleDetaineeChange = (field: string, value: any) => {
    const updated = { ...detainee, [field]: value }
    setDetainee(updated)

    if (field === "edad") {
      const edad = Number.parseInt(value) || 0
      setIsMinor(edad < 14)
      if (edad < 14) {
        setDetainee({ ...updated, clasificacion_edad: "Menor de Edad" })
      }
    }
  }

  const handleDelitoChange = (field: string, value: any) => {
    setDelitoActual({ ...delitoActual, [field]: value })
  }

  const agregarDelito = () => {
    if (!delitoActual.tipo_delito) {
      alert("Por favor, seleccione el tipo de delito")
      return
    }
    if (!delitoActual.nivel_delito) {
      alert("Por favor, seleccione el nivel del delito")
      return
    }

    const isDroga = ["trafico_drogas", "posesion_drogas", "distribucion_drogas", "fabricacion_drogas"].includes(
      delitoActual.tipo_delito,
    )
    if (isDroga && !delitoActual.peso_droga) {
      alert("El peso de droga es obligatorio para delitos relacionados con drogas")
      return
    }

    setDelitosRegistrados([...delitosRegistrados, { ...delitoActual, id: Date.now().toString() }])
    setDelitoActual({
      tipo_delito: "",
      nivel_delito: "",
      reincidente: false,
      nombre_bandas: "",
      peso_droga: "",
    })
    console.log("[v0] Delito agregado exitosamente")
  }

  const eliminarDelito = (id: string) => {
    setDelitosRegistrados(delitosRegistrados.filter((d) => d.id !== id))
  }

  const handleEvidenciaChange = (field: string, value: any) => {
    setEvidenciaActual({ ...evidenciaActual, [field]: value })
  }

  const handleEvidenciaFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setEvidenciaArchivos([...evidenciaArchivos, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeEvidenciaFile = (index: number) => {
    setEvidenciaArchivos(evidenciaArchivos.filter((_, i) => i !== index))
  }

  const agregarEvidencia = () => {
    if (!evidenciaActual.tipo_evidencia) {
      alert("Por favor, seleccione el tipo de evidencia")
      return
    }
    if (!evidenciaActual.fecha_incautacion) {
      alert("Por favor, ingrese la fecha de incautación")
      return
    }
    if (!evidenciaActual.lugar_incautacion) {
      alert("Por favor, ingrese el lugar de incautación")
      return
    }

    setEvidenciasRegistradas([
      ...evidenciasRegistradas,
      {
        ...evidenciaActual,
        archivos: evidenciaArchivos,
        id: Date.now().toString(),
      },
    ])
    setEvidenciaActual({
      tipo_evidencia: "",
      fecha_incautacion: "",
      hora_incautacion: "",
      lugar_incautacion: "",
      id_oficial_cargo: "",
      descripcion_detallada: "",
      estado_encontrado: "",
      caracteristica: "",
    })
    setEvidenciaArchivos([])
    console.log("[v0] Evidencia agregada exitosamente")
  }

  const eliminarEvidencia = (id: string) => {
    setEvidenciasRegistradas(evidenciasRegistradas.filter((e) => e.id !== id))
  }

  const handleVictimaChange = (field: string, value: any) => {
    setVictima({ ...victima, [field]: value })
  }

  const handleMinorInfoChange = (field: string, value: any) => {
    setMinorInfo({ ...minorInfo, [field]: value })
  }

  const handleRepresentanteChange = (field: string, value: any) => {
    setNewRepresentante({ ...newRepresentante, [field]: value })
  }

  const addRepresentante = () => {
    if (
      newRepresentante.parentesco &&
      newRepresentante.nombre &&
      newRepresentante.apellido &&
      newRepresentante.cedula_identidad
    ) {
      setRepresentantes([...representantes, { ...newRepresentante, id: Date.now().toString() }])
      setNewRepresentante({
        id: Date.now().toString(),
        parentesco: "",
        nombre: "",
        apellido: "",
        cedula_identidad: "",
        edad: "",
        telefono_contacto: "",
        direccion: "",
        profesion_oficio: "",
        verificacion_siipol: false,
      })
    }
  }

  const removeRepresentante = (id: string) => {
    setRepresentantes(representantes.filter((r) => r.id !== id))
  }

  const handlePhotoUpload = (type: keyof PhotoDetainee, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoDetainee({ ...photoDetainee, [type]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMarksFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setMarksFiles([...marksFiles, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMarkFile = (index: number) => {
    setMarksFiles(marksFiles.filter((_, i) => i !== index))
  }

  const { addCase, updateCase } = useCases()
  const router = useRouter()

  const handleSave = () => {
    const completeData = {
      caso_judicial: caseData,
      detenido: { ...detainee, foto_detenido_url: photoDetainee },
      delitos: delitosRegistrados,
      evidencias: evidenciasRegistradas,
      victima,
      ...(isMinor && {
        menor_edad: minorInfo,
        representantes_legales: representantes,
      }),
      marcas_cicatrices_tatuajes_files: marksFiles,
    }

    console.log("[v0] Caso completo guardado:", completeData)

    const caseToSave = {
      id: initialData ? initialData.id : Date.now(),
      numero: caseData.numero_expediente,
      partes: caseData.partes_involucradas,
      estado: caseData.situacion_juridica || "En Proceso",
      fecha: new Date().toISOString().split('T')[0],
      descripcion: `Delito: ${delitosRegistrados.map(d => d.tipo_delito).join(", ")}`,
      encargado: "Funcionario Actual", // This would come from auth context
      fullData: completeData
    }

    if (initialData) {
      updateCase(initialData.id, caseToSave)
    } else {
      addCase(caseToSave)
    }

    if (onSave) {
      onSave(completeData)
    } else if (onBack) {
      onBack()
    } else {
      router.push("/dashboard/cases")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{initialData ? "Editar Caso Judicial" : "Nuevo Caso Judicial"}</h1>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="caso">Caso Judicial</TabsTrigger>
          <TabsTrigger value="detenido">Detenido</TabsTrigger>
          <TabsTrigger value="delito">Delito y Evidencia</TabsTrigger>
          <TabsTrigger value="victima">Víctima</TabsTrigger>
        </TabsList>

        {/* TAB: CASO JUDICIAL */}
        <TabsContent value="caso" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Caso Judicial</CardTitle>
              <CardDescription>Ingrese los datos del expediente y situación procesal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Número Expediente *</label>
                  <Input
                    placeholder="Ej: 2024-001234"
                    value={caseData.numero_expediente}
                    onChange={(e) => handleCaseChange("numero_expediente", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Circuito Judicial</label>
                  <Input
                    placeholder="Ej: Circuito 1"
                    value={caseData.circuito_judicial}
                    onChange={(e) => handleCaseChange("circuito_judicial", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Jurisdicción Penal</label>
                  <Input
                    placeholder="Ej: San José"
                    value={caseData.jurisdiccion_penal}
                    onChange={(e) => handleCaseChange("jurisdiccion_penal", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Proceso</label>
                  <Select value={caseData.tipo_proceso} onValueChange={(v) => handleCaseChange("tipo_proceso", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ordinario">Ordinario</SelectItem>
                      <SelectItem value="abreviado">Abreviado</SelectItem>
                      <SelectItem value="monitorio">Monitorio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Partes Involucradas</label>
                <Textarea
                  placeholder="Describa las partes involucradas en el caso"
                  value={caseData.partes_involucradas}
                  onChange={(e) => handleCaseChange("partes_involucradas", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Situación Jurídica</label>
                  <Select
                    value={caseData.situacion_juridica}
                    onValueChange={(v) => handleCaseChange("situacion_juridica", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procesado">Procesado</SelectItem>
                      <SelectItem value="imputado">Imputado</SelectItem>
                      <SelectItem value="sentenciado">Sentenciado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Fase del Proceso</label>
                  <Select value={caseData.fase_proceso} onValueChange={(v) => handleCaseChange("fase_proceso", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigacion">Investigación</SelectItem>
                      <SelectItem value="instruccion">Instrucción</SelectItem>
                      <SelectItem value="juicio">Juicio</SelectItem>
                      <SelectItem value="ejecucion">Ejecución</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Defensa</label>
                  <Select value={caseData.tipo_defensa} onValueChange={(v) => handleCaseChange("tipo_defensa", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publica">Pública</SelectItem>
                      <SelectItem value="privada">Privada</SelectItem>
                      <SelectItem value="sin_defensa">Sin Defensa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Medida de Coerción</label>
                  <Select
                    value={caseData.medida_coercion}
                    onValueChange={(v) => handleCaseChange("medida_coercion", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prision_preventiva">Prisión Preventiva</SelectItem>
                      <SelectItem value="comparecencia">Comparecencia</SelectItem>
                      <SelectItem value="medidas_cautelares">Medidas Cautelares</SelectItem>
                      <SelectItem value="libertad">Libertad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha Coerción</label>
                  <Input
                    type="date"
                    value={caseData.fecha_coercion}
                    onChange={(e) => handleCaseChange("fecha_coercion", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Posee Cómputos</label>
                  <div className="flex items-center mt-2">
                    <Checkbox
                      checked={caseData.posee_computos}
                      onCheckedChange={(v) => handleCaseChange("posee_computos", v)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha Oficio Cómputo</label>
                  <Input
                    type="date"
                    value={caseData.fecha_oficio_computo}
                    onChange={(e) => handleCaseChange("fecha_oficio_computo", e.target.value)}
                  />
                </div>
              </div>

              {caseData.posee_computos && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <label className="text-sm font-medium">Años</label>
                    <Input
                      type="number"
                      value={caseData.anio_computo}
                      onChange={(e) => handleCaseChange("anio_computo", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Meses</label>
                    <Input
                      type="number"
                      value={caseData.mes_computo}
                      onChange={(e) => handleCaseChange("mes_computo", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Días</label>
                    <Input
                      type="number"
                      value={caseData.dias_computo}
                      onChange={(e) => handleCaseChange("dias_computo", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: DETENIDO */}
        <TabsContent value="detenido" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos de Identificación del Detenido</CardTitle>
              <CardDescription>Fotos de identificación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {(["frontal", "lateral_izquierda", "lateral_derecha", "perfil"] as const).map((type) => (
                  <div key={type} className="flex flex-col items-center">
                    <div className="w-24 h-32 bg-muted border-2 border-dashed rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                      {photoDetainee[type] ? (
                        <img
                          src={photoDetainee[type]! || "/placeholder.svg"}
                          alt={type}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <label className="text-xs font-medium capitalize mb-1">{type.replace(/_/g, " ")}</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(type, e)}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Datos básicos detenido */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input value={detainee.nombre} onChange={(e) => handleDetaineeChange("nombre", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellido *</label>
                  <Input value={detainee.apellido} onChange={(e) => handleDetaineeChange("apellido", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Cédula / Pasaporte</label>
                  <Input
                    value={detainee.numero_pasaporte}
                    onChange={(e) => handleDetaineeChange("numero_pasaporte", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Indocumentado</label>
                  <div className="flex items-center mt-2">
                    <Checkbox
                      checked={detainee.indocumentado}
                      onCheckedChange={(v) => handleDetaineeChange("indocumentado", v)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Edad *</label>
                  <Input
                    type="number"
                    value={detainee.edad}
                    onChange={(e) => handleDetaineeChange("edad", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de Nacimiento</label>
                  <Input
                    type="date"
                    value={detainee.fecha_nacimiento}
                    onChange={(e) => handleDetaineeChange("fecha_nacimiento", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sexo</label>
                  <Select value={detainee.sexo} onValueChange={(v) => handleDetaineeChange("sexo", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="O">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Nacionalidad</label>
                  <Input
                    value={detainee.nacionalidad}
                    onChange={(e) => handleDetaineeChange("nacionalidad", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">País de Origen</label>
                  <Input
                    value={detainee.pais_origen}
                    onChange={(e) => handleDetaineeChange("pais_origen", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Gentilicio</label>
                  <Input
                    value={detainee.gentilicio}
                    onChange={(e) => handleDetaineeChange("gentilicio", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Raza</label>
                  <Input value={detainee.raza} onChange={(e) => handleDetaineeChange("raza", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Estado Civil</label>
                  <Select value={detainee.estado_civil} onValueChange={(v) => handleDetaineeChange("estado_civil", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soltero">Soltero</SelectItem>
                      <SelectItem value="casado">Casado</SelectItem>
                      <SelectItem value="divorciado">Divorciado</SelectItem>
                      <SelectItem value="viudo">Viudo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Grado de Instrucción</label>
                  <Select
                    value={detainee.grado_instruccion}
                    onValueChange={(v) => handleDetaineeChange("grado_instruccion", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaria">Primaria</SelectItem>
                      <SelectItem value="secundaria">Secundaria</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                      <SelectItem value="analfabeta">Analfabeta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Profesión / Oficio</label>
                  <Input
                    value={detainee.profesion_oficio}
                    onChange={(e) => handleDetaineeChange("profesion_oficio", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Características Físicas */}
          <Card>
            <CardHeader>
              <CardTitle>Características Físicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Color de Ojos</label>
                  <Input
                    value={detainee.color_ojos}
                    onChange={(e) => handleDetaineeChange("color_ojos", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Color de Piel</label>
                  <Input
                    value={detainee.color_piel}
                    onChange={(e) => handleDetaineeChange("color_piel", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Color de Cabello</label>
                  <Input
                    value={detainee.color_cabello}
                    onChange={(e) => handleDetaineeChange("color_cabello", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Estatura (cm)</label>
                  <Input
                    type="number"
                    value={detainee.estatura_cm}
                    onChange={(e) => handleDetaineeChange("estatura_cm", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Peso (kg)</label>
                  <Input
                    type="number"
                    value={detainee.peso_kg}
                    onChange={(e) => handleDetaineeChange("peso_kg", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Contextura</label>
                  <Select value={detainee.contextura} onValueChange={(v) => handleDetaineeChange("contextura", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delgada">Delgada</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="robusta">Robusta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Cicatrices, Tatuajes y Marcas</label>
                <Textarea
                  placeholder="Describa cicatrices, tatuajes y otras marcas características"
                  value={detainee.marcas_cicatrices_tatuajes}
                  onChange={(e) => handleDetaineeChange("marcas_cicatrices_tatuajes", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Carga de Fotos - Cicatrices y Tatuajes</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMarksFileUpload}
                    className="hidden"
                    id="marks-upload"
                  />
                  <label htmlFor="marks-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Haga clic para cargar fotos</span>
                    </div>
                  </label>
                </div>

                {marksFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {marksFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={file || "/placeholder.svg"}
                          alt={`Marca ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          onClick={() => removeMarkFile(index)}
                          className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Aprehensión */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Aprehensión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha y Hora de Aprehensión</label>
                  <Input
                    type="datetime-local"
                    value={detainee.fecha_aprehension}
                    onChange={(e) => handleDetaineeChange("fecha_aprehension", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Organismo Aprehensor</label>
                  <Input
                    value={detainee.organismo_aprehensor}
                    onChange={(e) => handleDetaineeChange("organismo_aprehensor", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Dirección de Aprehensión</label>
                <Textarea
                  value={detainee.direccion_aprehension}
                  onChange={(e) => handleDetaineeChange("direccion_aprehension", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Forma de Aprehensión</label>
                  <Select
                    value={detainee.forma_aprehension}
                    onValueChange={(v) => handleDetaineeChange("forma_aprehension", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orden_juzgado">Orden de Juzgado</SelectItem>
                      <SelectItem value="flagrancia">Flagrancia</SelectItem>
                      <SelectItem value="voluntaria">Voluntaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tiempo Aprehendido</label>
                  <Input
                    value={detainee.tiempo_aprehendido}
                    onChange={(e) => handleDetaineeChange("tiempo_aprehendido", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salud */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Salud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Discapacidad</label>
                  <Input
                    value={detainee.tipo_discapacidad}
                    onChange={(e) => handleDetaineeChange("tipo_discapacidad", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Patología / Enfermedad</label>
                  <Input
                    value={detainee.patologia_enfermedad}
                    onChange={(e) => handleDetaineeChange("patologia_enfermedad", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Enfermedad</label>
                  <Input
                    value={detainee.tipo_enfermedad}
                    onChange={(e) => handleDetaineeChange("tipo_enfermedad", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Medicamento</label>
                  <Input
                    value={detainee.medicamento}
                    onChange={(e) => handleDetaineeChange("medicamento", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tratamiento</label>
                <Textarea
                  value={detainee.tratamiento}
                  onChange={(e) => handleDetaineeChange("tratamiento", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información especial para mujeres */}
          {detainee.sexo === "F" && (
            <Card className="border-orange-300">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-900">Información Especial - Mujer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tiempo de Gestación</label>
                    <Input
                      value={detainee.tiempo_gestacion}
                      onChange={(e) => handleDetaineeChange("tiempo_gestacion", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Está Lactando</label>
                    <div className="flex items-center mt-2">
                      <Checkbox
                        checked={detainee.esta_lactando}
                        onCheckedChange={(v) => handleDetaineeChange("esta_lactando", v)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* INFORMACIÓN ESPECIAL PARA MENORES */}
          {isMinor && (
            <Card className="border-red-300">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-900">Información Especial - Menor de Edad (menos de 14 años)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-4">
                <Tabs defaultValue="menor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="menor">Datos del Menor</TabsTrigger>
                    <TabsTrigger value="representantes">Representantes Legales</TabsTrigger>
                  </TabsList>

                  <TabsContent value="menor" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nombre del Menor</label>
                        <Input
                          value={minorInfo.nombre}
                          onChange={(e) => handleMinorInfoChange("nombre", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Apellido del Menor</label>
                        <Input
                          value={minorInfo.apellido}
                          onChange={(e) => handleMinorInfoChange("apellido", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Causa</label>
                      <Textarea
                        value={minorInfo.causa}
                        onChange={(e) => handleMinorInfoChange("causa", e.target.value)}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-4">Consejero de Protección</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Nombre *</label>
                          <Input
                            value={minorInfo.consejero_nombre}
                            onChange={(e) => handleMinorInfoChange("consejero_nombre", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Apellido *</label>
                          <Input
                            value={minorInfo.consejero_apellido}
                            onChange={(e) => handleMinorInfoChange("consejero_apellido", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Cédula / Código *</label>
                          <Input
                            value={minorInfo.consejero_cedula_o_codigo}
                            onChange={(e) => handleMinorInfoChange("consejero_cedula_o_codigo", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Teléfono</label>
                          <Input
                            value={minorInfo.consejero_telefono}
                            onChange={(e) => handleMinorInfoChange("consejero_telefono", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-medium">Nota / Observación</label>
                        <Textarea
                          value={minorInfo.nota_observacion}
                          onChange={(e) => handleMinorInfoChange("nota_observacion", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="representantes" className="space-y-4">
                    <div className="space-y-4">
                      {representantes.map((rep, index) => (
                        <Card key={rep.id} className="bg-muted">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base">Representante {index + 1}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => removeRepresentante(rep.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Parentesco:</span> {rep.parentesco}
                              </div>
                              <div>
                                <span className="font-medium">Nombre:</span> {rep.nombre} {rep.apellido}
                              </div>
                              <div>
                                <span className="font-medium">Cédula:</span> {rep.cedula_identidad}
                              </div>
                              <div>
                                <span className="font-medium">Edad:</span> {rep.edad}
                              </div>
                              <div>
                                <span className="font-medium">Teléfono:</span> {rep.telefono_contacto}
                              </div>
                              <div>
                                <span className="font-medium">SIIPOL:</span> {rep.verificacion_siipol ? "Sí" : "No"}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-base">Agregar Nuevo Representante Legal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Parentesco *</label>
                              <Select
                                value={newRepresentante.parentesco}
                                onValueChange={(v) => handleRepresentanteChange("parentesco", v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="padre">Padre</SelectItem>
                                  <SelectItem value="madre">Madre</SelectItem>
                                  <SelectItem value="tutor">Tutor</SelectItem>
                                  <SelectItem value="abuelo">Abuelo</SelectItem>
                                  <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Nombre *</label>
                              <Input
                                value={newRepresentante.nombre}
                                onChange={(e) => handleRepresentanteChange("nombre", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Apellido *</label>
                              <Input
                                value={newRepresentante.apellido}
                                onChange={(e) => handleRepresentanteChange("apellido", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Cédula *</label>
                              <Input
                                value={newRepresentante.cedula_identidad}
                                onChange={(e) => handleRepresentanteChange("cedula_identidad", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Edad</label>
                              <Input
                                type="number"
                                value={newRepresentante.edad}
                                onChange={(e) => handleRepresentanteChange("edad", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Teléfono de Contacto</label>
                              <Input
                                value={newRepresentante.telefono_contacto}
                                onChange={(e) => handleRepresentanteChange("telefono_contacto", e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Dirección</label>
                            <Textarea
                              value={newRepresentante.direccion}
                              onChange={(e) => handleRepresentanteChange("direccion", e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Profesión / Oficio</label>
                              <Input
                                value={newRepresentante.profesion_oficio}
                                onChange={(e) => handleRepresentanteChange("profesion_oficio", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Verificación SIIPOL</label>
                              <div className="flex items-center mt-2">
                                <Checkbox
                                  checked={newRepresentante.verificacion_siipol}
                                  onCheckedChange={(v) => handleRepresentanteChange("verificacion_siipol", v)}
                                />
                              </div>
                            </div>
                          </div>

                          <Button onClick={addRepresentante} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Representante Legal
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delito" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Delitos y Evidencia</CardTitle>
              <CardDescription>Agregue delitos asociados al caso y su evidencia relacionada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sección Nuevo Delito */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border-2 border-dashed">
                <h3 className="font-semibold text-base">Nuevo Delito</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Delito *</label>
                    <Select
                      value={delitoActual.tipo_delito}
                      onValueChange={(v) => handleDelitoChange("tipo_delito", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="robo">Robo</SelectItem>
                        <SelectItem value="asalto">Asalto</SelectItem>
                        <SelectItem value="homicidio">Homicidio</SelectItem>
                        <SelectItem value="violacion">Violación</SelectItem>
                        <SelectItem value="trafico_drogas">Tráfico de Drogas</SelectItem>
                        <SelectItem value="posesion_drogas">Posesión de Drogas</SelectItem>
                        <SelectItem value="distribucion_drogas">Distribución de Drogas</SelectItem>
                        <SelectItem value="fabricacion_drogas">Fabricación de Drogas</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nivel del Delito *</label>
                    <Select
                      value={delitoActual.nivel_delito}
                      onValueChange={(v) => handleDelitoChange("nivel_delito", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leve">Leve</SelectItem>
                        <SelectItem value="grave">Grave</SelectItem>
                        <SelectItem value="muy_grave">Muy Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Reincidente</label>
                    <div className="flex items-center mt-2">
                      <Checkbox
                        checked={delitoActual.reincidente}
                        onCheckedChange={(v) => handleDelitoChange("reincidente", v)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nombre de Bandas</label>
                    <Input
                      value={delitoActual.nombre_bandas}
                      onChange={(e) => handleDelitoChange("nombre_bandas", e.target.value)}
                    />
                  </div>
                </div>

                {["trafico_drogas", "posesion_drogas", "distribucion_drogas", "fabricacion_drogas"].includes(
                  delitoActual.tipo_delito,
                ) && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <label className="text-sm font-medium text-amber-900">Peso de Droga (kg) *</label>
                      <p className="text-xs text-amber-700 mb-2">
                        Campo obligatorio para delitos relacionados con drogas
                      </p>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ingrese el peso en kilogramos"
                        value={delitoActual.peso_droga}
                        onChange={(e) => handleDelitoChange("peso_droga", e.target.value)}
                        className="border-amber-300"
                      />
                    </div>
                  )}

                <Button onClick={agregarDelito} className="w-full bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Delito
                </Button>
              </div>

              {/*Tabla de delitos registrados */}
              {delitosRegistrados.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Nivel</th>
                        <th className="px-4 py-2 text-left">Reincidente</th>
                        <th className="px-4 py-2 text-left">Banda</th>
                        <th className="px-4 py-2 text-left">Peso (kg)</th>
                        <th className="px-4 py-2 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {delitosRegistrados.map((delito) => (
                        <tr key={delito.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-2">{delito.tipo_delito}</td>
                          <td className="px-4 py-2">{delito.nivel_delito}</td>
                          <td className="px-4 py-2">{delito.reincidente ? "Sí" : "No"}</td>
                          <td className="px-4 py-2">{delito.nombre_bandas || "-"}</td>
                          <td className="px-4 py-2">{delito.peso_droga || "-"}</td>
                          <td className="px-4 py-2 text-center">
                            <Button variant="ghost" size="sm" onClick={() => eliminarDelito(delito.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Separador visual */}
              <div className="border-t pt-6" />

              {/* Sección Nueva Evidencia con interfaz mejorada */}
              <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-base">Nueva Evidencia</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Evidencia *</label>
                    <Select
                      value={evidenciaActual.tipo_evidencia}
                      onValueChange={(v) => handleEvidenciaChange("tipo_evidencia", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arma">Arma</SelectItem>
                        <SelectItem value="droga">Droga</SelectItem>
                        <SelectItem value="dinero">Dinero</SelectItem>
                        <SelectItem value="documento">Documento</SelectItem>
                        <SelectItem value="dispositivo_electronico">Dispositivo Electrónico</SelectItem>
                        <SelectItem value="ropa">Ropa</SelectItem>
                        <SelectItem value="objeto_robado">Objeto Robado</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha Incautación *</label>
                    <Input
                      type="date"
                      value={evidenciaActual.fecha_incautacion}
                      onChange={(e) => handleEvidenciaChange("fecha_incautacion", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Hora Incautación</label>
                    <Input
                      type="time"
                      value={evidenciaActual.hora_incautacion}
                      onChange={(e) => handleEvidenciaChange("hora_incautacion", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Lugar Incautación *</label>
                    <Input
                      placeholder="Ej: Residencia, calle, etc."
                      value={evidenciaActual.lugar_incautacion}
                      onChange={(e) => handleEvidenciaChange("lugar_incautacion", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">ID Oficial a Cargo</label>
                  <Input
                    placeholder="Código o ID del funcionario responsable"
                    value={evidenciaActual.id_oficial_cargo}
                    onChange={(e) => handleEvidenciaChange("id_oficial_cargo", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción Detallada</label>
                  <Textarea
                    placeholder="Describa detalladamente la evidencia"
                    value={evidenciaActual.descripcion_detallada}
                    onChange={(e) => handleEvidenciaChange("descripcion_detallada", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estado Encontrado</label>
                    <Input
                      placeholder="Ej: Íntegro, dañado, etc."
                      value={evidenciaActual.estado_encontrado}
                      onChange={(e) => handleEvidenciaChange("estado_encontrado", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Característica</label>
                    <Input
                      placeholder="Características distintivas"
                      value={evidenciaActual.caracteristica}
                      onChange={(e) => handleEvidenciaChange("caracteristica", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Archivos Adjuntos (Fotos/Videos)</label>
                  <div
                    className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-100/50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const files = e.dataTransfer.files
                      if (files) {
                        handleEvidenciaFileUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>)
                      }
                    }}
                  >
                    <input
                      id="evidence-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleEvidenciaFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="evidence-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-blue-500" />
                      <p className="font-medium text-blue-900">Arrastra archivos aquí o haz clic</p>
                      <p className="text-xs text-blue-700">Soporta imágenes y videos</p>
                      <p className="text-xs text-blue-600 mt-2">
                        {evidenciaArchivos.length} archivo(s) seleccionado(s)
                      </p>
                    </label>
                  </div>

                  {/* Preview de archivos */}
                  {evidenciaArchivos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Archivos cargados:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {evidenciaArchivos.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={file || "/placeholder.svg"}
                              alt={`Evidencia ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border-2 border-blue-200 group-hover:opacity-75 transition"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition"
                              onClick={() => removeEvidenciaFile(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <p className="text-xs text-center mt-1">Archivo {index + 1}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={agregarEvidencia} className="w-full bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Evidencia
                </Button>
              </div>

              {/*Tabla de evidencias registradas */}
              {evidenciasRegistradas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Evidencias Registradas</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted border-b">
                        <tr>
                          <th className="px-4 py-2 text-left">Tipo</th>
                          <th className="px-4 py-2 text-left">Fecha</th>
                          <th className="px-4 py-2 text-left">Lugar</th>
                          <th className="px-4 py-2 text-left">Estado</th>
                          <th className="px-4 py-2 text-left">Archivos</th>
                          <th className="px-4 py-2 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evidenciasRegistradas.map((evidencia) => (
                          <tr key={evidencia.id} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2">{evidencia.tipo_evidencia}</td>
                            <td className="px-4 py-2">{evidencia.fecha_incautacion}</td>
                            <td className="px-4 py-2">{evidencia.lugar_incautacion}</td>
                            <td className="px-4 py-2">{evidencia.estado_encontrado || "-"}</td>
                            <td className="px-4 py-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {evidencia.archivos.length} archivo(s)
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Button variant="ghost" size="sm" onClick={() => eliminarEvidencia(evidencia.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: VÍCTIMA */}
        <TabsContent value="victima" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Víctima</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Víctima</label>
                  <Select value={victima.tipo_victima} onValueChange={(v) => handleVictimaChange("tipo_victima", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persona">Persona</SelectItem>
                      <SelectItem value="institucion">Institución</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input value={victima.nombre} onChange={(e) => handleVictimaChange("nombre", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Apellido</label>
                  <Input value={victima.apellido} onChange={(e) => handleVictimaChange("apellido", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Cédula</label>
                  <Input value={victima.cedula} onChange={(e) => handleVictimaChange("cedula", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Edad</label>
                  <Input
                    type="number"
                    value={victima.edad}
                    onChange={(e) => handleVictimaChange("edad", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de Nacimiento</label>
                  <Input
                    type="date"
                    value={victima.fecha_nacimiento}
                    onChange={(e) => handleVictimaChange("fecha_nacimiento", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Auditoría - Sección colapsable */}
      <Card className="border-gray-300">
        <Accordion type="single" collapsible>
          <AccordionItem value="auditoria">
            <AccordionTrigger className="font-semibold">Auditoría / Trazabilidad (Solo Lectura)</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <label className="font-medium text-muted-foreground">ID Caso:</label>
                  <p className="text-gray-400">Auto-generado</p>
                </div>
                <div className="text-sm">
                  <label className="font-medium text-muted-foreground">Fecha de Registro:</label>
                  <p className="text-gray-400">Será establecida al guardar</p>
                </div>
                <div className="text-sm">
                  <label className="font-medium text-muted-foreground">Usuario que Registra:</label>
                  <p className="text-gray-400">Usuario actual del sistema</p>
                </div>
                <div className="text-sm">
                  <label className="font-medium text-muted-foreground">Fecha de Última Modificación:</label>
                  <p className="text-gray-400">Se actualizará al modificar</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onBack}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-primary">
          <Save className="mr-2 h-4 w-4" />
          Guardar Caso Completo
        </Button>
      </div>
    </div>
  )
}
