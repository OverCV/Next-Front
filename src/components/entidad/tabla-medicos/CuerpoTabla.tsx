"use client"

import { RefreshCw } from 'lucide-react'

import { Medico } from '@/src/types'

import { FilaTabla } from './FilaTabla'

interface CuerpoTablaProps {
    medicos: Medico[]
    cargando: boolean
    busqueda: string
    onInscripciones: (medico: Medico) => void
}

export function CuerpoTabla({ medicos, cargando, busqueda, onInscripciones }: CuerpoTablaProps) {
    // Filtrar médicos según búsqueda con validaciones seguras
    const medicosFiltrados = medicos.filter(m => {
        const nombreCompleto = (m.nombreCompleto || '').toLowerCase()
        const telefono = m.telefono || ''
        const especialidad = (m.especialidad || '').toLowerCase()
        const busquedaLower = busqueda.toLowerCase()

        return (
            nombreCompleto.includes(busquedaLower) ||
            telefono.includes(busqueda) ||
            especialidad.includes(busquedaLower)
        )
    })

    if (cargando) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="py-8 text-center">
                        <div className="flex justify-center">
                            <RefreshCw className="size-6 animate-spin text-slate-400" />
                        </div>
                        <p className="mt-2 text-slate-500">Cargando médicos...</p>
                    </td>
                </tr>
            </tbody>
        )
    }

    if (medicosFiltrados.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                        {busqueda
                            ? 'No se encontraron médicos que coincidan con la búsqueda'
                            : 'No hay médicos registrados'}
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody>
            {medicosFiltrados.map((medico) => (
                <FilaTabla
                    key={medico.id}
                    medico={medico}
                    onInscripciones={onInscripciones}
                />
            ))}
        </tbody>
    )
}
