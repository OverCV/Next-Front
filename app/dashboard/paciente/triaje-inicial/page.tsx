"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ROLES, RUTAS_POR_ROL } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { testFlujoPerfilTriaje } from "@/src/utils/debug"

export default function TriajeInicialPage() {
    const router = useRouter()
    const { usuario, cargando, necesitaTriajeInicial, necesitaCompletarPerfil, setNecesitaTriajeInicial } = useAuth()
    const [debug, setDebug] = useState<boolean>(false)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    useEffect(() => {
        if (!cargando) {
            if (!usuario) {
                router.push("/acceso")
            } else if (usuario.rolId !== ROLES.PACIENTE) {
                router.push(RUTAS_POR_ROL[usuario.rolId])
            } else if (necesitaCompletarPerfil) {
                router.push("/dashboard/paciente/completar-perfil")
            } else if (!necesitaTriajeInicial) {
                router.push("/dashboard/paciente")
            }
        }
    }, [cargando, usuario, router, necesitaTriajeInicial, necesitaCompletarPerfil])

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

    const simularTriajeCompletado = () => {
        // Esta función simplemente marca el triaje como completado para pruebas
        setNecesitaTriajeInicial(false)

        setTimeout(() => {
            router.push("/dashboard/paciente")
        }, 300)
    }

    if (cargando || !usuario) {
        return <div>Cargando...</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-center text-2xl font-bold">
                    Triaje Inicial
                </h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Triaje Inicial del Paciente</CardTitle>
                        <CardDescription>
                            Completa este cuestionario para que podamos conocer tu estado de salud
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert className="mb-6">
                            <AlertTitle>En construcción</AlertTitle>
                            <AlertDescription>
                                Esta funcionalidad está en desarrollo. Pronto podrás completar tu triaje inicial.
                            </AlertDescription>
                        </Alert>

                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-center space-x-4">
                                <Button
                                    onClick={() => router.push("/dashboard/paciente")}
                                    variant="outline"
                                >
                                    Volver al inicio
                                </Button>

                                <Button
                                    onClick={simularTriajeCompletado}
                                >
                                    Simular triaje completado
                                </Button>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={ejecutarDiagnostico}
                                    className="text-xs"
                                >
                                    🔍 Diagnosticar Estado
                                </Button>
                            </div>

                            {debug && debugInfo && (
                                <div className="mt-4 rounded-md bg-gray-100 p-4 text-left text-xs">
                                    <h4 className="mb-2 font-bold">Resultado del diagnóstico:</h4>
                                    <pre className="overflow-auto text-xs">
                                        {JSON.stringify(debugInfo, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 