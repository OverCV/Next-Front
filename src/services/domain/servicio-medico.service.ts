import { ServicioMedico } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const ServicioMedicoService = {
	/**
	 * Obtiene los servicios médicos disponibles
	 */
	obtenerServiciosMedicos: async (): Promise<ServicioMedico[]> => {
		try {
			const response = await apiSpringClient.get(ENDPOINTS.SERVICIOS_MEDICOS.BASE)
			return response.data
		} catch (error) {
			console.error("Error al obtener servicios médicos:", error)
			return []
		}
	},
}

export default ServicioMedicoService 