"use client"

import { useLocalStorage } from "./use-local-storage"

export interface Incident {
    id: number
    tipo: string
    descripcion: string
    fecha: string
    funcionario: string
    fullData?: any
}

const INITIAL_INCIDENTS: Incident[] = [
    {
        id: 1,
        tipo: "Visita",
        descripcion: "Visita de familiar permitida",
        fecha: "2024-01-25",
        funcionario: "Carlos Martínez",
    },
    {
        id: 2,
        tipo: "Médico",
        descripcion: "Atención médica - dolor abdominal",
        fecha: "2024-01-24",
        funcionario: "María López",
    },
    {
        id: 3,
        tipo: "Traslado",
        descripcion: "Traslado a tribunal para audiencia",
        fecha: "2024-01-24",
        funcionario: "Roberto Silva",
    },
]

export function useIncidents() {
    const { items, addItem, updateItem, removeItem } = useLocalStorage<Incident>("pst_incidents", INITIAL_INCIDENTS)

    return {
        incidents: items,
        addIncident: addItem,
        updateIncident: updateItem,
        removeIncident: removeItem,
    }
}
