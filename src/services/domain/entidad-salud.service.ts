import { AxiosError } from "axios"

import { EntidadSalud, Embajador } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

// Servicio para gestionar entidades de salud
export const entidadSaludService = {

  /**
   * Crea una nueva entidad de salud
   */
  crearEntidadSalud: async (entidadData: EntidadSalud): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.post(ENDPOINTS.ENTIDADES_SALUD.BASE, entidadData)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        )
      }
      throw new Error("Error al crear la entidad de salud")
    }
  },

  obtenerEntidadPorId: async (id: number): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.ENTIDADES_SALUD.POR_ID(id))
      return response.data
    } catch (error) {
      console.error("Error al obtener entidad por ID:", error)
      throw error
    }
  },

  obtenerEntidadPorUsuarioId: async (usuarioId: number): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.get(`${ENDPOINTS.ENTIDADES_SALUD.POR_USUARIO(usuarioId)}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener entidad por usuario ID:", error)
      throw error
    }
  },

  /**
   * Obtiene embajadores creados por una entidad con el NIT especificado
   */
  obtenerEmbajadoresPorNIT: async (nit: string): Promise<Embajador[]> => {
    try {
      const response = await apiSpringClient.get(`${ENDPOINTS.ENTIDADES_SALUD.BASE}/embajadores-nit/${nit}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener embajadores por NIT:", error)
      throw error
    }
  },

  /**
   * Actualiza los datos de una entidad de salud
   */
  actualizarEntidadSalud: async (id: number, datos: Partial<EntidadSalud>): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.put(`${ENDPOINTS.ENTIDADES_SALUD.BASE}/${id}`, datos)
      return response.data
    } catch (error) {
      console.error("Error al actualizar entidad de salud:", error)
      throw error
    }
  },

}

export default entidadSaludService
