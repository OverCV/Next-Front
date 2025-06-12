"use client"

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { 
    Users, 
    Stethoscope, 
    Clock, 
    Calendar,
    CheckCircle,
    XCircle,
    RefreshCw,
    AlertTriangle,
    Loader2,
    Heart,
    Activity
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { prediccionesService } from '@/src/services/domain/predicciones.service'
import { Citacion, EstadoCitacion } from '@/src/types'

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

interface CitacionConPrioridad extends Citacion {
    pacientePriorizado?: PacientePriorizado
}

interface TablaCitacionesPriorizadasMedicoProps {
    campanaId: number
    campanaNombre: string
}

export function TablaCitacionesPriorizadasMedico({ campanaId, campanaNombre }: TablaCitacionesPriorizadasMedicoProps) {
    const [citaciones, setCitaciones] = useState<CitacionConPrioridad[]>([])
    const [pacientesPriorizados, setPacientesPriorizados] = useState<PacientePriorizado[]>([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [atendiendoCitacion, setAtendiendoCitacion] = useState<number | null>(null)

    useEffect(() => {
        cargarDatos()
    }, [campanaId])

    const cargarDatos = async () => {
        setCargando(true)
        setError(null)
        try {
            // Cargar citaciones y priorización en paralelo
            const [citacionesData, priorizacionData] = await Promise.all([
                citacionesService.obtenerCitacionesPorCampana(campanaId),
                prediccionesService.obtenerPacientesPriorizados(campanaId)
            ])

            setPacientesPriorizados(priorizacionData || [])

            // Combinar citaciones con datos de priorización
            const citacionesConPrioridad = citacionesData.map(citacion => {
                const pacientePriorizado = priorizacionData?.find(p => p.paciente_id === citacion.pacienteId)
                return {
                    ...citacion,
                    pacientePriorizado
                }
            })

            // Ordenar por prioridad (CRÍTICA > ALTA > MEDIA > BAJA)
            const ordenPrioridad = { 'CRÍTICA': 0, 'ALTA': 1, 'MEDIA': 2, 'BAJA': 3 }
            citacionesConPrioridad.sort((a, b) => {
                const prioridadA = a.pacientePriorizado?.nivel_prioridad || 'BAJA'
                const prioridadB = b.pacientePriorizado?.nivel_prioridad || 'BAJA'
                return (ordenPrioridad[prioridadA as keyof typeof ordenPrioridad] || 3) - 
                       (ordenPrioridad[prioridadB as keyof typeof ordenPrioridad] || 3)
            })

            setCitaciones(citacionesConPrioridad)
        } catch (error) {
            console.error('Error cargando datos:', error)
            setError('Error al cargar los datos de la campaña')
        } finally {
            setCargando(false)
        }
    }

    const atenderCitacion = async (citacionId: number) => {
        setAtendiendoCitacion(citacionId)
        try {
            // Usar el endpoint especializado que activa seguimientos automáticamente
            await citacionesService.marcarComoAtendida(citacionId)
            
            // Recargar datos para reflejar cambios
            await cargarDatos()
            
            // Mostrar mensaje de éxito
            console.log('✅ Citación atendida y seguimientos iniciados automáticamente')
        } catch (error) {
            console.error('Error atendiendo citación:', error)
            setError('Error al marcar la citación como atendida')
        } finally {
            setAtendiendoCitacion(null)
        }
    }

    const actualizarEstadoCitacion = async (citacionId: number, nuevoEstado: EstadoCitacion) => {
        try {
            await citacionesService.actualizarEstadoCitacion(citacionId, nuevoEstado)
            
            // Recargar datos para reflejar cambios
            await cargarDatos()
        } catch (error) {
            console.error('Error actualizando estado:', error)
            setError('Error al actualizar el estado de la citación')
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

    const obtenerIconoEstado = (estado: EstadoCitacion) => {
        switch (estado) {
            case 'AGENDADA':
                return <Calendar className="h-4 w-4 text-blue-600" />
            case 'ATENDIDA':
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'CANCELADA':
                return <XCircle className="h-4 w-4 text-red-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const estadisticas = {
        total: citaciones.length,
        agendadas: citaciones.filter(c => c.estado === 'AGENDADA').length,
        atendidas: citaciones.filter(c => c.estado === 'ATENDIDA').length,
        canceladas: citaciones.filter(c => c.estado === 'CANCELADA').length,
        criticas: citaciones.filter(c => c.pacientePriorizado?.nivel_prioridad === 'CRÍTICA').length,
        altas: citaciones.filter(c => c.pacientePriorizado?.nivel_prioridad === 'ALTA').length,
        riesgoCritico: citaciones.filter(c => c.pacientePriorizado?.nivel_riesgo === 'CRITICO').length
    }

    if (cargando) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Cargando citaciones médicas...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header con información de la campaña */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Stethoscope className="h-6 w-6" />
                        {campanaNombre}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Gestión médica de citaciones y seguimiento cardiovascular
                    </p>
                </div>
                <Button
                    onClick={cargarDatos}
                    variant="outline"
                    className="gap-2"
                    disabled={cargando}
                >
                    <RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Estadísticas médicas */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-7">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-xl font-bold text-gray-900">{estadisticas.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Agendadas</p>
                                <p className="text-xl font-bold text-blue-900">{estadisticas.agendadas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Atendidas</p>
                                <p className="text-xl font-bold text-green-900">{estadisticas.atendidas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                                <p className="text-xl font-bold text-red-900">{estadisticas.canceladas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Críticas</p>
                                <p className="text-xl font-bold text-red-900">{estadisticas.criticas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Altas</p>
                                <p className="text-xl font-bold text-orange-900">{estadisticas.altas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">CV Crítico</p>
                                <p className="text-xl font-bold text-red-900">{estadisticas.riesgoCritico}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabla de citaciones médicas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Citaciones Médicas Priorizadas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 text-left font-medium text-gray-700">Paciente</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Prioridad</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Riesgo CV</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Puntuación</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Factores</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Fecha/Hora</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Estado</th>
                                    <th className="py-3 text-left font-medium text-gray-700">Acciones Médicas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citaciones.map((citacion) => (
                                    <tr key={citacion.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {citacion.pacientePriorizado?.nombre_paciente || `Paciente ${citacion.pacienteId}`}
                                                </p>
                                                <p className="text-sm text-gray-500">ID: {citacion.pacienteId}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {citacion.pacientePriorizado ? (
                                                <Badge className={obtenerColorPrioridad(citacion.pacientePriorizado.nivel_prioridad)}>
                                                    {citacion.pacientePriorizado.nivel_prioridad}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Sin prioridad</Badge>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            {citacion.pacientePriorizado ? (
                                                <Badge className={obtenerColorRiesgo(citacion.pacientePriorizado.nivel_riesgo)}>
                                                    {citacion.pacientePriorizado.nivel_riesgo}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Desconocido</Badge>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <span className="font-mono text-sm font-bold">
                                                {citacion.pacientePriorizado ? 
                                                    Math.round(citacion.pacientePriorizado.puntuacion) : 
                                                    '-'
                                                }
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            {citacion.pacientePriorizado?.factores_riesgo ? (
                                                <div className="text-xs space-y-1">
                                                    {citacion.pacientePriorizado.factores_riesgo.slice(0, 2).map((factor, idx) => (
                                                        <div key={idx} className="flex items-center gap-1">
                                                            <span className="font-medium">{factor.factor}:</span>
                                                            <span>{factor.valor}</span>
                                                        </div>
                                                    ))}
                                                    {citacion.pacientePriorizado.factores_riesgo.length > 2 && (
                                                        <p className="text-gray-500">+{citacion.pacientePriorizado.factores_riesgo.length - 2} más</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <div className="text-sm">
                                                <p className="font-medium">
                                                    {new Date(citacion.horaProgramada).toLocaleDateString('es-ES')}
                                                </p>
                                                <p className="text-gray-500">
                                                    {new Date(citacion.horaProgramada).toLocaleTimeString('es-ES', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                {obtenerIconoEstado(citacion.estado)}
                                                <span className="text-sm font-medium">
                                                    {citacion.estado}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                {citacion.estado === 'AGENDADA' && (
                                                    <Button
                                                        onClick={() => atenderCitacion(citacion.id)}
                                                        disabled={atendiendoCitacion === citacion.id}
                                                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                                                        size="sm"
                                                    >
                                                        {atendiendoCitacion === citacion.id ? (
                                                            <>
                                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                                Atendiendo...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Atender
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                
                                                {citacion.estado === 'ATENDIDA' && (
                                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Completada</span>
                                                    </div>
                                                )}

                                                {citacion.estado === 'CANCELADA' && (
                                                    <div className="flex items-center gap-1 text-red-600 text-xs">
                                                        <XCircle className="h-3 w-3" />
                                                        <span>Cancelada</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {citaciones.length === 0 && !cargando && (
                            <div className="text-center py-8">
                                <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No hay citaciones médicas
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No se encontraron citaciones para esta campaña.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 