"use client"

import React from 'react'
import { Control } from 'react-hook-form'

import CustomFormField, { FormFieldType } from '@/src/components/CustomFormField'
import { SelectItem } from '@/src/components/ui/select'
import { RegistroCompletoFormValues } from '@/src/lib/hooks/useRegistroPacienteEmbajador'

interface DatosUsuarioProps {
    control: Control<RegistroCompletoFormValues>
    constantesFormulario: {
        TIPOS_IDENTIFICACION_PACIENTE: Array<{ valor: string; etiqueta: string }>
        OPCIONES_GENERO: Array<{ valor: string; etiqueta: string }>
        TIPOS_SANGRE: Array<{ valor: string; etiqueta: string }>
    }
}

export default function DatosUsuario({
    control,
    constantesFormulario
}: DatosUsuarioProps) {
    const { TIPOS_IDENTIFICACION_PACIENTE } = constantesFormulario

    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold">Datos como Usuario</h3>

            {/* Identificación */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="tipoIdentificacion"
                    label="Tipo de Identificación"
                    placeholder="Selecciona tipo"
                >
                    {TIPOS_IDENTIFICACION_PACIENTE.map((tipo) => (
                        <SelectItem key={tipo.valor} value={tipo.valor}>
                            {tipo.etiqueta}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="identificacion"
                    label="Número de Identificación"
                    placeholder="Ej. 1023456789"
                    iconSrc="/assets/icons/id-card.svg"
                    iconAlt="Identificación"
                />
            </div>

            {/* Nombres y Apellidos */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="nombres"
                    label="Nombres"
                    placeholder="Nombres del paciente"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="Nombres"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="apellidos"
                    label="Apellidos"
                    placeholder="Apellidos del paciente"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="Apellidos"
                />
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="celular"
                    label="Teléfono"
                    placeholder="Ej. 3101234567"
                    iconSrc="/assets/icons/celu.svg"
                    iconAlt="Teléfono"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="correo"
                    label="Correo Electrónico (Opcional)"
                    placeholder="correo@ejemplo.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="Correo"
                />
            </div>
        </div>
    )
} 