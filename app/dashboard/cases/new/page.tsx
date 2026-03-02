"use client"

import { useRouter, useSearchParams } from "next/navigation"
import NewCaseForm from "@/components/modules/new-case-form"
import { useCases } from "@/hooks/use-cases"
import { useEffect, useState } from "react"

export default function NewCasePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { cases } = useCases()
    const [initialData, setInitialData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const editId = searchParams.get('edit')

    useEffect(() => {
        if (editId) {
            const caseToEdit = cases.find(c => c.id === parseInt(editId))
            if (caseToEdit && caseToEdit.fullData) {
                setInitialData(caseToEdit.fullData)
            }
        }
        setIsLoading(false)
    }, [editId, cases])

    if (isLoading) {
        return <div className="p-8">Cargando...</div>
    }

    return (
        <NewCaseForm
            onBack={() => router.push("/dashboard/cases")}
            onSave={(data) => {
                console.log("Saving case:", data)
                router.push("/dashboard/cases")
            }}
            initialData={initialData}
        />
    )
}
