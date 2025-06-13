import { Citacion } from '@/src/types'

export interface ModalAtencionMedicaProps {
	citacion: Citacion
	onCitacionAtendida: (citacionActualizada: Citacion) => void
	onCerrar: () => void
} 