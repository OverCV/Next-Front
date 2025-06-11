"use client"

import { UserPlus, RefreshCw, Search, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'

interface AccionesEntidadProps {
    busqueda: string
    setBusqueda: (busqueda: string) => void
    onRecargar: () => void
    cargando: boolean
}

export function AccionesEntidad({
    busqueda,
    setBusqueda,
    onRecargar,
    cargando
}: AccionesEntidadProps) {
    const router = useRouter()

    const irARegistroEmbajador = () => {
        router.push('/dashboard/entidad/registrar-embajador')
    }

    const irAPostularCampana = () => {
        router.push('/dashboard/entidad/postular-campana')
    }

    return (
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
                <Button
                    onClick={irARegistroEmbajador}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="size-4" />
                    Registrar Embajador
                </Button>

                <Button
                    onClick={irAPostularCampana}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <PlusCircle className="size-4" />
                    Agregar Campaña
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar embajador..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onRecargar}
                    disabled={cargando}
                >
                    <RefreshCw className={`size-4 ${cargando ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </section>
    )
} 