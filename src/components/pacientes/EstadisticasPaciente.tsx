"use client"

import React from 'react'

import { StatCard } from '@/src/components/StatCard'

interface EstadisticasPacienteProps {
    estadisticas: {
        campanasActivas: number
        campanasDisponibles: number
        triagesRealizados: number
    }
}

export default function EstadisticasPaciente({ estadisticas }: EstadisticasPacienteProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
                type="ejecucion"
                count={estadisticas.campanasActivas}
                label="Campañas Activas"
                icon="/assets/icons/calendar.svg"
            />

            <StatCard
                type="postulada"
                count={estadisticas.campanasDisponibles}
                label="Campañas Disponibles"
                icon="/assets/icons/calendar.svg"
            />

            <StatCard
                type={estadisticas.triagesRealizados > 0 ? 'ejecucion' : 'postulada'}
                count={estadisticas.triagesRealizados}
                label="Triajes Realizados"
                icon="/assets/icons/heart.svg"
            />
        </section>
    )
} 