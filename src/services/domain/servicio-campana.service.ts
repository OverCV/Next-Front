import { ServicioMedico } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const ServicioCampanaService = {
  /**
   * Asocia servicios médicos a una campaña
   */
  asociarServiciosMedicos: async (
    campanaId: number,
    serviciosIds: number[]
  ): Promise<ServicioMedico[]> => {
    try {
      const response = await apiSpringClient.post(
        `${ENDPOINTS.SERVICIOS_MEDICOS.CAMPANA}/campana/${campanaId}/servicios`,
        serviciosIds
      )
      return response.data
    } catch (error) {
      console.error("Error al asociar servicios médicos a campaña:", error)
      throw error
    }
  },
}

export default ServicioCampanaService
