"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { InscripcionCompleta } from '@/src/services/domain/inscripciones.service'

interface TablaCampanasAuxiliarProps {
    campanasInscritas: InscripcionCompleta[]
    cargandoCampanas: boolean
}

export default function TablaCampanasAuxiliar({
    campanasInscritas,
    cargandoCampanas
}: TablaCampanasAuxiliarProps) {
    const router = useRouter()

    const obtenerColorEstado = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'postulada':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            case 'ejecucion':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'finalizada':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            default:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES')
    }

    if (cargandoCampanas) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (campanasInscritas.length === 0) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">No tienes campañas asignadas actualmente</p>
                <p className="text-slate-400 text-sm mt-2">
                    Las campañas aparecerán aquí cuando seas inscrito por una entidad de salud
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-3 px-4 text-left font-medium">Campaña</th>
                            <th className="py-3 px-4 text-left font-medium">Estado</th>
                            <th className="py-3 px-4 text-left font-medium">Fecha Inicio</th>
                            <th className="py-3 px-4 text-left font-medium">Inscrito Desde</th>
                            <th className="py-3 px-4 text-right font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campanasInscritas.map((item) => (
                            <tr key={item.campana.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-medium text-slate-900">{item.campana.nombre}</p>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                                            {item.campana.descripcion}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge className={obtenerColorEstado(item.campana.estado)}>
                                        {item.campana.estado}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4 text-slate-600">
                                    {formatearFecha(item.campana.fechaInicio)}
                                </td>
                                <td className="py-4 px-4 text-slate-600">
                                    {formatearFecha(item.inscripcion.fechaInscripcion)}
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="transition-colors hover:bg-slate-100"
                                        onClick={() => router.push(`/dashboard/auxiliar/campana/${item.campana.id}`)}
                                        disabled={item.campana.estado !== 'EJECUCION'}
                                    >
                                        {item.campana.estado === 'EJECUCION' ? 'Ver Pacientes' : 'No Disponible'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 