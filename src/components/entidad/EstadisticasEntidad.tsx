"use client"

import { Stethoscope } from "lucide-react"
import React from 'react'

import { StatCard } from '@/src/components/StatCard'

interface EstadisticasEntidadProps {
    estadisticas: {
        embajadoresRegistrados: number
        auxiliaresRegistrados: number
        medicosRegistrados: number
        campanasPostuladas: number
        campanasEnEjecucion: number
    }
}

export function EstadisticasEntidad({ estadisticas }: EstadisticasEntidadProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
                type="ejecucion"
                count={estadisticas.embajadoresRegistrados}
                label="Embajadores Registrados"
                icon="/assets/icons/people.svg"
            />

            <StatCard
                type="ejecucion"
                count={estadisticas.auxiliaresRegistrados}
                label="Auxiliares Registrados"
                icon="/assets/icons/user.svg"
            />

            <StatCard
                type="ejecucion"
                count={estadisticas.medicosRegistrados}
                label="Médicos Registrados"
                icon={<Stethoscope size={24} />}
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