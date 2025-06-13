"use client"

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import { TablaCitacionesPriorizadas } from '@/src/components/auxiliar/TablaCitacionesPriorizadas'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { Campana } from '@/src/types'

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
    const [cargando, setCargando] = useState(true)
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
        } finally {
            setCargando(false)
        }
    }

    // Cargar datos iniciales
    useEffect(() => {
        cargarCampana()
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

    if (error) {
        return (
            <div className="space-y-6">
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
                </div>
                
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
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
            </div>

            {/* Componente principal con priorización */}
            <TablaCitacionesPriorizadas 
                campanaId={campanaId}
                campanaNombre={campana?.nombre || 'Campaña'}
            />
        </div>
    )
} 