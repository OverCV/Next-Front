import { Control } from "react-hook-form"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"

interface Props {
    control: Control<any>
}

export function SeguridadFields({ control }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="clave"
                label="Contraseña"
                type="password"
                control={control}
                placeholder="Mínimo 6 caracteres"
                iconSrc="/assets/icons/lock.svg"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="confirmarClave"
                label="Confirmar Contraseña"
                type="password"
                control={control}
                placeholder="Repetir contraseña"
                iconSrc="/assets/icons/lock.svg"
            />
        </div>
    )
} 