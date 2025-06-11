import { CitacionMedica } from '@/src/types'

export interface ModalAtencionMedicaProps {
	citacion: CitacionMedica
	onCitacionAtendida: (citacionActualizada: CitacionMedica) => void
	onCerrar: () => void
} 