import { Control } from "react-hook-form"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"

interface Props {
    control: Control<any>
}

export function DatosPersonalesFields({ control }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="nombres"
                label="Nombres"
                control={control}
                placeholder="Ej. Juan"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="apellidos"
                label="Apellidos"
                control={control}
                placeholder="Ej. Pérez"
            />
        </div>
    )
} 