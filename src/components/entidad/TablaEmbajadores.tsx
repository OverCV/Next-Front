"use client"

import { RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { useAuxiliares } from '@/src/lib/hooks/useAuxiliares'
import { Embajador } from '@/src/types'

interface TablaEmbajadoresProps {
    embajadores: Embajador[]
    cargando: boolean
    busqueda: string
    onRefresh?: () => void
}

export function TablaEmbajadores({ embajadores, cargando, busqueda, onRefresh }: TablaEmbajadoresProps) {
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

    const [embajadorSeleccionado, setEmbajadorSeleccionado] = useState<Embajador | null>(null)
    const [campanaSeleccionada, setCampanaSeleccionada] = useState<string>('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [procesando, setProcesando] = useState(false)

    // Cargar campañas disponibles al montar
    useEffect(() => {
        cargarCampanas()
    }, [cargarCampanas])

    const abrirModalInscripcion = async (embajador: Embajador) => {
        setEmbajadorSeleccionado(embajador)
        setModalAbierto(true)
        limpiarEstado()

        if (embajador.usuarioId) {
            await cargarInscripcionesAuxiliar(embajador.usuarioId)
        }
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setEmbajadorSeleccionado(null)
        setCampanaSeleccionada('')
        limpiarEstado()
    }

    const manejarInscripcion = async () => {
        if (!embajadorSeleccionado?.usuarioId || !campanaSeleccionada) return

        setProcesando(true)
        const exito = await inscribirAuxiliar(embajadorSeleccionado.usuarioId, parseInt(campanaSeleccionada))

        if (exito) {
            setCampanaSeleccionada('')
            if (onRefresh) onRefresh()
        }
        setProcesando(false)
    }

    const manejarEliminacion = async (inscripcionId: number) => {
        if (!embajadorSeleccionado?.id) return

        setProcesando(true)
        const exito = await eliminarInscripcion(inscripcionId, embajadorSeleccionado.id)

        if (exito && onRefresh) {
            onRefresh()
        }
        setProcesando(false)
    }

    // Filtrar campañas disponibles (no inscritas)
    const campanasDisponibles = campanas.filter(campana =>
        !inscripciones.some(inscripcion => inscripcion.campanaId === campana.id)
    )

    // Filtrar embajadores según búsqueda
    const embajadoresFiltrados = embajadores.filter(
        e =>
            e.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.telefono.includes(busqueda)
    )

    return (
        <>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Embajadores Registrados</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Listado de embajadores registrados por esta entidad
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                        Filtrar
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-3 text-left font-medium">Nombre</th>

                                <th className="py-3 text-left font-medium">Teléfono</th>
                                <th className="py-3 text-left font-medium">Localidad</th>
                                <th className="py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center">
                                        <div className="flex justify-center">
                                            <RefreshCw className="size-6 animate-spin text-slate-400" />
                                        </div>
                                        <p className="mt-2 text-slate-500">Cargando embajadores...</p>
                                    </td>
                                </tr>
                            ) : embajadoresFiltrados.length > 0 ? (
                                embajadoresFiltrados.map((embajador) => (
                                    <tr
                                        key={embajador.id}
                                        className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="py-3 font-medium">
                                            {embajador.nombreCompleto}
                                        </td>

                                        <td className="py-3">
                                            {embajador.telefono}
                                        </td>

                                        <td className="py-3 text-slate-600 dark:text-slate-400">
                                            {embajador.localidad}
                                        </td>
                                        <td className="py-3 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => abrirModalInscripcion(embajador)}
                                            >
                                                📋 Inscripciones
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500">
                                        {busqueda
                                            ? 'No se encontraron embajadores que coincidan con la búsqueda'
                                            : 'No hay embajadores registrados'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Inscripciones */}
            <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Inscripciones de {embajadorSeleccionado?.nombreCompleto}
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