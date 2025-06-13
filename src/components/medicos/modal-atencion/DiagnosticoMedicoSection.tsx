"use client"

import { Stethoscope, Save, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import DiagnosticoForm from '@/src/components/forms/DiagnosticoForm'

interface DiagnosticoMedicoSectionProps {
    citacionId: number
    pacienteId: number
}

export function DiagnosticoMedicoSection({ citacionId, pacienteId }: DiagnosticoMedicoSectionProps) {
    const [guardandoDiagnostico, setGuardandoDiagnostico] = useState(false)
    const [diagnosticoGuardado, setDiagnosticoGuardado] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Manejar el envío del diagnóstico
    const manejarEnvioDiagnostico = async (datoDiagnostico: any) => {
        setGuardandoDiagnostico(true)
        setError(null)

        try {
            // Agregar información de la citación al diagnóstico
            const diagnosticoCompleto = {
                ...datoDiagnostico,
                citacionId,
                pacienteId,
                fechaDiagnostico: new Date().toISOString()
            }

            console.log('📝 Guardando diagnóstico para citación:', citacionId, diagnosticoCompleto)

            // Aquí se haría la llamada al servicio para guardar el diagnóstico
            // await diagnosticosService.crearDiagnostico(diagnosticoCompleto)

            // Simulamos la creación exitosa por ahora
            await new Promise(resolve => setTimeout(resolve, 1000))

            setDiagnosticoGuardado(true)
            console.log('✅ Diagnóstico guardado exitosamente')

        } catch (err: any) {
            console.error('❌ Error al guardar diagnóstico:', err)
            setError('Error al guardar el diagnóstico. Intente nuevamente.')
        } finally {
            setGuardandoDiagnostico(false)
        }
    }

    if (diagnosticoGuardado) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="size-5" />
                        Diagnóstico Médico
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="mx-auto mb-4 size-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Save className="size-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Diagnóstico Guardado</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            El diagnóstico médico ha sido registrado exitosamente para esta citación.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                                setDiagnosticoGuardado(false)
                                setError(null)
                            }}
                        >
                            Agregar Otro Diagnóstico
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="size-5" />
                    Diagnóstico Médico
                </CardTitle>
                <p className="text-sm text-slate-500 mt-2">
                    Registre el diagnóstico médico para esta consulta. Esta información quedará asociada a la citación actual.
                </p>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="size-4 text-red-600" />
                            <p className="text-sm font-medium text-red-900 dark:text-red-300">
                                Error al guardar
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Citación ID: #{citacionId}
                        </span>
                    </div>

                    <DiagnosticoForm
                        pacienteId={pacienteId}
                        onSubmit={manejarEnvioDiagnostico}
                        isSubmitting={guardandoDiagnostico}
                    />
                </div>
            </CardContent>
        </Card>
    )
} 