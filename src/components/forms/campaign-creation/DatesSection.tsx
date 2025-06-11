"use client"

import { es } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import { FieldErrors, Control, Controller, UseFormWatch } from 'react-hook-form'

import { Label } from '@/src/components/ui/label'

import { CampanaFormValues } from './types'

// Importar estilos del DatePicker
import "react-datepicker/dist/react-datepicker.css"

const DatePicker = dynamic(() => import('react-datepicker'), {
    ssr: false,
    loading: () => (
        <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
    ),
})

interface DatesSectionProps {
    errors: FieldErrors<CampanaFormValues>
    control: Control<CampanaFormValues>
    watch: UseFormWatch<CampanaFormValues>
}

export function DatesSection({
    errors,
    control,
    watch
}: DatesSectionProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Fecha inicio */}
                <div className="space-y-2">
                    <Label htmlFor="fechaInicio" className={errors.fechaInicio ? 'text-red-500' : ''}>
                        Fecha de inicio*
                    </Label>
                    <Controller
                        control={control}
                        name="fechaInicio"
                        render={({ field }) => (
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date: Date) => field.onChange(date)}
                                    onFocus={() => { }}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    className={`w-full rounded-md border ${errors.fechaInicio ? 'border-red-500' : 'border-slate-200'
                                        } py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                                />
                            </div>
                        )}
                    />
                    {errors.fechaInicio && (
                        <p className="text-sm text-red-500">{errors.fechaInicio.message}</p>
                    )}
                </div>

                {/* Fecha límite */}
                <div className="space-y-2">
                    <Label htmlFor="fechaLimite" className={errors.fechaLimite ? 'text-red-500' : ''}>
                        Fecha límite*
                    </Label>
                    <Controller
                        control={control}
                        name="fechaLimite"
                        render={({ field }) => (
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date: Date) => field.onChange(date)}
                                    onFocus={() => { }}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={watch('fechaInicio')}
                                    className={`w-full rounded-md border ${errors.fechaLimite ? 'border-red-500' : 'border-slate-200'
                                        } py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                                />
                            </div>
                        )}
                    />
                    {errors.fechaLimite && (
                        <p className="text-sm text-red-500">{errors.fechaLimite.message}</p>
                    )}
                </div>
            </div>

            {/* Fecha límite de inscripción */}
            <div className="space-y-2">
                <Label htmlFor="fechaLimiteInscripcion" className={errors.fechaLimiteInscripcion ? 'text-red-500' : ''}>
                    Fecha límite de inscripción*
                </Label>
                <Controller
                    control={control}
                    name="fechaLimiteInscripcion"
                    render={({ field }) => (
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
                            <DatePicker
                                selected={field.value}
                                onChange={(date: Date) => field.onChange(date)}
                                onFocus={() => { }}
                                locale={es}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                maxDate={watch('fechaLimite')}
                                className={`w-full rounded-md border ${errors.fechaLimiteInscripcion ? 'border-red-500' : 'border-slate-200'
                                    } py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                            />
                        </div>
                    )}
                />
                {errors.fechaLimiteInscripcion && (
                    <p className="text-sm text-red-500">{errors.fechaLimiteInscripcion.message}</p>
                )}
                <p className="text-sm text-slate-500">
                    Fecha hasta la cual los usuarios pueden inscribirse en la campaña
                </p>
            </div>
        </div>
    )
} 