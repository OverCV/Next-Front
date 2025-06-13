"use client"

import { Calendar, MapPin, Users, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { InscripcionCompleta } from '@/src/services/domain/inscripciones.service'

interface CampanasInscritasProps {
    campanasInscritas: InscripcionCompleta[]
    cargandoCampanas: boolean
    onRecargar: () => void
    obtenerColorEstadoCampana: (estado: string) => string
    formatearLocalizacion: (localizacion: any) => string
}

export default function CampanasInscritas({
    campanasInscritas,
    cargandoCampanas,
    onRecargar,
    obtenerColorEstadoCampana,
    formatearLocalizacion
}: CampanasInscritasProps) {
    const router = useRouter()

    // Calcular estadísticas de la campaña
    const calcularEstadisticasCampana = (campana: any) => {
        const fechaInicio = new Date(campana.fechaInicio)
        const fechaLimite = new Date(campana.fechaLimite)
        const hoy = new Date()

        const diasRestantes = Math.ceil((fechaLimite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        const duracionTotal = Math.ceil((fechaLimite.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))

        return {
            diasRestantes: diasRestantes > 0 ? diasRestantes : 0,
            duracionTotal,
            progreso: Math.max(0, Math.min(100, ((duracionTotal - diasRestantes) / duracionTotal) * 100))
        }
    }

    if (cargandoCampanas) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Campañas Asignadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                                        <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                                        <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Campañas Asignadas</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Campañas de salud en las que participas como embajador
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRecargar}
                        disabled={cargandoCampanas}
                        className="gap-2"
                    >
                        <RefreshCw className={`size-4 ${cargandoCampanas ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {campanasInscritas.length > 0 ? (
                    <div className="space-y-4">
                        {campanasInscritas.map(({ inscripcion, campana }) => {
                            const estadisticas = calcularEstadisticasCampana(campana)

                            return (
                                <div
                                    key={inscripcion.id}
                                    className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                            {/* Información principal */}
                                            <div>
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h3 className="text-lg font-medium">{campana.nombre}</h3>
                                                    <Badge className={obtenerColorEstadoCampana(campana.estado)}>
                                                        {campana.estado}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {campana.descripcion}
                                                </p>
                                            </div>

                                            {/* Información adicional */}
                                            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="size-4 text-slate-400" />
                                                    <span>{formatearLocalizacion(campana.localizacion)}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Users className="size-4 text-slate-400" />
                                                    <span>{campana.minParticipantes}-{campana.maxParticipantes} participantes</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4 text-slate-400" />
                                                    <span>
                                                        Inicio: {new Date(campana.fechaInicio).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4 text-slate-400" />
                                                    <span>
                                                        Fin: {new Date(campana.fechaLimite).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Barra de progreso para campañas en ejecución */}
                                            {campana.estado === 'EJECUCION' && (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-500">
                                                        <span>Progreso de la campaña</span>
                                                        <span>{estadisticas.diasRestantes} días restantes</span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div
                                                            className="h-2 rounded-full bg-green-600 transition-all duration-300"
                                                            style={{ width: `${estadisticas.progreso}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Estado de inscripción */}
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>Inscrito el {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-ES')}</span>
                                                <span>•</span>
                                                <span>Estado: {inscripcion.estado}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <Calendar className="mx-auto size-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-medium">No hay campañas asignadas</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Cuando te asignen a campañas de salud, aparecerán aquí
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 