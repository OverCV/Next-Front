import { AxiosError } from "axios"

import { Embajador } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const EmbajadorService = {
  obtenerEmbajadores: async (): Promise<Embajador[]> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.EMBAJADORES.BASE)
      return response.data
    } catch (error) {
      console.error("Error al obtener embajadores:", error)
      return []
    }
  },

  crearEmbajador: async (embajador: Embajador): Promise<Embajador> => {
    try {
      const response = await apiSpringClient.post(
        ENDPOINTS.EMBAJADORES.BASE, embajador
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        )
      }
      throw new Error("Error al crear el embajador")
    }
  },

  obtenerEmbajadoresPorIds: async (ids: number[]): Promise<Embajador[]> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.EMBAJADORES.POR_IDS(ids))
      return response.data
    } catch (error) {
      console.error("Error al obtener embajadores por IDs:", error)
      return []
    }
  },
}

export default EmbajadorService
