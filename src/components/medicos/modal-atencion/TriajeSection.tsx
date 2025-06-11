"use client"

import { AlertCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { TriajePaciente } from '@/src/types'

interface TriajeSectionProps {
    triaje: TriajePaciente | undefined
}

export function TriajeSection({ triaje }: TriajeSectionProps) {
    if (!triaje) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertCircle className="mx-auto size-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-medium">No hay triaje registrado</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Este paciente no tiene triaje inicial registrado
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Triaje Inicial</CardTitle>
                <p className="text-sm text-slate-500">
                    Realizado el {new Date(triaje.fechaTriaje).toLocaleDateString('es-ES')}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                        <p className="text-sm font-medium text-slate-900">Edad</p>
                        <p className="text-sm text-slate-600">{triaje.edad} años</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">Peso</p>
                        <p className="text-sm text-slate-600">{triaje.peso} kg</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">Estatura</p>
                        <p className="text-sm text-slate-600">{triaje.estatura} cm</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${triaje.tabaquismo ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm">Tabaquismo: {triaje.tabaquismo ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${triaje.diabetes ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm">Diabetes: {triaje.diabetes ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${triaje.hipertension ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm">Hipertensión: {triaje.hipertension ? 'Sí' : 'No'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${triaje.dolorPecho ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm">Dolor en pecho: {triaje.dolorPecho ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${triaje.antecedentesCardiacos ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm">Antecedentes cardíacos: {triaje.antecedentesCardiacos ? 'Sí' : 'No'}</span>
                    </div>
                </div>

                {triaje.descripcion && (
                    <div>
                        <p className="text-sm font-medium text-slate-900">Observaciones</p>
                        <p className="mt-1 text-sm text-slate-600">{triaje.descripcion}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 