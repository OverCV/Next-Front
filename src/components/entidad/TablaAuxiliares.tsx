'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { useAuxiliares } from '@/src/lib/hooks/useAuxiliares'
import { Medico } from '@/src/types'

interface TablaAuxiliaresProps {
    auxiliares: Medico[]
    onRefresh?: () => void
}

export default function TablaAuxiliares({ auxiliares, onRefresh }: TablaAuxiliaresProps) {
    const {
        campanas,
        inscripciones,
        error,
        cargarCampanas,
        cargarInscripcionesAuxiliar,
        inscribirAuxiliar,
        eliminarInscripcion,
        limpiarEstado
    } = useAuxiliares()

    const [auxiliarSeleccionado, setAuxiliarSeleccionado] = useState<Medico | null>(null)
    const [campanaSeleccionada, setCampanaSeleccionada] = useState<string>('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [procesando, setProcesando] = useState(false)

    // Cargar campañas disponibles al montar
    useEffect(() => {
        cargarCampanas()
    }, [cargarCampanas])

    const abrirModalInscripcion = async (auxiliar: Medico) => {
        setAuxiliarSeleccionado(auxiliar)
        setModalAbierto(true)
        limpiarEstado()

        if (auxiliar.usuarioId) {
            await cargarInscripcionesAuxiliar(auxiliar.usuarioId)
        }
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setAuxiliarSeleccionado(null)
        setCampanaSeleccionada('')
        limpiarEstado()
    }

    const manejarInscripcion = async () => {
        if (!auxiliarSeleccionado?.id || !campanaSeleccionada) return

        setProcesando(true)
        const exito = await inscribirAuxiliar(auxiliarSeleccionado.id, parseInt(campanaSeleccionada))

        if (exito) {
            setCampanaSeleccionada('')
            if (onRefresh) onRefresh()
        }
        setProcesando(false)
    }

    const manejarEliminacion = async (inscripcionId: number) => {
        if (!auxiliarSeleccionado?.id) return

        setProcesando(true)
        const exito = await eliminarInscripcion(inscripcionId, auxiliarSeleccionado.id)

        if (exito && onRefresh) {
            onRefresh()
        }
        setProcesando(false)
    }

    // Filtrar campañas disponibles (no inscritas)
    const campanasDisponibles = campanas.filter(campana =>
        !inscripciones.some(inscripcion => inscripcion.campanaId === campana.id)
    )

    if (auxiliares.length === 0) {
        return (
            <div className="rounded-lg border border-slate-200 p-8 text-center">
                <p className="text-slate-500">No hay auxiliares registrados</p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-slate-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Nombre Completo</TableHead>
                            <TableHead>Identificación</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auxiliares.map((auxiliar) => (
                            <TableRow key={auxiliar.id}>
                                <TableCell className="font-medium">
                                    {auxiliar.nombreCompleto}
                                </TableCell>
                                <TableCell>
                                    {auxiliar.identificacion}
                                </TableCell>
                                <TableCell>{auxiliar.telefono}</TableCell>
                                <TableCell>{auxiliar.correo}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => abrirModalInscripcion(auxiliar)}
                                    >
                                        📋 Inscripciones
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de Inscripciones */}
            <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Inscripciones de {auxiliarSeleccionado?.nombreCompleto}
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
                                            <SelectValue placeholder="Seleccione una campaña" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {campanasDisponibles.map((campana) => (
                                                <SelectItem key={campana.id} value={campana.id.toString()}>
                                                    {campana.nombre} - {campana.estado}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={manejarInscripcion}
                                        disabled={!campanaSeleccionada || procesando}
                                    >
                                        {procesando ? 'Inscribiendo...' : 'Inscribir'}
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No hay campañas disponibles para inscripción
                                </p>
                            )}
                        </div>

                        {/* Inscripciones Actuales */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Inscripciones Actuales</h4>

                            {inscripciones.length > 0 ? (
                                <div className="space-y-2">
                                    {inscripciones.map((inscripcion) => {
                                        const campana = campanas.find(c => c.id === inscripcion.campanaId)
                                        return (
                                            <div key={inscripcion.id}
                                                className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                                                <div>
                                                    <p className="font-medium">{campana?.nombre || 'Campaña no encontrada'}</p>
                                                    <p className="text-sm text-slate-600">
                                                        Estado: {inscripcion.estado} • Inscrito: {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => manejarEliminacion(inscripcion.id)}
                                                    disabled={procesando}
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No tiene inscripciones activas
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={cerrarModal}>
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 