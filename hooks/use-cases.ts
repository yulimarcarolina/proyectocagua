"use client"

import { useLocalStorage } from "./use-local-storage"

export interface Case {
    id: number
    numero: string
    partes: string
    estado: string
    fecha: string
    descripcion?: string
    encargado?: string
    fullData?: any
}

const INITIAL_CASES: Case[] = [
    { id: 1, numero: "#2024-001", partes: "Fiscalía vs Juan Pérez", estado: "Presentación", fecha: "2024-01-15" },
    { id: 2, numero: "#2024-002", partes: "Fiscalía vs María González", estado: "Fase de Juicio", fecha: "2024-01-20" },
    { id: 3, numero: "#2024-003", partes: "Fiscalía vs Pedro Rodríguez", estado: "Presentación", fecha: "2024-01-22" },
    { id: 4, numero: "#2024-004", partes: "Fiscalía vs Ana López", estado: "Sentenciado", fecha: "2024-01-25" },
    { id: 5, numero: "#2024-005", partes: "Fiscalía vs Carlos Ruiz", estado: "Fase de Juicio", fecha: "2024-01-28" },
]

export function useCases() {
    const { items, addItem, updateItem, removeItem } = useLocalStorage<Case>("pst_cases", INITIAL_CASES)

    return {
        cases: items,
        addCase: addItem,
        updateCase: updateItem,
        removeCase: removeItem,
    }
}
