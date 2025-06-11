import { EmbajadorEntidad } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const EmbajadorEntidadService = {
  obtenerEmbajadoresPorEntidadId: async (entidadId: number): Promise<EmbajadorEntidad[]> => {
    try {
      const response = await apiSpringClient.get(`${ENDPOINTS.EMBAJADORES.ENTIDADES.BASE}/entidad/${entidadId}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener embajadores por entidad:", error)
      return []
    }
  },

  obtenerEmbajadorEntidadPorEmbajadorId: async (embajadorId: number): Promise<EmbajadorEntidad | null> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.EMBAJADORES.ENTIDADES.POR_EMBAJADOR(embajadorId))
      return response.data
    } catch (error) {
      console.error("Error al obtener embajador-entidad por embajador:", error)
      return null
    }
  },

  crearEmbajadorEntidad: async (embajadorEntidad: EmbajadorEntidad): Promise<EmbajadorEntidad> => {
    try {
      const response = await apiSpringClient.post(ENDPOINTS.EMBAJADORES.ENTIDADES.BASE, embajadorEntidad)
      return response.data
    } catch (error) {
      console.error("Error al crear embajador-entidad:", error)
      throw new Error("Error al crear la relación embajador-entidad")
    }
  },

  eliminarEmbajadorEntidad: async (id: number): Promise<void> => {
    try {
      await apiSpringClient.delete(`${ENDPOINTS.EMBAJADORES.ENTIDADES.BASE}/${id}`)
    } catch (error) {
      console.error("Error al eliminar embajador-entidad:", error)
      throw new Error("Error al eliminar la relación embajador-entidad")
    }
  },
}

export default EmbajadorEntidadService
