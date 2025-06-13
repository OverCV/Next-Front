"use client"

import { RefreshCw } from 'lucide-react'

export function LoadingModal() {
    return (
        <div className="flex h-96 items-center justify-center">
            <div className="text-center">
                <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                <p className="mt-2 text-slate-500">Cargando información del paciente...</p>
            </div>
        </div>
    )
} 