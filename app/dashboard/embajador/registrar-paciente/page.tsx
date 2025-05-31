"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import RegistrarPacienteForm from "@/src/components/forms/CompletarPacienteForm"
import RegistroUsuarioPacienteForm from "@/src/components/forms/RegistroPacienteForm"
import { Button } from "@/src/components/ui/button"

export default function RegistrarPacientePage() {
    const router = useRouter()

    return (
        <div>
            <div className="mb-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/dashboard/embajador')}
                >
                    <ArrowLeft className="size-4" />
                </Button>
                <h1 className="text-2xl font-bold">Registrar Nuevo Paciente</h1>
            </div>

            <RegistroUsuarioPacienteForm />

            <br />

            <RegistrarPacienteForm />



        </div>
    )
}