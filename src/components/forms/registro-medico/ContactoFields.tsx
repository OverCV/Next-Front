import { Control } from "react-hook-form"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"

interface Props {
    control: Control<any>
}

export function ContactoFields({ control }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="telefono"
                label="Teléfono"
                control={control}
                placeholder="300 123 4567"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="correo"
                label="Correo"
                control={control}
                iconSrc="/assets/icons/email.svg"
                placeholder="ejemplo@correo.com"
            />
        </div>
    )
} 