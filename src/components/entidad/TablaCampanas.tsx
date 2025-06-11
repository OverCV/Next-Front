"use client"

import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { Campana } from '@/src/types'

interface TablaCampanasProps {
    campanas: Campana[]
}

export function TablaCampanas({ campanas }: TablaCampanasProps) {
    const router = useRouter()

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Campañas de Salud</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Campañas postuladas por esta entidad de salud
                </p>
            </div>

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
                            <tr
                                key={campana.id}
                                className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                            >
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
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campana.estado.toLowerCase() === 'postulada'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : campana.estado.toLowerCase() === 'ejecucion'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : campana.estado.toLowerCase() === 'finalizada'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}
                                    >
                                        {campana.estado}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                        onClick={() => router.push(`/dashboard/entidad/campanas/${campana.id}`)}
                                    >
                                        Ver Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {campanas.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-slate-500">
                                    No hay campañas postuladas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 