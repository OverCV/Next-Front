"use client"

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Campana, InscripcionCampana, Medico } from '@/src/types'

interface ModalInscripcionesProps {
    modalAbierto: boolean
    medicoSeleccionado: Medico | null
    campanas: Campana[]
    inscripciones: InscripcionCampana[]
    error: string | null
    procesando: boolean
    onCerrar: () => void
    onInscribir: (campanaId: string) => Promise<void>
    onEliminar: (inscripcionId: number) => Promise<void>
}

export function ModalInscripciones({
    modalAbierto,
    medicoSeleccionado,
    campanas,
    inscripciones,
    error,
    procesando,
    onCerrar,
    onInscribir,
    onEliminar
}: ModalInscripcionesProps) {
    const [campanaSeleccionada, setCampanaSeleccionada] = useState<string>('')

    // Filtrar campañas disponibles (no inscritas)
    const campanasDisponibles = campanas.filter(campana =>
        !inscripciones.some(inscripcion => inscripcion.campanaId === campana.id)
    )

    const manejarInscripcion = async () => {
        if (!campanaSeleccionada) return
        await onInscribir(campanaSeleccionada)
        setCampanaSeleccionada('')
    }

    return (
        <Dialog open={modalAbierto} onOpenChange={onCerrar}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Inscripciones de Dr. {medicoSeleccionado?.nombreCompleto}
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Nueva Inscripción */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Inscribir a Nueva Campaña</h4>

                        {campanasDisponibles.length > 0 ? (
                            <div className="flex gap-3">
                                <Select value={campanaSeleccionada} onValueChange={setCampanaSeleccionada}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Selecciona una campaña" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campanasDisponibles.map((campana) => (
                                            <SelectItem key={campana.id} value={campana.id.toString()}>
                                                {campana.nombre} - {campana.descripcion}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={manejarInscripcion}
                                    disabled={!campanaSeleccionada || procesando}
                                >
                                    {procesando ? (
                                        <RefreshCw className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        '➕'
                                    )}
                                    Inscribir
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                No hay campañas disponibles para inscripción
                            </p>
                        )}
                    </div>

                    {/* Inscripciones Existentes */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Campañas Inscritas</h4>

                        {inscripciones.length > 0 ? (
                            <div className="space-y-2">
                                {inscripciones.map((inscripcion) => {
                                    const campana = campanas.find(c => c.id === inscripcion.campanaId)
                                    return (
                                        <div
                                            key={inscripcion.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{campana?.nombre || 'Campaña'}</p>
                                                <p className="text-sm text-slate-500">
                                                    {campana?.descripcion || 'Sin descripción'} • Inscrito el{' '}
                                                    {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => onEliminar(inscripcion.id)}
                                                disabled={procesando}
                                            >
                                                {procesando ? (
                                                    <RefreshCw className="size-4 animate-spin" />
                                                ) : (
                                                    '🗑️ Eliminar'
                                                )}
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                Este médico no está inscrito en ninguna campaña
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={onCerrar}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 