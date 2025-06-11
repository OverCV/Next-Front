"use client"

import { AlertCircle } from 'lucide-react'
import React from 'react'

import ControlBusquedaAuxiliar from '@/src/components/auxiliar/ControlBusquedaAuxiliar'
import EstadisticasAuxiliar from '@/src/components/auxiliar/EstadisticasAuxiliar'
import TablaCampanasAuxiliar from '@/src/components/auxiliar/TablaCampanasAuxiliar'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { DashboardSkeleton } from '@/src/components/ui/skeletons'
import { useAuxiliarDashboard } from '@/src/lib/hooks/useAuxiliarDashboard'

export default function AuxiliarPage() {
    const {
        // Estados principales
        campanasInscritas,
        busqueda,
        setBusqueda,

        // Estados de carga
        cargandoCampanas,
        error,

        // Funciones
        cargarMisCampanas,

        // Estadísticas
        estadisticas
    } = useAuxiliarDashboard()

    // Si está cargando datos iniciales, mostrar skeleton profesional
    if (cargandoCampanas) {
        return (
            <DashboardSkeleton
                showStats
                showCards={false}
                showTable
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
            <EstadisticasAuxiliar estadisticas={estadisticas} />

            {/* Control de búsqueda */}
            <ControlBusquedaAuxiliar
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                cargarMisCampanas={cargarMisCampanas}
                cargandoCampanas={cargandoCampanas}
            />

            {/* Mis Campañas */}
            <TablaCampanasAuxiliar
                campanasInscritas={campanasInscritas}
                cargandoCampanas={cargandoCampanas}
            />
        </div>
    )
}
