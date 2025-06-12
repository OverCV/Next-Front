import { useRouter } from "next/navigation"

import { Button } from "@/src/components/ui/button"

interface Props {
    cargando: boolean
}

export function FormActions({ cargando }: Props) {
    const router = useRouter()
    return (
        <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={cargando}>
                Cancelar
            </Button>
            <Button type="submit" disabled={cargando} className="min-w-[120px]">
                {cargando ? 'Registrando...' : 'Registrar Médico'}
            </Button>
        </div>
    )
} 