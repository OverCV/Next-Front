"use client"

import { AlertCircle, Calendar, Clock, User, Stethoscope, XCircle, Loader2, Ticket, RefreshCw } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
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
    nombrePaciente?: string
    nombreMedico?: string
}

interface TablaCitacionesDelDiaProps {
    campanaId: number
    campanaNombre: string
}

export function TablaCitacionesDelDia({ campanaId, campanaNombre }: TablaCitacionesDelDiaProps) {
    const [citaciones, setCitaciones] = useState<CitacionConPrioridad[]>([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [cancelandoCitacion, setCancelandoCitacion] = useState<number | null>(null)

    useEffect(() => {
        cargarCitacionesDelDia()
    }, [campanaId])

    const cargarCitacionesDelDia = async () => {
        setCargando(true)
        setError(null)
        
        try {
            // Obtener la fecha actual para filtrar citaciones del día
            const fechaHoy = new Date()
            fechaHoy.setHours(0, 0, 0, 0)
            
            const fechaManana = new Date(fechaHoy)
            fechaManana.setDate(fechaManana.getDate() + 1)

            // Cargar citaciones de la campaña y datos de priorización
            const [citacionesData, priorizacionData] = await Promise.all([
                citacionesService.obtenerCitacionesPorCampana(campanaId),
                prediccionesService.obtenerPacientesPriorizados(campanaId)
            ])

            // Filtrar solo citaciones del día actual y que no estén canceladas
            const citacionesDelDia = citacionesData.filter(citacion => {
                const fechaCitacion = new Date(citacion.horaProgramada)
                return fechaCitacion >= fechaHoy && 
                       fechaCitacion < fechaManana &&
                       citacion.estado !== EstadoCitacion.CANCELADA
            })

            // Combinar citaciones con datos de priorización
            const citacionesConPrioridad = citacionesDelDia.map(citacion => {
                const pacientePriorizado = priorizacionData?.find(p => p.paciente_id === citacion.pacienteId)
                return {
                    ...citacion,
                    pacientePriorizado,
                    // Por ahora usamos el ID, pero en el futuro se puede obtener del backend
                    nombrePaciente: pacientePriorizado?.nombre_paciente || `Paciente ${citacion.pacienteId}`,
                    nombreMedico: `Dr. ${citacion.medicoId}` // Temporal, se puede expandir
                }
            })

            // Ordenar por prioridad (CRÍTICA > ALTA > MEDIA > BAJA) y luego por hora
            const ordenPrioridad = { 'CRÍTICA': 0, 'ALTA': 1, 'MEDIA': 2, 'BAJA': 3 }
            citacionesConPrioridad.sort((a, b) => {
                const prioridadA = a.pacientePriorizado?.nivel_prioridad || 'BAJA'
                const prioridadB = b.pacientePriorizado?.nivel_prioridad || 'BAJA'
                
                const ordenA = ordenPrioridad[prioridadA as keyof typeof ordenPrioridad] || 3
                const ordenB = ordenPrioridad[prioridadB as keyof typeof ordenPrioridad] || 3
                
                if (ordenA !== ordenB) {
                    return ordenA - ordenB
                }
                
                // Si tienen la misma prioridad, ordenar por hora
                return new Date(a.horaProgramada).getTime() - new Date(b.horaProgramada).getTime()
            })

            setCitaciones(citacionesConPrioridad)
        } catch (error) {
            console.error('Error cargando citaciones del día:', error)
            setError('Error al cargar las citaciones del día')
        } finally {
            setCargando(false)
        }
    }

    const cancelarCitacion = async (citacionId: number) => {
        setCancelandoCitacion(citacionId)
        
        try {
            await citacionesService.actualizarEstadoCitacion(citacionId, EstadoCitacion.CANCELADA)
            
            // Recargar datos para reflejar cambios
            await cargarCitacionesDelDia()
            
            console.log('✅ Citación cancelada exitosamente')
        } catch (error) {
            console.error('❌ Error al cancelar citación:', error)
            setError('Error al cancelar la citación')
            setTimeout(() => setError(null), 3000)
        } finally {
            setCancelandoCitacion(null)
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

    const formatearHora = (fechaHora: string) => {
        return new Date(fechaHora).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }

    const estadisticas = {
        total: citaciones.length,
        agendadas: citaciones.filter(c => c.estado === EstadoCitacion.AGENDADA).length,
        atendidas: citaciones.filter(c => c.estado === EstadoCitacion.ATENDIDA).length,
        criticas: citaciones.filter(c => c.pacientePriorizado?.nivel_prioridad === 'CRÍTICA').length,
        altas: citaciones.filter(c => c.pacientePriorizado?.nivel_prioridad === 'ALTA').length
    }

    if (cargando) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Cargando citaciones del día...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Citaciones del Día - {campanaNombre}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Gestión y seguimiento de citaciones programadas para hoy
                    </p>
                </div>
                <Button
                    onClick={cargarCitacionesDelDia}
                    variant="outline"
                    className="gap-2"
                    disabled={cargando}
                >
                    <RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
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
                            <Clock className="h-5 w-5 text-blue-600" />
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
                            <User className="h-5 w-5 text-green-600" />
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
                            <AlertCircle className="h-5 w-5 text-red-600" />
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
            </div>

            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabla de citaciones */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Lista de Citaciones - {new Date().toLocaleDateString('es-ES')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket</TableHead>
                                    <TableHead>Paciente</TableHead>
                                    <TableHead>Médico</TableHead>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Prioridad</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {citaciones.map((citacion) => (
                                    <TableRow key={citacion.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Ticket className="h-4 w-4 text-blue-600" />
                                                <span className="font-mono font-medium">
                                                    {citacion.codigoTicket}
                                                </span>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {citacion.nombrePaciente}
                                                </p>
                                                <p className="text-sm text-gray-500">ID: {citacion.pacienteId}</p>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">{citacion.nombreMedico}</span>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">
                                                    {formatearHora(citacion.horaProgramada)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            {citacion.pacientePriorizado ? (
                                                <Badge className={obtenerColorPrioridad(citacion.pacientePriorizado.nivel_prioridad)}>
                                                    {citacion.pacientePriorizado.nivel_prioridad}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Sin prioridad</Badge>
                                            )}
                                        </TableCell>
                                        
                                        <TableCell>
                                            <Badge 
                                                variant={citacion.estado === EstadoCitacion.ATENDIDA ? "default" : "secondary"}
                                                className={
                                                    citacion.estado === EstadoCitacion.ATENDIDA 
                                                        ? "bg-green-100 text-green-800" 
                                                        : "bg-blue-100 text-blue-800"
                                                }
                                            >
                                                {citacion.estado}
                                            </Badge>
                                        </TableCell>
                                        
                                        <TableCell>
                                            {citacion.estado === EstadoCitacion.AGENDADA && (
                                                <Button
                                                    onClick={() => cancelarCitacion(citacion.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                    disabled={cancelandoCitacion === citacion.id}
                                                >
                                                    {cancelandoCitacion === citacion.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4" />
                                                    )}
                                                    Cancelar
                                                </Button>
                                            )}
                                            
                                            {citacion.estado === EstadoCitacion.ATENDIDA && (
                                                <span className="text-sm text-green-600 font-medium">
                                                    ✓ Completada
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {citaciones.length === 0 && !cargando && (
                            <div className="text-center py-8">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No hay citaciones para hoy
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No se encontraron citaciones programadas para el día de hoy.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 