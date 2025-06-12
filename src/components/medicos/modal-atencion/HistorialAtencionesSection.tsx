"use client"

import { Clock, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { atencionesService } from '@/src/services/domain/atenciones.service'
import { AtencionMedica, EstadoAtencion } from '@/src/types'

interface HistorialAtencionesSectionProps {
    citacionId: number
}

export function HistorialAtencionesSection({ citacionId }: HistorialAtencionesSectionProps) {
    const [atencionActual, setAtencionActual] = useState<AtencionMedica | null>(null)
    const [cargandoAtencion, setCargandoAtencion] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Cargar atención médica de esta citación
    useEffect(() => {
        const cargarAtencionMedica = async () => {
            setCargandoAtencion(true)
            setError(null)

            try {
                const atencion = await atencionesService.obtenerAtencionPorCitacion(citacionId)
                setAtencionActual(atencion)
                console.log('✅ Atención médica cargada:', atencion)
            } catch (err: any) {
                if (err.response?.status === 404) {
                    // No existe atención para esta citación, es normal
                    setAtencionActual(null)
                } else {
                    console.error('❌ Error al cargar atención médica:', err)
                    setError('Error al cargar información de la atención')
                }
            } finally {
                setCargandoAtencion(false)
            }
        }

        cargarAtencionMedica()
    }, [citacionId])

    // Función para obtener el ícono del estado
    const obtenerIconoEstado = (estado: EstadoAtencion) => {
        switch (estado) {
            case EstadoAtencion.EN_PROCESO:
                return <Clock className="size-5 text-blue-500" />
            case EstadoAtencion.COMPLETADA:
                return <CheckCircle className="size-5 text-green-500" />
            case EstadoAtencion.CANCELADA:
                return <XCircle className="size-5 text-red-500" />
            default:
                return <AlertCircle className="size-5 text-gray-500" />
        }
    }

    // Función para obtener las clases del badge del estado
    const obtenerClasesEstado = (estado: EstadoAtencion): string => {
        switch (estado) {
            case EstadoAtencion.EN_PROCESO:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            case EstadoAtencion.COMPLETADA:
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case EstadoAtencion.CANCELADA:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }

    // Función para obtener el texto del estado
    const obtenerTextoEstado = (estado: EstadoAtencion): string => {
        switch (estado) {
            case EstadoAtencion.EN_PROCESO:
                return 'En Proceso'
            case EstadoAtencion.COMPLETADA:
                return 'Completada'
            case EstadoAtencion.CANCELADA:
                return 'Cancelada'
            default:
                return estado
        }
    }

    // Función para formatear duración
    const formatearDuracion = (minutos: number): string => {
        if (minutos < 60) {
            return `${minutos} min`
        }
        const horas = Math.floor(minutos / 60)
        const minutosRestantes = minutos % 60
        return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`
    }

    // Función para formatear fecha
    const formatearFecha = (fecha: string): string => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (cargandoAtencion) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="size-5" />
                        Historial de Atención Médica
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
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
                        <FileText className="size-5" />
                        Historial de Atención Médica
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="size-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!atencionActual) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="size-5" />
                        Historial de Atención Médica
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Clock className="mx-auto size-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-medium text-slate-900">No hay atención médica registrada</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            La atención médica aparecerá aquí una vez que se inicie.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Historial de Atención Médica
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Información general de la atención */}
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {obtenerIconoEstado(atencionActual.estado)}
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                Estado de la Atención
                            </h3>
                        </div>
                        <Badge className={obtenerClasesEstado(atencionActual.estado)}>
                            {obtenerTextoEstado(atencionActual.estado)}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Fecha y Hora de Inicio</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {formatearFecha(atencionActual.fechaHoraInicio)}
                            </p>
                        </div>

                        {atencionActual.fechaHoraFin && (
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Fecha y Hora de Fin</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {formatearFecha(atencionActual.fechaHoraFin)}
                                </p>
                            </div>
                        )}

                        {atencionActual.duracionReal && (
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Duración Real</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {formatearDuracion(atencionActual.duracionReal)}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">ID de Atención</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                #{atencionActual.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resumen de tiempo */}
                {atencionActual.estado === EstadoAtencion.EN_PROCESO && (
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                Atención en curso
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                            La atención médica se encuentra actualmente en proceso.
                        </p>
                    </div>
                )}

                {atencionActual.estado === EstadoAtencion.COMPLETADA && (
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="size-4 text-green-600" />
                            <p className="text-sm font-medium text-green-900 dark:text-green-300">
                                Atención completada exitosamente
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                            La atención médica ha sido finalizada correctamente.
                        </p>
                    </div>
                )}

                {atencionActual.estado === EstadoAtencion.CANCELADA && (
                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex items-center gap-2">
                            <XCircle className="size-4 text-red-600" />
                            <p className="text-sm font-medium text-red-900 dark:text-red-300">
                                Atención cancelada
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            La atención médica fue cancelada antes de completarse.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 