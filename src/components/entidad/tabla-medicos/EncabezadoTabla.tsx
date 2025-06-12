"use client"

import { Button } from '@/src/components/ui/button'

export function EncabezadoTabla() {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold">Médicos Registrados</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Listado de médicos registrados por esta entidad
                </p>
            </div>
            <Button variant="outline" size="sm" className="h-8">
                Filtrar
            </Button>
        </div>
    )
} 