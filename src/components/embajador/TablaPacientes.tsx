"use client"

import React, { useState } from 'react'
import { RefreshCw, Search, UserPlus, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { UsuarioAccedido } from '@/src/types'

interface TablaPacientesProps {
    pacientes: UsuarioAccedido[]
    cargandoPacientes: boolean
    error: string | null
    onRecargar: () => void
    filtrarPacientes: (busqueda: string) => UsuarioAccedido[]
}

export default function TablaPacientes({
    pacientes,
    cargandoPacientes,
    error,
    onRecargar,
    filtrarPacientes
}: TablaPacientesProps) {
    const router = useRouter()
    const [busqueda, setBusqueda] = useState('')

    // Obtener pacientes filtrados
    const pacientesFiltrados = filtrarPacientes(busqueda)

    const irARegistroPaciente = () => {
        router.push('/dashboard/embajador/registrar-paciente')
    }

    return (
        <div className="space-y-6">
            {/* Header con acciones */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    onClick={irARegistroPaciente}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="size-4" />
                    Registrar Paciente
                </Button>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
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
                        onClick={onRecargar}
                        disabled={cargandoPacientes}
                    >
                        <RefreshCw className={`size-4 ${cargandoPacientes ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </section>

            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabla de pacientes */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Pacientes Registrados</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {pacientesFiltrados.length} pacientes
                            {busqueda && ` encontrados para "${busqueda}"`}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-4" />
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
                                <th className="py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargandoPacientes ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center">
                                        <div className="flex justify-center">
                                            <RefreshCw className="size-6 animate-spin text-slate-400" />
                                        </div>
                                        <p className="mt-2 text-slate-500">Cargando pacientes...</p>
                                    </td>
                                </tr>
                            ) : pacientesFiltrados.length > 0 ? (
                                pacientesFiltrados.map((paciente) => (
                                    <tr
                                        key={paciente.id}
                                        className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="py-3 font-medium">
                                            {paciente.nombres} {paciente.apellidos}
                                        </td>
                                        <td className="py-3">
                                            <code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-700">
                                                {paciente.tipoIdentificacion.toUpperCase()}: {paciente.identificacion}
                                            </code>
                                        </td>
                                        <td className="py-3">{paciente.celular}</td>
                                        <td className="py-3 text-slate-600 dark:text-slate-400">
                                            {paciente.correo || 'Sin correo'}
                                        </td>
                                        <td className="py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8"
                                                onClick={() => router.push(`/dashboard/embajador/pacientes/${paciente.id}`)}
                                            >
                                                Ver Detalles
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        {busqueda
                                            ? 'No se encontraron pacientes que coincidan con la búsqueda'
                                            : 'No hay pacientes registrados'
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 