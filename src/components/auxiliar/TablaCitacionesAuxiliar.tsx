"use client"

import { AlertCircle, Calendar, Clock, RotateCcw, X } from 'lucide-react'
import React, { useState } from 'react'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { CitacionMedica, EstadoCitacion } from '@/src/types'

interface TablaCitacionesAuxiliarProps {
    citaciones: CitacionMedica[]
    onCitacionActualizada: () => void
}

function TablaCitacionesAuxiliar({ citaciones, onCitacionActualizada }: TablaCitacionesAuxiliarProps) {
    const [cargando, setCargando] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Formatear fecha y hora
    const formatearFechaHora = (fechaHora: string) => {
        return new Date(fechaHora).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Obtener el color del estado
    const obtenerColorEstado = (estado: string) => {
        switch (estado) {
            case 'AGENDADA':
                return 'bg-blue-100 text-blue-800'
            case 'ATENDIDA':
                return 'bg-green-100 text-green-800'
            case 'CANCELADA':
                return 'bg-red-100 text-red-800'
            case 'NO_ASISTIO':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Cambiar estado de la citación
    const cambiarEstadoCitacion = async (citacionId: number, nuevoEstado: string) => {
        setCargando(citacionId)
        setError(null)

        try {
            if (nuevoEstado === 'CANCELADA') {
                await citacionesService.cancelarCitacion(citacionId)
                console.log('✅ Citación cancelada exitosamente')
            } else if (nuevoEstado === 'AGENDADA') {
                await citacionesService.reprogramarCitacion(citacionId)
                console.log('✅ Citación reprogramada exitosamente')
            }

            // Actualizar la lista
            onCitacionActualizada()
        } catch (err: any) {
            console.error('❌ Error al cambiar estado:', err)
            setError('Error al actualizar la citación')
            setTimeout(() => setError(null), 3000)
        } finally {
            setCargando(null)
        }
    }

    if (citaciones.length === 0) {
        return (
            <div className="text-center py-8">
                <Calendar className="mx-auto size-12 text-slate-400 mb-3" />
                <p className="text-slate-500">No hay citaciones para esta campaña</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabla de citaciones */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Duración</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {citaciones.map((citacion) => (
                            <TableRow key={citacion.id}>
                                {/* ID del paciente (podríamos expandir con nombre más adelante) */}
                                <TableCell className="font-medium">
                                    Paciente #{citacion.pacienteId}
                                </TableCell>

                                {/* Fecha y hora programada */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4 text-slate-400" />
                                        <span className="text-sm">
                                            {formatearFechaHora(citacion.horaProgramada)}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Duración estimada */}
                                <TableCell>
                                    <span className="text-sm text-slate-600">
                                        {citacion.duracionEstimada} min
                                    </span>
                                </TableCell>

                                {/* Estado */}
                                <TableCell>
                                    <Badge className={obtenerColorEstado(citacion.estado)}>
                                        {citacion.estado}
                                    </Badge>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {citacion.estado === EstadoCitacion.AGENDADA && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => cambiarEstadoCitacion(citacion.id, 'CANCELADA')}
                                                disabled={cargando === citacion.id}
                                                className="gap-2 text-red-600 hover:text-red-700"
                                            >
                                                <X className="size-4" />
                                                {cargando === citacion.id ? 'Cancelando...' : 'Cancelar'}
                                            </Button>
                                        )}

                                        {citacion.estado === 'CANCELADA' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => cambiarEstadoCitacion(citacion.id, 'AGENDADA')}
                                                disabled={cargando === citacion.id}
                                                className="gap-2 text-blue-600 hover:text-blue-700"
                                            >
                                                <RotateCcw className="size-4" />
                                                {cargando === citacion.id ? 'Reprogramando...' : 'Reprogramar'}
                                            </Button>
                                        )}

                                        {citacion.estado === 'ATENDIDA' && (
                                            <span className="text-sm text-green-600 font-medium">
                                                ✓ Atendida
                                            </span>
                                        )}

                                        {citacion.estado === EstadoCitacion.CANCELADA && (
                                            <span className="text-sm text-gray-600">
                                                No asistió
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TablaCitacionesAuxiliar 