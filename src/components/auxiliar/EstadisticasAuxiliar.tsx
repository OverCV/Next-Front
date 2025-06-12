"use client"

import React from 'react'

import { StatCard } from '@/src/components/StatCard'

interface EstadisticasAuxiliarProps {
    estadisticas: {
        campanasActivas: number
        totalCampanas: number
        campanasEnEjecucion: number
    }
}

export default function EstadisticasAuxiliar({ estadisticas }: EstadisticasAuxiliarProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
                type="ejecucion"
                count={estadisticas.campanasActivas}
                label="Campañas Activas"
                icon="/assets/icons/activa.svg"
            />

            <StatCard
                type="postulada"
                count={estadisticas.totalCampanas}
                label="Total Campañas"
                icon="/assets/icons/postulada.svg"
            />

            <StatCard
                type="ejecucion"
                count={estadisticas.campanasEnEjecucion}
                label="Campañas en Ejecución"
                icon="/assets/icons/megaphone.svg"
            />
        </section>
    )
} 