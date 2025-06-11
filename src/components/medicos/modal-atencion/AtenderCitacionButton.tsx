"use client"

import { RefreshCw, CheckCircle } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { CitacionMedica } from '@/src/types'

interface AtenderCitacionButtonProps {
    citacion: CitacionMedica
    atendiendoCitacion: boolean
    onAtender: () => void
}

export function AtenderCitacionButton({
    citacion,
    atendiendoCitacion,
    onAtender
}: AtenderCitacionButtonProps) {
    // No mostrar el botón si ya está atendida
    if (citacion.estado === 'ATENDIDA') {
        return null
    }

    return (
        <div className="flex justify-end border-t pt-4">
            <Button
                onClick={onAtender}
                disabled={atendiendoCitacion}
                className="gap-2 bg-green-600 hover:bg-green-700"
            >
                {atendiendoCitacion ? (
                    <RefreshCw className="size-4 animate-spin" />
                ) : (
                    <CheckCircle className="size-4" />
                )}
                {atendiendoCitacion ? 'Procesando...' : 'Marcar como Atendida'}
            </Button>
        </div>
    )
} 