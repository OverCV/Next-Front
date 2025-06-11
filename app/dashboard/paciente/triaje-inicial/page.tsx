"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import TriajeInicialForm from "@/src/components/forms/TriajeInicialForm"
import { ROLES, RUTAS_POR_ROL } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"

export default function TriajeInicialPage() {
    const router = useRouter()
    const { usuario, cargando, necesitaTriajeInicial } = useAuth()

    useEffect(() => {
        // Redirigir si no cumple condiciones
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

    // Mostrar loading mientras se valida
    if (cargando || !usuario) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
                    <p className="text-slate-600">Verificando acceso...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Evaluación Inicial de Salud
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Complete esta evaluación para personalizar su experiencia de salud
                    </p>
                </div>

                <TriajeInicialForm />
            </div>
        </div>
    )
} 