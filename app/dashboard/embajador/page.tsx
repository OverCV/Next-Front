"use client"

import React from 'react'

import CampanasInscritas from '@/src/components/embajador/CampanasInscritas'
import EstadisticasEmbajador from '@/src/components/embajador/EstadisticasEmbajador'
import TablaPacientes from '@/src/components/embajador/TablaPacientes'
import { useEmbajadorDashboard } from '@/src/lib/hooks/useEmbajadorDashboard'

export default function EmbajadorPage() {
    const {
        // Estados
        pacientes,
        campanasInscritas,
        estadisticas,
        error,

        // Estados de carga
        cargandoPacientes,
        cargandoCampanas,
        cargando,

        // Funciones
        recargarDatos,
        filtrarPacientes,
        obtenerColorEstadoCampana,
        formatearLocalizacion,
        cargarCampanasInscritas
    } = useEmbajadorDashboard()

    return (
        <div className="space-y-8">
            {/* Estadísticas generales */}
            <EstadisticasEmbajador
                estadisticas={estadisticas}
                cargando={cargando}
            />

            {/* Gestión de pacientes */}
            <TablaPacientes
                pacientes={pacientes}
                cargandoPacientes={cargandoPacientes}
                error={error}
                onRecargar={recargarDatos}
                filtrarPacientes={filtrarPacientes}
            />

            {/* Campañas asignadas */}
            <CampanasInscritas
                campanasInscritas={campanasInscritas}
                cargandoCampanas={cargandoCampanas}
                onRecargar={cargarCampanasInscritas}
                obtenerColorEstadoCampana={obtenerColorEstadoCampana}
                formatearLocalizacion={formatearLocalizacion}
            />
        </div>
    )
}