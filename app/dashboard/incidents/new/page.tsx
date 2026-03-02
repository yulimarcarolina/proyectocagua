"use client"

import { useRouter } from "next/navigation"
import NewIncidentForm from "@/components/modules/new-incident-form"

export default function NewIncidentPage() {
    const router = useRouter()

    return (
        <NewIncidentForm
            onBack={() => router.push("/dashboard/incidents")}
            onSave={(data) => {
                console.log("Saving incident:", data)
                // Here you would typically save to backend
                router.push("/dashboard/incidents")
            }}
        />
    )
}
