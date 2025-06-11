import { FactoresRiesgoCampana } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const FactorCampanaService = {
  /**
   * Asocia factores de riesgo a una campaña
   */
  asociarFactoresRiesgo: async (
    campanaId: number,
    factoresId: number[]
  ): Promise<FactoresRiesgoCampana[]> => {
    try {
      const factoresAsociados: FactoresRiesgoCampana[] = []
      for (const factorId of factoresId) {
        const response = await apiSpringClient.post(
          `${ENDPOINTS.FACTORES_RIESGO.CAMPANA}`,
          { campanaId, factorId }
        )
        factoresAsociados.push(response.data)
      }
      return factoresAsociados
    } catch (error) {
      console.error("Error al asociar factores de riesgo a campaña:", error)
      throw error
    }
  },
}

export default FactorCampanaService
