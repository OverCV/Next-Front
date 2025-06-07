import { API_ENDPOINTS } from "../../config/api-endpoints"
import apiClient from "../api"

/**
 * Servicio para operaciones relacionadas con pacientes
 */
export const pacientesAuthService = {
  /**
   * Verifica si existe el perfil del paciente
   */
  verificarPerfil: async (usuarioId: number): Promise<{ existe: boolean; id?: number; datos?: any }> => {
    try {
      console.log("🔍 PACIENTES-AUTH-SERVICE: Verificando perfil para usuario:", usuarioId)

      const response = await apiClient.get(`${API_ENDPOINTS.PACIENTES}/usuario/${usuarioId}`)

      console.log("✅ PACIENTES-AUTH-SERVICE: Perfil encontrado:", response.data)
      return { existe: true, id: response.data.id, datos: response.data }

    } catch (error: any) {
      console.error("❌ PACIENTES-AUTH-SERVICE: Error al verificar perfil:", error)

      // Si es 404, significa que no existe
      if (error.response?.status === 404) {
        return { existe: false }
      }

      throw error
    }
  },

  /**
   * Verifica si el paciente tiene triaje inicial
   */
  verificarTriaje: async (pacienteId: number): Promise<{ existe: boolean; datos?: any }> => {
    try {
      console.log("🔍 PACIENTES-AUTH-SERVICE: Verificando triaje para paciente:", pacienteId)

      // Usar el endpoint correcto para obtener triajes por paciente
      const response = await apiClient.get(`${API_ENDPOINTS.TRIAJE}/paciente/${pacienteId}`)

      console.log("✅ PACIENTES-AUTH-SERVICE: Triajes encontrados:", response.data)

      // Si tiene triajes, significa que ya hizo el triaje inicial
      if (response.data && response.data.length > 0) {
        return { existe: true, datos: response.data[0] } // Retornar el más reciente
      } else {
        return { existe: false }
      }
    } catch (error: any) {
      console.error("❌ PACIENTES-AUTH-SERVICE: Error al verificar triaje:", error)

      // Si es 404, significa que no tiene triajes
      if (error.response?.status === 404) {
        return { existe: false }
      }

      throw error
    }
  },

  /**
   * Verifica el estado completo del paciente (perfil + triaje)
   */
  verificarEstadoCompleto: async (usuarioId: number): Promise<{
    tienePerfil: boolean
    tieneTriaje: boolean
    perfilData?: any
    triajeData?: any
    pacienteId?: number
  }> => {
    try {
      console.log("🔍 PACIENTES-AUTH-SERVICE: Verificando estado completo para usuario:", usuarioId)

      // Verificar perfil
      const { existe: tienePerfil, id: pacienteId, datos: perfilData } = await pacientesAuthService.verificarPerfil(usuarioId)

      if (!tienePerfil) {
        console.log("❌ PACIENTES-AUTH-SERVICE: Usuario sin perfil")
        return {
          tienePerfil: false,
          tieneTriaje: false,
          perfilData
        }
      }

      // Si tiene perfil, verificar triaje
      if (!pacienteId) {
        console.warn("⚠️ PACIENTES-AUTH-SERVICE: Perfil sin ID de paciente")
        return {
          tienePerfil: true,
          tieneTriaje: false,
          perfilData
        }
      }

      const { existe: tieneTriaje, datos: triajeData } = await pacientesAuthService.verificarTriaje(pacienteId)

      console.log("✅ PACIENTES-AUTH-SERVICE: Estado completo verificado:", {
        tienePerfil,
        tieneTriaje,
        pacienteId
      })

      return {
        tienePerfil,
        tieneTriaje,
        perfilData,
        triajeData,
        pacienteId
      }
    } catch (error) {
      console.error("❌ PACIENTES-AUTH-SERVICE: Error al verificar estado completo:", error)

      // En caso de error, asumir que necesita completar todo
      return {
        tienePerfil: false,
        tieneTriaje: false
      }
    }
  }
}