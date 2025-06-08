"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import TriajeInicialForm from "@/src/components/forms/TriajeInicialForm"
import { Button } from "@/src/components/ui/button"
import { ROLES, RUTAS_POR_ROL } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"

/* 
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import TriajeInicialForm from "@/src/components/forms/TriajeInicialForm";
import { ROLES, RUTAS_POR_ROL } from "@/src/constants";
import { useAuth } from "@/src/providers/auth-provider";

export default function TriajeInicialPage() {
    const router = useRouter();
    const { usuario, cargando, necesitaTriajeInicial } = useAuth();

    useEffect(() => {
        // Redirigir si:
        // 1. No hay usuario
        // 2. No es paciente
        // 3. Ya completó su triaje
        if (!cargando) {
            if (!usuario) {
                router.push("/acceso");
            } else if (usuario.rolId !== ROLES.PACIENTE) {
                router.push(RUTAS_POR_ROL[usuario.rolId]);
            } else if (!necesitaTriajeInicial) {
                router.push("/dashboard/paciente");
            }
        }
    }, [cargando, usuario, router, necesitaTriajeInicial]);

    if (cargando || !usuario) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-center text-2xl font-bold">
                    Evaluación Inicial de Salud
                </h1>
                <TriajeInicialForm />
            </div>
        </div>
    );
}
*/


export default function TriajeInicialPage() {
    const router = useRouter()
    const { usuario, cargando, necesitaTriajeInicial } = useAuth()
    const [debug, setDebug] = useState<boolean>(false)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    useEffect(() => {
        if (!cargando) {
            if (!usuario) {
                router.push("/acceso")
            } else if (usuario.rolId !== ROLES.PACIENTE) {
                router.push(RUTAS_POR_ROL[usuario.rolId])
            } else if (!necesitaTriajeInicial) {
                router.push("/dashboard/paciente")
            }
        }
    }, [cargando, usuario, router, necesitaTriajeInicial])

    const ejecutarDiagnostico = async () => {
        setDebug(true)
        setDebugInfo({ estado: "Ejecutando diagnóstico..." })

        try {
            if (usuario?.id) {
                // Simulamos un resultado simple
                setDebugInfo({ resultado: "Diagnóstico completado", usuario: usuario.id })
            } else {
                setDebugInfo({ error: "No hay usuario con ID" })
            }
        } catch (error) {
            setDebugInfo({ error: String(error) })
        }
    }

    // const simularTriajeCompletado = () => {
    //     // Esta función simplemente marca el triaje como completado para pruebas
    //     setNecesitaTriajeInicial(false)

    //     setTimeout(() => {
    //         router.push("/dashboard/paciente")
    //     }, 300)
    // }

    if (cargando || !usuario) {
        return <div>Cargando...</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-center text-2xl font-bold">
                    Triaje Inicial
                </h1>

                <TriajeInicialForm />

                <div className="mt-8 flex justify-center">
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
        </div>
    )
} 