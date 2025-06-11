"use client"

import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { Embajador } from '@/src/types'

interface TablaEmbajadoresProps {
    embajadores: Embajador[]
    cargando: boolean
    busqueda: string
}

export function TablaEmbajadores({ embajadores, cargando, busqueda }: TablaEmbajadoresProps) {
    const router = useRouter()

    // Filtrar embajadores según búsqueda
    const embajadoresFiltrados = embajadores.filter(
        e =>
            e.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.telefono.includes(busqueda)
    )

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Embajadores Registrados</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Listado de embajadores registrados por esta entidad
                    </p>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                    Filtrar
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="py-3 text-left font-medium">Nombre</th>
                            <th className="py-3 text-left font-medium">Identificación</th>
                            <th className="py-3 text-left font-medium">Teléfono</th>
                            <th className="py-3 text-left font-medium">Correo</th>
                            <th className="py-3 text-left font-medium">Localidad</th>
                            <th className="py-3 text-right font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center">
                                    <div className="flex justify-center">
                                        <RefreshCw className="size-6 animate-spin text-slate-400" />
                                    </div>
                                    <p className="mt-2 text-slate-500">Cargando embajadores...</p>
                                </td>
                            </tr>
                        ) : embajadoresFiltrados.length > 0 ? (
                            embajadoresFiltrados.map((embajador) => (
                                <tr
                                    key={embajador.id}
                                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                >
                                    <td className="py-3 font-medium">
                                        {embajador.nombreCompleto}
                                    </td>
                                    <td className="py-3">
                                        {embajador.identificacion}
                                    </td>
                                    <td className="py-3">
                                        {embajador.telefono}
                                    </td>
                                    <td className="py-3">
                                        {embajador.correo}
                                    </td>
                                    <td className="py-3 text-slate-600 dark:text-slate-400">
                                        {embajador.localidad}
                                    </td>
                                    <td className="py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8"
                                            onClick={() => router.push(`/dashboard/entidad/embajadores/${embajador.id}`)}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-slate-500">
                                    {busqueda
                                        ? 'No se encontraron embajadores que coincidan con la búsqueda'
                                        : 'No hay embajadores registrados'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 