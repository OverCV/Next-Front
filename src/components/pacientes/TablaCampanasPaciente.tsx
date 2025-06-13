"use client"

import { Calendar, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/src/components/ui/button'
import { TableSkeleton } from '@/src/components/ui/skeletons'
import { Campana } from '@/src/types'

interface TablaCampanasPacienteProps {
    campanas: Campana[]
    cargandoCampanas: boolean
    cargarMisCampanas: () => void
}

export default function TablaCampanasPaciente({
    campanas,
    cargandoCampanas,
    cargarMisCampanas
}: TablaCampanasPacienteProps) {
    const router = useRouter()

    // Función para obtener las clases CSS del estado de la campaña
    const obtenerClasesEstado = (estado: string): string => {
        const estadoLower = estado.toLowerCase()
        
        switch (estadoLower) {
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

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Mis Campañas de Salud</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Campañas en las que está registrado actualmente.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={cargarMisCampanas}
                    disabled={cargandoCampanas}
                    className="h-8 gap-2"
                >
                    <RefreshCw className={`size-4 ${cargandoCampanas ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {cargandoCampanas ? (
                <TableSkeleton rows={5} columns={6} />
            ) : campanas.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-3 text-left font-medium">Nombre</th>
                                <th className="py-3 text-left font-medium">Descripción</th>
                                <th className="py-3 text-left font-medium">Pacientes</th>
                                <th className="py-3 text-left font-medium">Fecha Inicio</th>
                                <th className="py-3 text-left font-medium">Estado</th>
                                <th className="py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campanas.map(campana => (
                                <tr key={campana.id} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                                    <td className="py-4 font-medium text-slate-900 dark:text-slate-100">
                                        {campana.nombre}
                                    </td>
                                    <td className="max-w-md truncate py-4 text-slate-600 dark:text-slate-400">
                                        {campana.descripcion}
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {campana.pacientes || 0}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-600 dark:text-slate-400">
                                        {new Date(campana.fechaInicio).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${obtenerClasesEstado(campana.estado)}`}>
                                            {campana.estado}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() => router.push(`/dashboard/paciente/campanas/${campana.id}`)}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <Calendar className="mx-auto size-10 text-slate-400" />
                    <h3 className="mt-3 text-lg font-medium">No tiene registro en campaña alguna</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Explore las campañas disponibles y regístrese en las que le interesen.
                    </p>
                </div>
            )}
        </div>
    )
} 