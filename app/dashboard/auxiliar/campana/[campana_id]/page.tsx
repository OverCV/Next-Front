"use client"

import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import TablaCitacionesAuxiliar from '@/src/components/auxiliar/TablaCitacionesAuxiliar'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { Campana, Citacion } from '@/src/types'

// Componente separado para la información de la campaña
function InformacionCampana({ campana }: { campana: Campana }) {
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES')
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Información de la Campaña</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-slate-600">Estado</p>
                    <p className="font-medium">{campana.estado}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-600">Fecha de Inicio</p>
                    <p className="font-medium">{formatearFecha(campana.fechaInicio)}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-600">Participantes</p>
                    <p className="font-medium">{campana.minParticipantes} - {campana.maxParticipantes}</p>
                </div>
            </div>
        </div>
    )
}

// Componente principal
export default function CampanaAuxiliarPage() {
    const params = useParams()
    const router = useRouter()
    const campanaId = Number(params.campana_id)

    const [campana, setCampana] = useState<Campana | null>(null)
    const [citaciones, setCitaciones] = useState<Citacion[]>([])
    const [cargando, setCargando] = useState(true)
    const [cargandoCitaciones, setCargandoCitaciones] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Cargar datos de la campaña
    const cargarCampana = async () => {
        if (!campanaId) return

        try {
            const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.POR_ID(campanaId))
            setCampana(response.data)
            console.log('✅ Campaña cargada:', response.data.nombre)
        } catch (err: any) {
            console.error('❌ Error al cargar campaña:', err)
            setError('No se pudo cargar la información de la campaña')
        }
    }

    // Cargar citaciones de la campaña
    const cargarCitaciones = async () => {
        if (!campanaId) return

        setCargandoCitaciones(true)
        try {
            const citacionesData = await citacionesService.obtenerCitacionesPorCampana(campanaId)
            setCitaciones(citacionesData)
            console.log('✅ Citaciones cargadas:', citacionesData.length)
        } catch (err: any) {
            console.error('❌ Error al cargar citaciones:', err)
            setError('No se pudieron cargar las citaciones')
        } finally {
            setCargandoCitaciones(false)
        }
    }

    // Manejar actualización de citación
    const manejarCitacionActualizada = () => {
        cargarCitaciones()
    }

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true)
            await Promise.all([
                cargarCampana(),
                cargarCitaciones()
            ])
            setCargando(false)
        }

        cargarDatos()
    }, [campanaId])

    if (cargando) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header con botón de regresar */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="size-4" />
                    Regresar
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">{campana?.nombre}</h1>
                    <p className="text-slate-600">{campana?.descripcion}</p>
                </div>
            </div>

            {/* Mensajes de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Información de la campaña */}
            {campana && <InformacionCampana campana={campana} />}

            {/* Citaciones de la campaña */}
            <div className="bg-white rounded-lg border border-slate-200">
                <div className="border-b border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Citaciones Médicas</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Gestiona las citaciones de los pacientes para esta campaña
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={cargarCitaciones}
                            disabled={cargandoCitaciones}
                            className="gap-2"
                        >
                            <RefreshCw className={`size-4 ${cargandoCitaciones ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    <TablaCitacionesAuxiliar
                        citaciones={citaciones}
                        onCitacionActualizada={manejarCitacionActualizada}
                    />
                </div>
            </div>
        </div>
    )
} 