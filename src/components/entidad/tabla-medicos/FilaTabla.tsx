"use client"

import { Button } from '@/src/components/ui/button'
import { Medico } from '@/src/types'

interface FilaTablaProps {
    medico: Medico
    onInscripciones: (medico: Medico) => void
}

export function FilaTabla({ medico, onInscripciones }: FilaTablaProps) {
    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
            <td className="py-3 font-medium">
                Dr. {medico.nombreCompleto || 'N/A'}
            </td>
            <td className="py-3">
                {medico.identificacion || 'N/A'}
            </td>
            <td className="py-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {medico.especialidad || 'N/A'}
                </span>
            </td>
            <td className="py-3">
                {medico.telefono || 'N/A'}
            </td>
            <td className="py-3">
                {medico.correo || 'N/A'}
            </td>
            <td className="py-3 text-right">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onInscripciones(medico)}
                >
                    🏥 Inscripciones
                </Button>
            </td>
        </tr>
    )
} 