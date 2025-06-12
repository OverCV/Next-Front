"use client"

import { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { prediccionesService } from '@/src/services/domain/predicciones.service'

interface Citacion {
    id: number
    campana_id: number
    nombre_campana: string
    descripcion_campana?: string
    hora_programada: string
    fecha_formateada: string
    hora_formateada: string
    dia_semana: string
    duracion_estimada: number
    estado: 'AGENDADA' | 'ATENDIDA' | 'CANCELADA'
    nombre_medico?: string
    codigo_ticket?: string
    notas?: string
    nivel_prioridad?: string
}

interface CitacionesPacienteProps {
    pacienteId: number
}

export default function CitacionesPaciente({ pacienteId }: CitacionesPacienteProps) {
    const [citaciones, setCitaciones] = useState<Citacion[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const cargarCitaciones = async () => {
            if (!pacienteId) return

            try {
                setCargando(true)
                setError(null)
                
                const response = await prediccionesService.obtenerCitacionesPaciente(pacienteId)
                setCitaciones(response.citaciones || [])
                
            } catch (err: any) {
                console.error('Error al cargar citaciones:', err)
                setError('No se pudieron cargar las citaciones')
            } finally {
                setCargando(false)
            }
        }

        cargarCitaciones()
    }, [pacienteId])

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'AGENDADA':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Programada
                </Badge>
            case 'ATENDIDA':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Atendida
                </Badge>
            case 'CANCELADA':
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    <XCircle className="w-3 h-3 mr-1" />
                    Cancelada
                </Badge>
            default:
                return <Badge variant="secondary">{estado}</Badge>
        }
    }

    const getPrioridadBadge = (prioridad?: string) => {
        if (!prioridad) return null
        
        switch (prioridad) {
            case 'CRÍTICA':
                return <Badge className="bg-red-500 text-white">Crítica</Badge>
            case 'ALTA':
                return <Badge className="bg-orange-500 text-white">Alta</Badge>
            case 'MEDIA':
                return <Badge className="bg-yellow-500 text-white">Media</Badge>
            case 'BAJA':
                return <Badge className="bg-green-500 text-white">Baja</Badge>
            default:
                return <Badge variant="outline">{prioridad}</Badge>
        }
    }

    if (cargando) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Mis Citaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Mis Citaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 py-8">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-center text-slate-600 dark:text-slate-400">{error}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (citaciones.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Mis Citaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Calendar className="w-12 h-12 text-slate-400" />
                        <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                                No tienes citaciones programadas
                            </p>
                            <p className="text-sm text-slate-500">
                                Las citaciones se generarán automáticamente después de completar tu triaje inicial
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Separar citaciones por estado
    const citacionesActivas = citaciones.filter(c => c.estado === 'AGENDADA')
    const citacionesHistoricas = citaciones.filter(c => c.estado !== 'AGENDADA')

    return (
        <div className="space-y-6">
            {/* Citaciones Activas */}
            {citacionesActivas.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Citaciones Próximas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {citacionesActivas.map((citacion) => (
                            <div key={citacion.id} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{citacion.nombre_campana}</h3>
                                        {citacion.descripcion_campana && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {citacion.descripcion_campana}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {getEstadoBadge(citacion.estado)}
                                        {getPrioridadBadge(citacion.nivel_prioridad)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">{citacion.fecha_formateada}</span>
                                        <span className="text-slate-600">{citacion.dia_semana}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span>{citacion.hora_formateada}</span>
                                        <span className="text-sm text-slate-500">
                                            ({citacion.duracion_estimada} min)
                                        </span>
                                    </div>

                                    {citacion.nombre_medico && (
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-600" />
                                            <span>{citacion.nombre_medico}</span>
                                        </div>
                                    )}

                                    {citacion.codigo_ticket && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                Ticket: {citacion.codigo_ticket}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {citacion.notas && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            <strong>Notas:</strong> {citacion.notas}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Historial de Citaciones */}
            {citacionesHistoricas.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Historial de Citaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {citacionesHistoricas.slice(0, 5).map((citacion) => (
                            <div key={citacion.id} className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{citacion.nombre_campana}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {citacion.fecha_formateada} a las {citacion.hora_formateada}
                                        </p>
                                    </div>
                                    {getEstadoBadge(citacion.estado)}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
} 