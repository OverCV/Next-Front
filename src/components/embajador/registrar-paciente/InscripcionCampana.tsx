"use client"

import { Calendar, Users, RefreshCw } from 'lucide-react'
import React from 'react'
import { Control } from 'react-hook-form'

import CustomFormField, { FormFieldType } from '@/src/components/CustomFormField'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { SelectItem } from '@/src/components/ui/select'
import { RegistroCompletoFormValues } from '@/src/lib/hooks/useRegistroPacienteEmbajador'

interface CampanaDisponible {
    id: number
    nombre: string
    estado: string
    minParticipantes: number
    maxParticipantes: number
}

interface InscripcionCampanaProps {
    control: Control<RegistroCompletoFormValues>
    campanasDisponibles: CampanaDisponible[]
    cargandoCampanas: boolean
}

export default function InscripcionCampana({
    control,
    campanasDisponibles,
    cargandoCampanas
}: InscripcionCampanaProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-blue-500" />
                    <CardTitle className="text-lg">Inscripción a Campaña</CardTitle>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Puedes inscribir al paciente directamente a una campaña de salud disponible (opcional)
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Selector de campaña */}
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="campanaId"
                    label="Campaña de Salud"
                    placeholder={cargandoCampanas ? "Cargando campañas..." : "Selecciona una campaña (opcional)"}
                    disabled={cargandoCampanas}
                >
                    {/* Opción para no inscribir */}
                    <SelectItem value="sin_campana">
                        Sin inscripción a campaña
                    </SelectItem>

                    {/* Campañas disponibles */}
                    {campanasDisponibles.map((campana) => (
                        <SelectItem
                            key={campana.id}
                            value={campana.id.toString()}
                        >
                            {`${campana.nombre} - ${campana.estado}`}
                        </SelectItem>
                    ))}
                </CustomFormField>

                {/* Estado de carga */}
                {cargandoCampanas && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Cargando campañas disponibles...</span>
                    </div>
                )}

                {/* Información de campañas disponibles */}
                {!cargandoCampanas && campanasDisponibles.length > 0 && (
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                        <h4 className="mb-3 text-sm font-medium"><b>Campañas Disponibles:</b></h4>
                        <div className="space-y-2">
                            {campanasDisponibles.slice(0, 5).map((campana) => (
                                <div key={campana.id} className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{campana.nombre}</span>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Users className="size-3" />
                                        <span>{campana.minParticipantes}-{campana.maxParticipantes} participantes</span>
                                    </div>
                                </div>
                            ))}
                            {campanasDisponibles.length > 3 && (
                                <p className="text-xs text-slate-500">
                                    +{campanasDisponibles.length - 3} campañas más disponibles
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Mensaje cuando no hay campañas */}
                {!cargandoCampanas && campanasDisponibles.length === 0 && (
                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            No hay campañas disponibles en este momento. El paciente se registrará sin inscripción a campaña.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 