"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import TriajeInicialForm from "@/src/components/forms/TriajeInicialForm"
import { ROLES, RUTAS_POR_ROL } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"

export default function TriajeInicialPacientePage() {
    const router = useRouter()
    const { usuario, cargando, necesitaTriajeInicial } = useAuth()

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

    if (cargando || !usuario) {
        return <div>Cargando...</div>
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
    )
} 