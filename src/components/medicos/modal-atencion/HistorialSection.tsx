"use client"

import { Activity } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { DatoClinico } from '@/src/types'

interface HistorialSectionProps {
    datosClinicosRecientes: DatoClinico[]
}

export function HistorialSection({ datosClinicosRecientes }: HistorialSectionProps) {
    if (datosClinicosRecientes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Historial Clínico Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center">
                        <Activity className="mx-auto size-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-medium">Sin historial clínico</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Este paciente no tiene datos clínicos previos registrados
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Historial Clínico Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 text-left">Fecha</th>
                                <th className="py-2 text-left">Presión</th>
                                <th className="py-2 text-left">FC</th>
                                <th className="py-2 text-left">Temp</th>
                                <th className="py-2 text-left">SpO2</th>
                                <th className="py-2 text-left">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosClinicosRecientes.slice(0, 5).map((dato) => (
                                <tr key={dato.id} className="border-b">
                                    <td className="py-2">{dato.fechaRegistro}</td>
                                    <td className="py-2">{dato.presionSistolica}/{dato.presionDiastolica}</td>
                                    <td className="py-2">{dato.frecuenciaCardiacaMin}-{dato.frecuenciaCardiacaMax}</td>
                                    <td className="py-2">{dato.temperatura}°C</td>
                                    <td className="py-2">{dato.saturacionOxigeno}%</td>
                                    <td className="max-w-xs truncate py-2">{dato.observaciones ?? 'Sin observaciones'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
} 