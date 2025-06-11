"use client"

import React from 'react'

import { StatCard } from '@/src/components/StatCard'
import { EstadisticasEmbajador } from '@/src/lib/hooks/useEmbajadorDashboard'

interface EstadisticasEmbajadorProps {
    estadisticas: EstadisticasEmbajador
    cargando: boolean
}

export default function EstadisticasEmbajadorComponent({
    estadisticas,
    cargando
}: EstadisticasEmbajadorProps) {
    if (cargando) {
        return (
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-800"
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
                            <div className="space-y-2">
                                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                                <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        )
    }

    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                type="ejecucion"
                count={estadisticas.totalPacientes}
                label="Pacientes Registrados"
                icon="/assets/icons/people.svg"
            />

            <StatCard
                type="postulada"
                count={estadisticas.campanasActivas}
                label="Campañas Activas"
                icon="/assets/icons/calendar.svg"
            />

            <StatCard
                type="ejecucion"
                count={estadisticas.campanasEnEjecucion}
                label="Campañas en Ejecución"
                icon="/assets/icons/megaphone.svg"
            />

            <StatCard
                type="finalizada"
                count={estadisticas.totalInscripciones}
                label="Total Inscripciones"
                icon="/assets/icons/map-pin.svg"
            />
        </section>
    )
} 