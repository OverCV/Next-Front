"use client"

import { useState, useEffect } from 'react'

import { useAuxiliares } from '@/src/lib/hooks/useAuxiliares'
import { Medico } from '@/src/types'

import { CuerpoTabla, EncabezadoTabla, ModalInscripciones } from './tabla-medicos'

interface TablaMedicosProps {
    medicos: Medico[]
    cargando: boolean
    busqueda: string
    onRefresh?: () => void
}

export function TablaMedicos({ medicos, cargando, busqueda, onRefresh }: TablaMedicosProps) {
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

    const [medicoSeleccionado, setMedicoSeleccionado] = useState<Medico | null>(null)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [procesando, setProcesando] = useState(false)

    // Cargar campañas disponibles al montar
    useEffect(() => {
        cargarCampanas()
    }, [cargarCampanas])

    const abrirModalInscripcion = async (medico: Medico) => {
        setMedicoSeleccionado(medico)
        setModalAbierto(true)
        limpiarEstado()

        if (medico.id) {
            await cargarInscripcionesAuxiliar(medico.id)
        }
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setMedicoSeleccionado(null)
        limpiarEstado()
    }

    const manejarInscripcion = async (campanaId: string) => {
        if (!medicoSeleccionado?.usuarioId) return;

        setProcesando(true);
        const exito = await inscribirAuxiliar(medicoSeleccionado.usuarioId, parseInt(campanaId));

        if (exito && onRefresh) {
            onRefresh();
        }
        setProcesando(false);
    }

    const manejarEliminacion = async (inscripcionId: number) => {
        if (!medicoSeleccionado?.id) return

        setProcesando(true)
        const exito = await eliminarInscripcion(inscripcionId, medicoSeleccionado.id)

        if (exito && onRefresh) {
            onRefresh()
        }
        setProcesando(false)
    }

    return (
        <>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <EncabezadoTabla />

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-3 text-left font-medium">Nombre</th>
                                <th className="py-3 text-left font-medium">Identificación</th>
                                <th className="py-3 text-left font-medium">Especialidad</th>
                                <th className="py-3 text-left font-medium">Teléfono</th>
                                <th className="py-3 text-left font-medium">Correo</th>
                                <th className="py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>

                        <CuerpoTabla
                            medicos={medicos}
                            cargando={cargando}
                            busqueda={busqueda}
                            onInscripciones={abrirModalInscripcion}
                        />
                    </table>
                </div>
            </div>

            <ModalInscripciones
                modalAbierto={modalAbierto}
                medicoSeleccionado={medicoSeleccionado}
                campanas={campanas}
                inscripciones={inscripciones}
                error={error}
                procesando={procesando}
                onCerrar={cerrarModal}
                onInscribir={manejarInscripcion}
                onEliminar={manejarEliminacion}
            />
        </>
    )
}