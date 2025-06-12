import { Control } from "react-hook-form"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { SelectItem } from "@/src/components/ui/select"
import { TIPOS_IDENTIFICACION } from "@/src/constants"

interface Props {
    control: Control<any>
}

export function IdentificacionFields({ control }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="tipoIdentificacion"
                label="Tipo de Identificación"
            >
                {TIPOS_IDENTIFICACION.filter(t => t.valor !== "NIT").map((tipo) => (
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
            />
        </div>
    )
} 