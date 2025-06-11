"use client"

import React from 'react'
import { Control } from 'react-hook-form'

import CustomFormField, { FormFieldType } from '@/src/components/CustomFormField'
import { SelectItem } from '@/src/components/ui/select'
import { RegistroCompletoFormValues } from '@/src/lib/hooks/useRegistroPacienteEmbajador'
import { Localizacion } from '@/src/types'

interface DatosPacienteProps {
    control: Control<RegistroCompletoFormValues>
    constantesFormulario: {
        TIPOS_IDENTIFICACION_PACIENTE: Array<{ valor: string; etiqueta: string }>
        OPCIONES_GENERO: Array<{ valor: string; etiqueta: string }>
        TIPOS_SANGRE: Array<{ valor: string; etiqueta: string }>
    }
    localizaciones: Localizacion[]
    cargandoLocalizaciones: boolean
}

export default function DatosPaciente({
    control,
    constantesFormulario,
    localizaciones,
    cargandoLocalizaciones
}: DatosPacienteProps) {
    const { OPCIONES_GENERO, TIPOS_SANGRE } = constantesFormulario

    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold">Datos del Paciente</h3>

            {/* Fecha de nacimiento con DatePicker mejorado */}
            <div className="mb-6">
                <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={control}
                    name="fechaNacimiento"
                    label="Fecha de Nacimiento"
                    placeholder="Selecciona fecha de nacimiento"
                    iconSrc="/assets/icons/calendar.svg"
                    iconAlt="Fecha de nacimiento"
                />
            </div>

            {/* Género y Tipo de Sangre */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="genero"
                    label="Género Biológico"
                    placeholder="Selecciona género"
                >
                    {OPCIONES_GENERO.map((opcion) => (
                        <SelectItem key={opcion.valor} value={opcion.valor}>
                            {opcion.etiqueta}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="tipoSangre"
                    label="Tipo de Sangre"
                    placeholder="Selecciona tipo de sangre"
                >
                    {TIPOS_SANGRE.map((tipo) => (
                        <SelectItem key={tipo.valor} value={tipo.valor}>
                            {tipo.etiqueta}
                        </SelectItem>
                    ))}
                </CustomFormField>
            </div>

            {/* Dirección */}
            <div className="mb-6">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="direccion"
                    label="Dirección"
                    placeholder="Ingresa la dirección completa"
                    iconSrc="/assets/icons/map-pin.svg"
                    iconAlt="Dirección"
                />
            </div>

            {/* Localización */}
            <div className="mb-6">
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="localizacion_id"
                    label="Localización"
                    placeholder={cargandoLocalizaciones ? "Cargando localizaciones..." : "Selecciona localización"}
                    disabled={cargandoLocalizaciones}
                >
                    {localizaciones.map((loc) => (
                        <SelectItem
                            key={loc.id}
                            value={loc.id.toString()}
                        >
                            {`${loc.municipio}, ${loc.vereda || loc.localidad || 'Centro'} - ${loc.departamento}`}
                        </SelectItem>
                    ))}
                </CustomFormField>
                {cargandoLocalizaciones && (
                    <p className="mt-1 text-xs text-slate-500">
                        Cargando localizaciones disponibles...
                    </p>
                )}
            </div>
        </div>
    )
} 