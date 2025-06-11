"use client"

import { AlertCircle } from 'lucide-react'
import React from 'react'

import ControlFechaBusqueda from '@/src/components/medicos/ControlFechaBusqueda'
import EstadisticasMedico from '@/src/components/medicos/EstadisticasMedico'
import TablaCampanasMedico from '@/src/components/medicos/TablaCampanasMedico'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { DashboardSkeleton } from '@/src/components/ui/skeletons'
import { useMedicoDashboard } from '@/src/lib/hooks/useMedicoDashboard'

export default function MedicoPage() {
    const {
        // Estados principales
        campanas,
        busqueda,
        setBusqueda,
        fechaSeleccionada,

        // Estados de carga
        cargandoCampanas,
        error,

        // Funciones
        cargarMisCampanas,
        irAHoy,

        // Estadísticas
        estadisticas
    } = useMedicoDashboard()

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
            <EstadisticasMedico estadisticas={estadisticas} />

            {/* Fecha y buscador */}
            <ControlFechaBusqueda
                fechaSeleccionada={fechaSeleccionada}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                irAHoy={irAHoy}
                cargarMisCampanas={cargarMisCampanas}
                cargandoCampanas={cargandoCampanas}
            />

            {/* Mis Campañas Médicas */}
            <TablaCampanasMedico
                campanas={campanas}
                cargandoCampanas={cargandoCampanas}
                cargarMisCampanas={cargarMisCampanas}
            />
        </div>
    )
}