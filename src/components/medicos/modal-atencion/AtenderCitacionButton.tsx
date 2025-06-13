"use client"

import { RefreshCw, CheckCircle, Play } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { atencionesService } from '@/src/services/domain/atenciones.service'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { AtencionMedica, Citacion, EstadoAtencion } from '@/src/types'

interface AtenderCitacionButtonProps {
    citacion: Citacion
    onCitacionAtendida: (citacion: Citacion) => void
}

export function AtenderCitacionButton({
    citacion,
    onCitacionAtendida
}: AtenderCitacionButtonProps) {
    const [atencionActual, setAtencionActual] = useState<AtencionMedica | null>(null)
    const [cargandoAtencion, setCargandoAtencion] = useState(false)
    const [procesando, setProcesando] = useState(false)

    // Verificar si ya existe una atención al cargar el componente
    useEffect(() => {
        const verificarAtencion = async () => {
            if (citacion.estado === 'ATENDIDA') return

            setCargandoAtencion(true)
            try {
                const atencion = await atencionesService.obtenerAtencionPorCitacion(citacion.id)
                setAtencionActual(atencion)
            } catch (error) {
                console.error('Error al verificar atención:', error)
            } finally {
                setCargandoAtencion(false)
            }
        }

        verificarAtencion()
    }, [citacion.id, citacion.estado])

    // Iniciar atención médica
    const iniciarAtencion = async () => {
        setProcesando(true)
        try {
            const nuevaAtencion = await atencionesService.iniciarAtencion(citacion.id)
            setAtencionActual(nuevaAtencion)
            console.log('✅ Atención iniciada exitosamente')
        } catch (error) {
            console.error('❌ Error al iniciar atención:', error)
        } finally {
            setProcesando(false)
        }
    }

    // Finalizar atención médica
    const finalizarAtencion = async () => {
        if (!atencionActual) return

        setProcesando(true)
        try {
            const citacionActualizada = await citacionesService.finalizarAtencion(citacion.id)

            // Notificar al componente padre
            onCitacionAtendida(citacionActualizada)

            console.log('✅ Atención finalizada y citación marcada como atendida')
        } catch (error) {
            console.error('❌ Error al finalizar atención:', error)
        } finally {
            setProcesando(false)
        }
    }

    // No mostrar nada si la citación ya está atendida
    if (citacion.estado === 'ATENDIDA') {
        return (
            <div className="flex justify-end border-t pt-4">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="size-4" />
                    <span className="font-medium">Atención Completada</span>
                </div>
            </div>
        )
    }

    // No mostrar nada si la citación está cancelada
    if (citacion.estado === 'CANCELADA') {
        return (
            <div className="flex justify-end border-t pt-4">
                <div className="text-slate-500">
                    <span>Citación cancelada</span>
                </div>
            </div>
        )
    }

    // Mostrar loading mientras verifica la atención
    if (cargandoAtencion) {
        return (
            <div className="flex justify-end border-t pt-4">
                <Button disabled className="gap-2">
                    <RefreshCw className="size-4 animate-spin" />
                    Verificando...
                </Button>
            </div>
        )
    }

    return (
        <div className="flex justify-end border-t pt-4">
            {!atencionActual ? (
                // No hay atención iniciada - mostrar botón "Iniciar Atención"
                <Button
                    onClick={iniciarAtencion}
                    disabled={procesando}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                    {procesando ? (
                        <RefreshCw className="size-4 animate-spin" />
                    ) : (
                        <Play className="size-4" />
                    )}
                    {procesando ? 'Iniciando...' : 'Iniciar Atención'}
                </Button>
            ) : atencionActual.estado === EstadoAtencion.EN_PROCESO ? (
                // Hay atención en proceso - mostrar botón "Finalizar Atención"
                <Button
                    onClick={finalizarAtencion}
                    disabled={procesando}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    {procesando ? (
                        <RefreshCw className="size-4 animate-spin" />
                    ) : (
                        <CheckCircle className="size-4" />
                    )}
                    {procesando ? 'Finalizando...' : 'Finalizar Atención'}
                </Button>
            ) : (
                // Atención completada
                <div className="flex items-center gap-2 text-green-600">
                    <span className="font-medium">Atención Completada</span>
                    <CheckCircle className="size-4" />
                </div>
            )}
        </div>
    )
} 