"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileText, AlertCircle, Users, CheckCircle2 } from "lucide-react"

const casesData = [
  { mes: "Ene", casos: 12, resueltos: 8 },
  { mes: "Feb", casos: 19, resueltos: 12 },
  { mes: "Mar", casos: 15, resueltos: 10 },
  { mes: "Abr", casos: 22, resueltos: 18 },
  { mes: "May", casos: 28, resueltos: 24 },
  { mes: "Jun", casos: 25, resueltos: 21 },
]

const statusData = [
  { name: "Presentación", value: 45, color: "#fbbf24" }, // Yellow
  { name: "Fase de Juicio", value: 38, color: "#3b82f6" }, // Blue
  { name: "Sentenciado", value: 17, color: "#ef4444" }, // Red
]

const statCards = [
  {
    title: "Casos Activos",
    value: "156",
    change: "+12%",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Casos Resueltos",
    value: "89",
    change: "+5%",
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
  {
    title: "Novedades Registradas",
    value: "24",
    change: "Hoy",
    icon: <AlertCircle className="h-6 w-6" />,
  },
  {
    title: "Usuarios Activos",
    value: "42",
    change: "En línea",
    icon: <Users className="h-6 w-6" />,
  },
]

export default function DashboardMain() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-primary">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Casos vs Situación Jurídica</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="casos" fill="var(--color-primary)" />
                <Bar dataKey="resueltos" fill="var(--color-success)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Casos</CardTitle>
            <CardDescription>Por situación jurídica</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas novedades registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "Nuevo Caso", desc: "Caso #2024-001 registrado", time: "Hace 2 horas" },
              { type: "Detenido", desc: "Juan Pérez agregado a caso #2024-001", time: "Hace 1 hora" },
              { type: "Novedad", desc: "Traslado de evidencia registrado", time: "Hace 30 minutos" },
              { type: "Fiscalía", desc: "Documento fiscal adjuntado", time: "Hace 15 minutos" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
