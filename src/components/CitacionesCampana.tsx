"use client"

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { File, FileText, Clock, User, RefreshCw, Badge } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { Citacion } from '@/src/types'


type CitacionesCampanaProps = {
    citaciones: Citacion[]
    cargando: boolean
    onAtender?: (citacionId: number) => void
    onVerHistorial: (pacienteId: number) => void
    soloHistorial?: boolean
}

export default function CitacionesCampana({
    citaciones,
    cargando,
    onAtender,
    onVerHistorial,
    soloHistorial = false
}: CitacionesCampanaProps) {

    // Función para formatear hora
    const formatearHora = (fecha: string) => {
        try {
            return format(new Date(fecha), 'HH:mm', { locale: es })
        } catch (error) {
            console.error('Error al formatear hora:', error)
            return 'Hora no disponible'
        }
    }

    // Obtener nivel de prioridad (1-5)
    const obtenerClasePrioridad = (prioridad: number) => {
        switch (prioridad) {
            case 1: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 4: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
            case 5: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }

    // Obtener clase para el estado
    const obtenerClaseEstado = (estado: string) => {
        console.log("🔄 Estado llegada:", estado)
        switch (estado) {
            case 'AGENDADA': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            case 'ATENDIDA': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'CANCELADA': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }

    if (cargando) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <div className="flex flex-col items-center">
                    <RefreshCw className="size-10 animate-spin text-slate-400" />
                    <p className="mt-4 text-slate-500">Cargando citaciones...</p>
                </div>
            </div>
        )
    }

    if (citaciones.length === 0) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                <Calendar className="size-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-medium">No hay citaciones para mostrar</h3>
                <p className="mt-1 text-sm text-slate-500">
                    {soloHistorial ?
                        'No hay pacientes atendidos para esta fecha.' :
                        'No hay citaciones programadas para esta fecha.'}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="py-3 text-left font-medium">Hora</th>
                        <th className="py-3 text-left font-medium">Paciente</th>
                        <th className="py-3 text-left font-medium">Razón</th>
                        <th className="py-3 text-left font-medium">Estado</th>
                        <th className="py-3 text-left font-medium">Prioridad</th>
                        <th className="py-3 text-left font-medium">Prob. Asistencia</th>
                        <th className="py-3 text-right font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {citaciones.map((citacion) => (
                        <tr
                            key={citacion.id}
                            className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                        >
                            <td className="py-3">
                                <div className="flex items-center space-x-2">
                                    <Clock className="size-4 text-slate-400" />
                                    <span>{formatearHora(citacion.horaProgramada)}</span>
                                </div>
                            </td>
                            <td className="py-3">
                                <div className="flex items-center space-x-2">
                                    <User className="size-4 text-slate-400" />
                                    <div>
                                        <p className="font-medium">
                                            {citacion.pacienteId}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {citacion.pacienteId}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="max-w-[200px] py-3 text-sm">
                                <p className="truncate">{citacion.notas + '?' || 'Sin especificar'}</p>
                            </td>
                            <td className="py-3">
                                <Badge className={obtenerClaseEstado(citacion.estado)}>
                                    {citacion.estado === 'AGENDADA' ? 'Pendiente' :
                                        citacion.estado === 'ATENDIDA' ? 'Atendido' : 'Cancelado'}
                                </Badge>
                            </td>
                            <td className="py-3">
                                <Badge className={obtenerClasePrioridad(citacion.prioridad)}>
                                    {citacion.prioridad}
                                </Badge>
                            </td>
                            <td className="py-3">
                                <div className="flex items-center space-x-2">
                                    <div className="h-2 w-full max-w-[100px] rounded-full bg-slate-200 dark:bg-slate-700">
                                        <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{ width: `${citacion.prediccionAsistencia || 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm">{Math.round(citacion.prediccionAsistencia || 0)}%</span>
                                </div>
                            </td>
                            <td className="py-3 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onVerHistorial(citacion.pacienteId)}
                                        title="Ver historial"
                                    >
                                        <FileText className="size-4" />
                                    </Button>

                                    {!soloHistorial && citacion.estado === 'AGENDADA' && onAtender && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => onAtender(citacion.id)}
                                            title="Iniciar atención"
                                        >
                                            Atender
                                        </Button>
                                    )}

                                    {citacion.estado === 'ATENDIDA' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`/dashboard/medico/diagnostico/${citacion.id}`, '_blank')}
                                            title="Ver diagnóstico"
                                        >
                                            <File className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Calendar icon component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}