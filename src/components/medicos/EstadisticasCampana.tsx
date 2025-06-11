"use client"

import { Calendar, Clock, User, Activity } from 'lucide-react'
import React from 'react'

import { CitacionMedica } from '@/src/services/domain/medicos.service'

interface EstadisticasCampanaProps {
    citaciones: CitacionMedica[]
}

export default function EstadisticasCampana({ citaciones }: EstadisticasCampanaProps) {
    const totalCitas = citaciones.length
    const citasProgramadas = citaciones.filter(c => c.estado === 'PROGRAMADA').length
    const citasAtendidas = citaciones.filter(c => c.estado === 'ATENDIDA').length
    const pacientesUnicos = new Set(citaciones.map(c => c.pacienteId)).size

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-blue-500" />
                    <span className="text-sm font-medium">Total Citas</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{totalCitas}</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex items-center gap-2">
                    <Clock className="size-5 text-yellow-500" />
                    <span className="text-sm font-medium">Programadas</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{citasProgramadas}</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex items-center gap-2">
                    <Activity className="size-5 text-green-500" />
                    <span className="text-sm font-medium">Atendidas</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{citasAtendidas}</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex items-center gap-2">
                    <User className="size-5 text-purple-500" />
                    <span className="text-sm font-medium">Pacientes Únicos</span>
                </div>
                <p className="mt-1 text-2xl font-bold">{pacientesUnicos}</p>
            </div>
        </div>
    )
} 