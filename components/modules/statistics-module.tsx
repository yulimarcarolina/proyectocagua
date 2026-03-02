"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Filter, RefreshCcw } from "lucide-react"

// Mock Data
const MOCK_DATA = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    age: Math.floor(Math.random() * (60 - 18) + 18), // 18-60
    gender: Math.random() > 0.8 ? "Femenino" : "Masculino",
    recidivist: Math.random() > 0.7,
    hasTattoos: Math.random() > 0.5,
    crimeType: ["Robo", "Hurto", "Lesiones", "Homicidio", "Estafa"][Math.floor(Math.random() * 5)],
}))

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function StatisticsModule() {
    const [filters, setFilters] = useState({
        minAge: "",
        maxAge: "",
        gender: "all",
        recidivist: false,
        hasTattoos: false,
    })

    // Filter Logic
    const filteredData = useMemo(() => {
        return MOCK_DATA.filter((item) => {
            if (filters.minAge && item.age < parseInt(filters.minAge)) return false
            if (filters.maxAge && item.age > parseInt(filters.maxAge)) return false
            if (filters.gender !== "all" && item.gender !== filters.gender) return false
            if (filters.recidivist && !item.recidivist) return false
            if (filters.hasTattoos && !item.hasTattoos) return false
            return true
        })
    }, [filters])

    // Statistics Calculations
    const stats = useMemo(() => {
        const crimeCounts = filteredData.reduce((acc, item) => {
            acc[item.crimeType] = (acc[item.crimeType] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const crimeData = Object.entries(crimeCounts).map(([name, value]) => ({ name, value }))

        const genderCounts = filteredData.reduce((acc, item) => {
            acc[item.gender] = (acc[item.gender] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))

        return {
            total: filteredData.length,
            avgAge: filteredData.length > 0 ? Math.round(filteredData.reduce((acc, item) => acc + item.age, 0) / filteredData.length) : 0,
            crimeData,
            genderData,
        }
    }, [filteredData])

    const handleReset = () => {
        setFilters({
            minAge: "",
            maxAge: "",
            gender: "all",
            recidivist: false,
            hasTattoos: false,
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
                    <p className="text-muted-foreground">Análisis de datos y filtrado de casos.</p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Restablecer Filtros
                </Button>
            </div>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros de Búsqueda
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Edad Mínima</Label>
                            <Input
                                type="number"
                                placeholder="Ej. 18"
                                value={filters.minAge}
                                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Edad Máxima</Label>
                            <Input
                                type="number"
                                placeholder="Ej. 60"
                                value={filters.maxAge}
                                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Género</Label>
                            <Select
                                value={filters.gender}
                                onValueChange={(value) => setFilters({ ...filters, gender: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                    <SelectItem value="Femenino">Femenino</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-4 pt-8">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="recidivist"
                                    checked={filters.recidivist}
                                    onCheckedChange={(checked) =>
                                        setFilters({ ...filters, recidivist: checked as boolean })
                                    }
                                />
                                <Label htmlFor="recidivist">Solo Reincidentes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tattoos"
                                    checked={filters.hasTattoos}
                                    onCheckedChange={(checked) =>
                                        setFilters({ ...filters, hasTattoos: checked as boolean })
                                    }
                                />
                                <Label htmlFor="tattoos">Con Tatuajes</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Casos Filtrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">De {MOCK_DATA.length} registros totales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Edad Promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgAge} años</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Distribución por Delito</CardTitle>
                        <CardDescription>Tipos de delitos en la selección actual</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.crimeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Distribución por Género</CardTitle>
                        <CardDescription>Proporción de género en la selección actual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.genderData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.genderData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
