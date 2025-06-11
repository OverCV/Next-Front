"use client"

import { AlertCircle } from 'lucide-react'
import React from 'react'

import EstadisticasPaciente from '@/src/components/pacientes/EstadisticasPaciente'
import TablaCampanasPaciente from '@/src/components/pacientes/TablaCampanasPaciente'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { DashboardSkeleton } from '@/src/components/ui/skeletons'
import { usePacienteDashboard } from '@/src/lib/hooks/usePacienteDashboard'

export default function PacientePage() {
    const {
        // Estados principales
        campanas,

        // Estados de carga
        cargandoTriaje,
        cargandoCampanas,
        cargandoPaciente,
        error,

        // Funciones
        cargarMisCampanas,

        // Estadísticas
        estadisticas
    } = usePacienteDashboard()

    // Si está cargando datos iniciales, mostrar skeleton profesional
    if (cargandoPaciente || (cargandoTriaje && !error)) {
        return (
            <DashboardSkeleton
                showStats
                showCards
                showTable={false}
            />
        )
    }

    return (
        <div className="space-y-8">
            {/* Mensajes de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Estadísticas */}
            <EstadisticasPaciente estadisticas={estadisticas} />

            {/* Mis Campañas */}
            <TablaCampanasPaciente
                campanas={campanas}
                cargandoCampanas={cargandoCampanas}
                cargarMisCampanas={cargarMisCampanas}
            />
        </div>
    )
}