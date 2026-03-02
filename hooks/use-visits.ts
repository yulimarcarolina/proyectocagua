"use client"

import { useLocalStorage } from "./use-local-storage"

export interface Visit {
    id: string
    visitorName: string
    visitorId: string // Cédula del visitante
    detaineeId: string // ID del detenido (o nombre si no está en sistema)
    detaineeName: string
    date: string
    timeIn: string
    timeOut?: string
    reason: string
    status: "En Curso" | "Finalizada"
    fullData?: any
}

const INITIAL_VISITS: Visit[] = [
    {
        id: "1",
        visitorName: "Ana López",
        visitorId: "10.123.456",
        detaineeId: "1",
        detaineeName: "Juan Pérez",
        date: new Date().toISOString().split('T')[0],
        timeIn: "09:00",
        reason: "Visita Familiar",
        status: "En Curso",
    },
]

export function useVisits() {
    const { items, addItem, updateItem, removeItem } = useLocalStorage<Visit>("pst_visits", INITIAL_VISITS)

    return {
        visits: items,
        addVisit: addItem,
        updateVisit: updateItem,
        removeVisit: removeItem,
    }
}
