"use client"

import { Calendar, User, RefreshCw } from 'lucide-react'
import React from 'react'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { formatearFecha } from '@/src/lib/utils'

interface ControlFechaBusquedaProps {
    fechaSeleccionada: Date
    busqueda: string
    setBusqueda: (value: string) => void
    irAHoy: () => void
    cargarMisCampanas: () => void
    cargandoCampanas: boolean
}

export default function ControlFechaBusqueda({
    fechaSeleccionada,
    busqueda,
    setBusqueda,
    irAHoy,
    cargarMisCampanas,
    cargandoCampanas
}: ControlFechaBusquedaProps) {
    return (
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={irAHoy}
                    className="flex items-center gap-2"
                >
                    <Calendar className="size-4" />
                    Hoy
                </Button>
                <span className="font-medium">
                    {formatearFecha(fechaSeleccionada)}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative w-full max-w-xs">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar paciente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={cargarMisCampanas}
                    disabled={cargandoCampanas}
                    title="Actualizar campañas"
                >
                    <RefreshCw className={`size-4 ${cargandoCampanas ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </section>
    )
} 