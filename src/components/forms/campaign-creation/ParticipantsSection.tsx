"use client"

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'

import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'

import { CampanaFormValues } from './types'

interface ParticipantsSectionProps {
    register: UseFormRegister<CampanaFormValues>
    errors: FieldErrors<CampanaFormValues>
    watch: UseFormWatch<CampanaFormValues>
}

export function ParticipantsSection({
    register,
    errors,
    watch
}: ParticipantsSectionProps) {
    const minParticipantes = watch('minParticipantes')

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {/* Mínimo de participantes */}
            <div className="space-y-2">
                <Label htmlFor="minParticipantes" className={errors.minParticipantes ? 'text-red-500' : ''}>
                    Mínimo de participantes*
                </Label>
                <Input
                    id="minParticipantes"
                    type="number"
                    min={1}
                    {...register('minParticipantes', { valueAsNumber: true })}
                    className={errors.minParticipantes ? 'border-red-500' : ''}
                />
                {errors.minParticipantes && (
                    <p className="text-sm text-red-500">{errors.minParticipantes.message}</p>
                )}
            </div>

            {/* Máximo de participantes */}
            <div className="space-y-2">
                <Label htmlFor="maxParticipantes" className={errors.maxParticipantes ? 'text-red-500' : ''}>
                    Máximo de participantes*
                </Label>
                <Input
                    id="maxParticipantes"
                    type="number"
                    min={minParticipantes}
                    {...register('maxParticipantes', { valueAsNumber: true })}
                    className={errors.maxParticipantes ? 'border-red-500' : ''}
                />
                {errors.maxParticipantes && (
                    <p className="text-sm text-red-500">{errors.maxParticipantes.message}</p>
                )}
            </div>
        </div>
    )
} 