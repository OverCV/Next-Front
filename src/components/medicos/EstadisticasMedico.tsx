"use client"

import React from 'react'

import { StatCard } from '@/src/components/StatCard'

interface EstadisticasMedicoProps {
    estadisticas: {
        campanasActivas: number
        totalCampanas: number
        pacientesAtendidosHoy: number
        citasPendientes: number
    }
}

export default function EstadisticasMedico({ estadisticas }: EstadisticasMedicoProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                count={estadisticas.pacientesAtendidosHoy}
                label="Pacientes Atendidos Hoy"
                icon="/assets/icons/user.svg"
            />

            <StatCard
                type="postulada"
                count={estadisticas.citasPendientes}
                label="Citas Pendientes"
                icon="/assets/icons/appointments.svg"
            />
        </section>
    )
} 