"use client"

import { useLocalStorage } from "./use-local-storage"

export interface Guard {
    id: string
    officialId: string
    officialName: string
    date: string
    shift: "Diurno" | "Nocturno"
    location: string
    status: "Pendiente" | "En Curso" | "Completada"
    notes?: string
}

const INITIAL_GUARDS: Guard[] = [
    {
        id: "1",
        officialId: "1",
        officialName: "Pedro Pérez",
        date: new Date().toISOString().split('T')[0],
        shift: "Diurno",
        location: "Recepción Principal",
        status: "En Curso",
    },
]

export function useGuards() {
    const { items, addItem, updateItem, removeItem } = useLocalStorage<Guard>("pst_guards", INITIAL_GUARDS)

    return {
        guards: items,
        addGuard: addItem,
        updateGuard: updateItem,
        removeGuard: removeItem,
    }
}
