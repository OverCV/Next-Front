"use client"

import { useState, useEffect } from 'react'
import { X, AlertTriangle, Stethoscope, Clock, Users, TrendingUp, Loader2 } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Campana } from '@/src/types'
import { prediccionesService } from '@/src/services/domain/predicciones.service'

interface ModalDetallesCampanaProps {
    campana: Campana
    isOpen: boolean
    onClose: () => void
}

interface PacientePriorizado {
    paciente_id: number
    nombre_paciente: string
    nivel_prioridad: string
    nivel_riesgo: string
    valor_riesgo_cv: number
    puntuacion: number
    factores_riesgo: Array<{
        factor: string
        valor: number
        detalle?: string
    }>
}

interface PriorizacionData {
    mensaje: string
    campana_id: number
    total_pacientes: number
    distribución_por_nivel: Record<string, number>
    citaciones_automaticas: boolean
    pacientes_priorizados: PacientePriorizado[]
}

export function ModalDetallesCampana({ campana, isOpen, onClose }: ModalDetallesCampanaProps) {
    const [priorizacionData, setPriorizacionData] = useState<PriorizacionData | null>(null)
    const [cargandoPriorizacion, setCargandoPriorizacion] = useState(false)
    const [generandoPriorizacion, setGenerandoPriorizacion] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Cargar priorización al abrir el modal
    useEffect(() => {
        if (isOpen && campana.id) {
            cargarPriorizacion()
        }
    }, [isOpen, campana.id])

    const cargarPriorizacion = async () => {
        setCargandoPriorizacion(true)
        setError(null)
        try {
            console.log('🔍 Cargando priorización para campaña:', campana.id)
            const data = await prediccionesService.obtenerPacientesPriorizados(campana.id)
            
            // Si no hay datos de priorización, mostrar mensaje apropiado
            if (!data || data.length === 0) {
                setPriorizacionData({
                    mensaje: 'No hay priorización generada para esta campaña',
                    campana_id: campana.id,
                    total_pacientes: 0,
                    distribución_por_nivel: {},
                    citaciones_automaticas: false,
                    pacientes_priorizados: []
                })
            } else {
                // Procesar datos de priorización
                const distribucion = data.reduce((acc: Record<string, number>, paciente: PacientePriorizado) => {
                    acc[paciente.nivel_prioridad] = (acc[paciente.nivel_prioridad] || 0) + 1
                    return acc
                }, {})

                setPriorizacionData({
                    mensaje: 'Priorización cargada exitosamente',
                    campana_id: campana.id,
                    total_pacientes: data.length,
                    distribución_por_nivel: distribucion,
                    citaciones_automaticas: false,
                    pacientes_priorizados: data
                })
            }
        } catch (error) {
            console.error('❌ Error al cargar priorización:', error)
            setError('Error al cargar la priorización de pacientes')
            setPriorizacionData(null)
        } finally {
            setCargandoPriorizacion(false)
        }
    }

    const generarPriorizacionManual = async () => {
        setGenerandoPriorizacion(true)
        setError(null)
        try {
            console.log('🔧 Generando priorización manual para campaña:', campana.id)
            const resultado = await prediccionesService.generarPriorizacionManual(campana.id)
            
            // Actualizar datos con el resultado
            setPriorizacionData(resultado)
            
            // Mostrar mensaje de éxito
            console.log('✅ Priorización generada:', resultado.mensaje)
        } catch (error) {
            console.error('❌ Error al generar priorización:', error)
            setError('Error al generar la priorización manual')
        } finally {
            setGenerandoPriorizacion(false)
        }
    }

    const obtenerColorPrioridad = (nivel: string): string => {
        switch (nivel) {
            case 'CRÍTICA':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'ALTA':
                return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'MEDIA':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'BAJA':
                return 'bg-green-100 text-green-800 border-green-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const obtenerColorRiesgo = (nivel: string): string => {
        switch (nivel) {
            case 'CRITICO':
                return 'bg-red-500 text-white'
            case 'ALTO':
                return 'bg-orange-500 text-white'
            case 'MODERADO':
                return 'bg-yellow-500 text-white'
            case 'BAJO':
                return 'bg-green-500 text-white'
            default:
                return 'bg-gray-500 text-white'
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Detalles de Campaña
                        </h2>
                        <p className="text-sm text-gray-500">{campana.nombre}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                    {/* Información de la Campaña */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Descripción</label>
                                <p className="text-sm text-gray-900">{campana.descripcion}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha de Inicio</label>
                                <p className="text-sm text-gray-900">
                                    {new Date(campana.fechaInicio).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado</label>
                                <div className="mt-1">
                                    <Badge variant="secondary">{campana.estado}</Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Pacientes Inscritos</label>
                                <p className="text-sm text-gray-900">{campana.pacientes || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Priorización */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Priorización de Pacientes
                            </h3>
                            <Button
                                onClick={generarPriorizacionManual}
                                disabled={generandoPriorizacion}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {generandoPriorizacion ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        Generar Priorización
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Estado de carga */}
                        {cargandoPriorizacion && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                <span className="ml-2 text-sm text-gray-600">Cargando priorización...</span>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resumen de Priorización */}
                        {priorizacionData && !cargandoPriorizacion && (
                            <div className="space-y-6">
                                {/* Estadísticas */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <div className="flex items-center">
                                            <Users className="h-8 w-8 text-blue-600" />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-blue-600">Total Pacientes</p>
                                                <p className="text-2xl font-bold text-blue-900">
                                                    {priorizacionData.total_pacientes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-lg bg-green-50 p-4">
                                        <div className="flex items-center">
                                            <Stethoscope className="h-8 w-8 text-green-600" />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-green-600">Priorizados</p>
                                                <p className="text-2xl font-bold text-green-900">
                                                    {priorizacionData.pacientes_priorizados.length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-purple-50 p-4">
                                        <div className="flex items-center">
                                            <Clock className="h-8 w-8 text-purple-600" />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-purple-600">Citaciones Auto</p>
                                                <p className="text-2xl font-bold text-purple-900">
                                                    {priorizacionData.citaciones_automaticas ? 'Sí' : 'No'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Distribución por Nivel */}
                                {Object.keys(priorizacionData.distribución_por_nivel).length > 0 && (
                                    <div>
                                        <h4 className="mb-3 text-md font-medium text-gray-900">
                                            Distribución por Nivel de Prioridad
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                            {Object.entries(priorizacionData.distribución_por_nivel).map(([nivel, cantidad]) => (
                                                <div key={nivel} className={`rounded-lg border p-3 text-center ${obtenerColorPrioridad(nivel)}`}>
                                                    <p className="text-sm font-medium">{nivel}</p>
                                                    <p className="text-xl font-bold">{cantidad}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Lista de Pacientes Priorizados */}
                                {priorizacionData.pacientes_priorizados.length > 0 && (
                                    <div>
                                        <h4 className="mb-3 text-md font-medium text-gray-900">
                                            Pacientes Priorizados
                                        </h4>
                                        <div className="max-h-64 overflow-y-auto rounded-lg border">
                                            <table className="w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                            Paciente
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                            Prioridad
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                            Riesgo CV
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                            Puntuación
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {priorizacionData.pacientes_priorizados.map((paciente) => (
                                                        <tr key={paciente.paciente_id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {paciente.nombre_paciente}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={obtenerColorPrioridad(paciente.nivel_prioridad)}
                                                                >
                                                                    {paciente.nivel_prioridad}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <Badge className={obtenerColorRiesgo(paciente.nivel_riesgo)}>
                                                                    {paciente.nivel_riesgo}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {Math.round(paciente.puntuacion)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Mensaje cuando no hay pacientes */}
                                {priorizacionData.total_pacientes === 0 && (
                                    <div className="text-center py-8">
                                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No hay pacientes priorizados
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Genera una priorización para ver los pacientes de esta campaña.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 