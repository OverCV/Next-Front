"use client"

import { RefreshCw, Search } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'

interface ControlBusquedaAuxiliarProps {
    busqueda: string
    setBusqueda: (busqueda: string) => void
    cargarMisCampanas: () => void
    cargandoCampanas: boolean
}

export default function ControlBusquedaAuxiliar({
    busqueda,
    setBusqueda,
    cargarMisCampanas,
    cargandoCampanas
}: ControlBusquedaAuxiliarProps) {
    return (
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Mis Campañas</h2>
                <p className="text-slate-600 text-sm">
                    Campañas donde estás inscrito como auxiliar
                </p>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar campañas..."
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
                >
                    <RefreshCw className={`size-4 ${cargandoCampanas ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </section>
    )
} 