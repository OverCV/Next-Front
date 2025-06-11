import { Localizacion } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const localizacionesService = {
  obtenerLocalizaciones: async (): Promise<Localizacion[]> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.LOCALIZACIONES.BASE)
      return response.data || []
    } catch (err) {
      console.error("Error al obtener localizaciones:", err)
      return []
    }
  }
}

export default localizacionesService
