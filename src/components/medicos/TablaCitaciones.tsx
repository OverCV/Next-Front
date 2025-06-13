"use client"

import { Calendar, FileText } from 'lucide-react'
import React from 'react'
import { useRouter } from "next/navigation"

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Citacion, EstadoCitacion } from '@/src/types'


interface TablaCitacionesProps {
    citaciones: Citacion[]
    onAbrirCitacion: (citacion: Citacion) => void
}

export default function TablaCitaciones({ citaciones, onAbrirCitacion }: TablaCitacionesProps) {
    // Obtener color del estado
    const obtenerColorEstado = (estado: string) => {
        switch (estado) {
            case 'AGENDADA':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            case 'ATENDIDA':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'CANCELADA':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
        }
    }

    if (citaciones.length === 0) {
        return (
            <div className="p-8 text-center">
                <Calendar className="mx-auto size-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                    No hay citaciones programadas
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                    Cuando se programen citas para esta campaña, aparecerán aquí.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Código
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Paciente
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Fecha/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Duración
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {citaciones.map(citacion => (
                        <tr key={citacion.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-700">
                                    {citacion.codigoTicket}
                                </code>
                            </td>
                            {/* <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Paciente #{citacion.pacienteId}
                                </div>
                            </td> */}
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm text-slate-900 dark:text-slate-100">
                                    {new Date(citacion.horaProgramada).toLocaleString('es-ES')}
                                </div>
                                {citacion.horaAtencion && (
                                    <div className="text-xs text-slate-500">
                                        Atendido: {new Date(citacion.horaAtencion).toLocaleString('es-ES')}
                                    </div>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <Badge className={obtenerColorEstado(citacion.estado)}>
                                    {citacion.estado}
                                </Badge>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                {citacion.duracionEstimada} min
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAbrirCitacion(citacion)}
                                    disabled={citacion.estado === EstadoCitacion.CANCELADA}
                                    className="gap-2"
                                >
                                    <FileText className="size-4" />
                                    {
                                        citacion.estado === EstadoCitacion.ATENDIDA ? 'Ver Atención' :
                                            citacion.estado === EstadoCitacion.CANCELADA ? 'Cancelada' : 'Atender'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 