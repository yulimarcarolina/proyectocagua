"use client"

import { useLocalStorage } from "./use-local-storage"

export interface Official {
    id: string
    nombre: string
    apellido: string
    cedula: string
    telefono: string
    jerarquia: string
    cargo: string
    estatus: "Activo" | "Inactivo" | "Vacaciones" | "Reposo"
    fullData?: any
}

const INITIAL_OFFICIALS: Official[] = [
    {
        id: "1",
        nombre: "Carlos",
        apellido: "Pérez",
        cedula: "12.345.678",
        telefono: "0412-1234567",
        jerarquia: "Supervisor Jefe",
        cargo: "Jefe de Patrulla",
        estatus: "Activo",
    },
    {
        id: "2",
        nombre: "María",
        apellido: "Rodríguez",
        cedula: "15.678.901",
        telefono: "0414-9876543",
        jerarquia: "Oficial Agregado",
        cargo: "Oficial de Guardia",
        estatus: "Activo",
    },
]

export function useOfficials() {
    const { items, addItem, updateItem, removeItem } = useLocalStorage<Official>("pst_officials", INITIAL_OFFICIALS)

    return {
        officials: items,
        addOfficial: addItem,
        updateOfficial: updateItem,
        removeOfficial: removeItem,
    }
}
