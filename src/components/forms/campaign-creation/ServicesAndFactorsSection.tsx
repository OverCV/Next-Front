"use client"

import { memo } from 'react'
import { FieldErrors, Control, Controller } from 'react-hook-form'

import { Checkbox } from '@/src/components/ui/checkbox'
import { Label } from '@/src/components/ui/label'
import { FactorRiesgo, ServicioMedico } from '@/src/types'

import { CampanaFormValues } from './types'

// Componente memoizado para las opciones de checkbox
const CheckboxOption = memo(({
    id,
    name,
    isChecked,
    onChange
}: {
    id: number
    name: string
    isChecked: boolean
    onChange: (checked: boolean) => void
}) => (
    <div className="flex items-center space-x-2">
        <Checkbox
            id={`option-${id}`}
            checked={isChecked}
            onCheckedChange={onChange}
            className="cursor-pointer"
        />
        <label
            htmlFor={`option-${id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {name}
        </label>
    </div>
))
CheckboxOption.displayName = 'CheckboxOption'

interface ServicesAndFactorsSectionProps {
    errors: FieldErrors<CampanaFormValues>
    control: Control<CampanaFormValues>
    servicios: ServicioMedico[]
    factores: FactorRiesgo[]
}

export function ServicesAndFactorsSection({
    errors,
    control,
    servicios,
    factores
}: ServicesAndFactorsSectionProps) {
    return (
        <div className="space-y-6">
            {/* Servicios médicos */}
            <div className="space-y-2">
                <Label className={errors.serviciosIds ? 'text-red-500' : ''}>
                    Servicios médicos ofrecidos
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                    <Controller
                        control={control}
                        name="serviciosIds"
                        render={({ field }) => (
                            <>
                                {servicios.map((servicio) => (
                                    <CheckboxOption
                                        key={servicio.id}
                                        id={servicio.id}
                                        name={servicio.nombre}
                                        isChecked={field.value?.some(id => String(id) === String(servicio.id)) || false}
                                        onChange={(checked) => {
                                            if (checked) {
                                                field.onChange([...field.value || [], String(servicio.id)])
                                            } else {
                                                field.onChange(
                                                    (field.value || []).filter(id => String(id) !== String(servicio.id))
                                                )
                                            }
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    />
                </div>
                {errors.serviciosIds && (
                    <p className="text-sm text-red-500">{errors.serviciosIds.message}</p>
                )}
            </div>

            {/* Factores de riesgo */}
            <div className="space-y-2">
                <Label>Factores de riesgo objetivo</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                    <Controller
                        control={control}
                        name="factoresIds"
                        render={({ field }) => (
                            <>
                                {factores.map((factor) => (
                                    <CheckboxOption
                                        key={factor.id}
                                        id={factor.id}
                                        name={factor.nombre}
                                        isChecked={field.value?.some(id => String(id) === String(factor.id)) || false}
                                        onChange={(checked) => {
                                            const currentValues = field.value || []
                                            if (checked) {
                                                field.onChange([...currentValues, String(factor.id)])
                                            } else {
                                                field.onChange(
                                                    currentValues.filter(id => String(id) !== String(factor.id))
                                                )
                                            }
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    )
} 