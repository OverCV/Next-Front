import { Control } from "react-hook-form"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { SelectItem } from "@/src/components/ui/select"

interface Props {
    control: Control<any>
}

const ESPECIALIDADES_MEDICAS = [
    { valor: "MEDICINA_GENERAL", etiqueta: "Medicina General" },
    { valor: "CARDIOLOGIA", etiqueta: "Cardiología" },
    { valor: "MEDICINA_INTERNA", etiqueta: "Medicina Interna" },
    { valor: "NEUROLOGIA", etiqueta: "Neurología" },
]

export function EspecialidadFields({ control }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="especialidad"
                label="Especialidad Médica"
            >
                {ESPECIALIDADES_MEDICAS.map((e) => (
                    <SelectItem key={e.valor} value={e.valor}>
                        {e.etiqueta}
                    </SelectItem>
                ))}
            </CustomFormField>
            {/* <CustomFormField
                name="numeroLicencia"
                label="Número de Licencia (Opcional)"
                control={control}
                placeholder="Ej. 123456"
            /> */}
        </div>
    )
} 