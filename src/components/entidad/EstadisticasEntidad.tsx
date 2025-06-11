"use client"

import React from 'react'

import { StatCard } from '@/src/components/StatCard'

interface EstadisticasEntidadProps {
    estadisticas: {
        embajadoresRegistrados: number
        campanasPostuladas: number
        campanasEnEjecucion: number
    }
}

export function EstadisticasEntidad({ estadisticas }: EstadisticasEntidadProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
                type="ejecucion"
                count={estadisticas.embajadoresRegistrados}
                label="Embajadores Registrados"
                icon="/assets/icons/people.svg"
            />

            <StatCard
                type="postulada"
                count={estadisticas.campanasPostuladas}
                label="Campañas Postuladas"
                icon="/assets/icons/postulada.svg"
            />

            <StatCard
                type="ejecucion"
                count={estadisticas.campanasEnEjecucion}
                label="Campañas en Ejecución"
                icon="/assets/icons/activa.svg"
            />
        </section>
    )
} 