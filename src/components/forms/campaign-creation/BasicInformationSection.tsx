"use client"

import { UseFormRegister, FieldErrors, Control, Controller } from 'react-hook-form'

import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'
import { Localizacion } from '@/src/types'

import { CampanaFormValues } from './types'

interface BasicInformationSectionProps {
    register: UseFormRegister<CampanaFormValues>
    errors: FieldErrors<CampanaFormValues>
    control: Control<CampanaFormValues>
    localizaciones: Localizacion[]
}

export function BasicInformationSection({
    register,
    errors,
    control,
    localizaciones
}: BasicInformationSectionProps) {
    return (
        <div className="space-y-4">
            {/* Nombre de la campaña */}
            <div className="space-y-2">
                <Label htmlFor="nombre" className={errors.nombre ? 'text-red-500' : ''}>
                    Nombre de la campaña*
                </Label>
                <Input
                    id="nombre"
                    placeholder="Ej. Jornada de Salud Cardiovascular"
                    {...register('nombre')}
                    className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                    <p className="text-sm text-red-500">{errors.nombre.message}</p>
                )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <Label htmlFor="descripcion" className={errors.descripcion ? 'text-red-500' : ''}>
                    Descripción*
                </Label>
                <Textarea
                    id="descripcion"
                    placeholder="Describa los objetivos y actividades de esta campaña..."
                    rows={4}
                    {...register('descripcion')}
                    className={errors.descripcion ? 'border-red-500' : ''}
                />
                {errors.descripcion && (
                    <p className="text-sm text-red-500">{errors.descripcion.message}</p>
                )}
            </div>

            {/* Localización */}
            <div className="space-y-2">
                <Label htmlFor="localizacionId" className={errors.localizacionId ? 'text-red-500' : ''}>
                    Localización*
                </Label>
                <Controller
                    control={control}
                    name="localizacionId"
                    render={({ field }) => (
                        <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                        >
                            <SelectTrigger className={errors.localizacionId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Seleccione una localización" />
                            </SelectTrigger>
                            <SelectContent>
                                {localizaciones.map((loc) => (
                                    <SelectItem key={loc.id} value={loc.id.toString()}>
                                        {loc.municipio}, {loc.departamento}
                                        {loc.vereda && ` - ${loc.vereda}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.localizacionId && (
                    <p className="text-sm text-red-500">{errors.localizacionId.message}</p>
                )}
            </div>
        </div>
    )
} 