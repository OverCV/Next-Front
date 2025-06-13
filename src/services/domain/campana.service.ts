import { AxiosError } from "axios"

import { Campana, FactorRiesgo, ServicioMedico, CrearCampanaParams, ActualizarCampanaParams } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

// Servicio para gestionar campañas
export const CampanaService = {
  /**
   * Obtiene todas las campañas de una entidad
   */
  obtenerCampanasPorEntidad: async (entidadId: number): Promise<Campana[]> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.POR_ENTIDAD(entidadId))
      return response.data
    } catch (error) {
      console.error("Error al obtener campañas por entidad:", error)
      return []
    }
  },

  /**
   * Obtiene una campaña específica por su ID
   */
  obtenerCampanaPorId: async (campanaId: number): Promise<Campana> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.POR_ID(campanaId))
      return response.data
    } catch (error) {
      console.error("Error al obtener campaña por ID:", error)
      throw new Error("Campaña no encontrada")
    }
  },

  /**
   * Crea una nueva campaña
   */
  crearCampana: async (campanaData: CrearCampanaParams): Promise<Campana> => {
    try {
      const response = await apiSpringClient.post(ENDPOINTS.CAMPANAS.BASE, campanaData)
      return response.data
    } catch (error) {
      console.error("Error al crear campaña:", error)
      const axiosError = error as AxiosError
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        )
      }
      throw new Error("Error al crear la campaña")
    }
  },

  /**
   * Actualiza una campaña existente
   */
  actualizarCampana: async (
    campanaData: ActualizarCampanaParams
  ): Promise<Campana> => {
    try {
      const response = await apiSpringClient.put(
        `${ENDPOINTS.CAMPANAS.BASE}/${campanaData.id}`,
        campanaData
      )
      return response.data
    } catch (error) {
      console.error("Error al actualizar campaña:", error)
      const axiosError = error as AxiosError
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        )
      }
      throw new Error("Error al actualizar la campaña")
    }
  },

  /**
   * Cambia el estado de una campaña
   */
  cambiarEstadoCampana: async (
    campanaId: number,
    estatus: string
  ): Promise<Campana> => {
    try {
      const response = await apiSpringClient.patch(
        `${ENDPOINTS.CAMPANAS.BASE}/${campanaId}/estatus`,
        { estatus }
      )
      return response.data
    } catch (error) {
      console.error("Error al cambiar estado de campaña:", error)
      throw new Error("Error al cambiar el estado de la campaña")
    }
  },

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

  /**
   * Obtiene los factores de riesgo disponibles
   */
  obtenerFactoresRiesgo: async (): Promise<FactorRiesgo[]> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.FACTORES_RIESGO.BASE)
      return response.data
    } catch (error) {
      console.error("Error al obtener factores de riesgo:", error)
      return []
    }
  },
}

export default CampanaService
