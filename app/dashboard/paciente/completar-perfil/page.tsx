"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import RegistrarPacienteForm from "@/src/components/forms/CompletarPacienteForm"
import { Button } from "@/src/components/ui/button"
import { ROLES, RUTAS_POR_ROL } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { testFlujoPerfilTriaje } from "@/src/utils/debug"

export default function CompletarPerfilPacientePage() {
    const router = useRouter()
    const { usuario, cargando, necesitaCompletarPerfil } = useAuth()
    const [debug, setDebug] = useState<boolean>(false)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    useEffect(() => {
        if (!cargando) {
            if (!usuario) {
                router.push("/acceso")
            } else if (usuario.rolId !== ROLES.PACIENTE) {
                router.push(RUTAS_POR_ROL[usuario.rolId])
            } else if (!necesitaCompletarPerfil) {
                router.push("/dashboard/paciente")
            }
        }
    }, [cargando, usuario, router, necesitaCompletarPerfil])

    const ejecutarDiagnostico = async () => {
        setDebug(true)
        setDebugInfo({ estado: "Ejecutando diagnóstico..." })

        try {
            if (usuario?.id) {
                const result = await testFlujoPerfilTriaje(usuario.id)
                setDebugInfo(result)
            } else {
                setDebugInfo({ error: "No hay usuario con ID" })
            }
        } catch (error) {
            setDebugInfo({ error: String(error) })
        }
    }

    if (cargando || !usuario) {
        return <div>Cargando...</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-center text-2xl font-bold">
                    Completa tu Perfil
                </h1>
                <RegistrarPacienteForm />

                <div className="mt-8 text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={ejecutarDiagnostico}
                        className="text-xs"
                    >
                        🔍 Diagnosticar Estado
                    </Button>

                    {debug && debugInfo && (
                        <div className="mt-4 rounded-md bg-gray-100 p-4 text-left text-xs">
                            <h4 className="mb-2 font-bold">Resultado del diagnóstico:</h4>
                            <pre className="overflow-auto text-xs">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 