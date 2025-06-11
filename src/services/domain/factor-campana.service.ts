import { FactoresRiesgoCampana } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const FactorCampanaService = {
  /**
   * Asocia factores de riesgo a una campaña
   */
  asociarFactoresRiesgo: async (
    campanaId: number,
    factoresIds: number[]
  ): Promise<FactoresRiesgoCampana[]> => {
    try {
      const response = await apiSpringClient.post(
        `${ENDPOINTS.FACTORES_RIESGO.CAMPANA}/campana/${campanaId}/factores`,
        factoresIds
      )
      return response.data
    } catch (error) {
      console.error("Error al asociar factores de riesgo a campaña:", error)
      throw error
    }
  },
}

export default FactorCampanaService
