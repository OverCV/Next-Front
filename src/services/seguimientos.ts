import apiClient from './api'
import { API_N8N_URL } from '@/src/config/env'

export interface Seguimiento {
  id: number
  atencion_id?: number
  citacion_id?: number
  fecha_programada: string
  fecha_realizada?: string
  tipo: string
  resultado: string
  notas: string
  estado: string
  prioridad: string
}

export interface CuestionarioGenerado {
  cuestionario: {
    titulo: string
    instrucciones: string
    preguntas: Pregunta[]
  }
  seguimiento_id: number
  fecha_generacion: string
  estado: string
}

export interface Pregunta {
  id: string
  pregunta: string
  tipo: 'opcion_multiple' | 'multiple_seleccion' | 'texto_libre'
  opciones?: string[]
  requerida: boolean
}

export interface RespuestasCuestionario {
  [preguntaId: string]: any
}

export const seguimientosService = {
  /**
   * Obtener todos los seguimientos de un paciente
   */
  async obtenerPorPaciente(pacienteId: number): Promise<Seguimiento[]> {
    const response = await apiClient.get(`/seguimientos/paciente/${pacienteId}`)
    return response.data
  },

  /**
   * Obtener seguimientos por citación específica
   */
  async obtenerPorCitacion(citacionId: number): Promise<Seguimiento[]> {
    const response = await apiClient.get(`/seguimientos/citacion/${citacionId}`)
    return response.data
  },

  /**
   * Obtener seguimientos pendientes de un paciente
   */
  async obtenerPendientes(pacienteId: number): Promise<Seguimiento[]> {
    const response = await apiClient.get(`/seguimientos/paciente/${pacienteId}/pendientes`)
    return response.data
  },

  /**
   * Verificar si una citación tiene seguimientos asociados
   */
  async tieneSeguimientos(citacionId: number): Promise<boolean> {
    try {
      const seguimientos = await seguimientosService.obtenerPorCitacion(citacionId)
      return seguimientos.length > 0
    } catch (error) {
      console.error('Error verificando seguimientos de citación:', error)
      return false
    }
  },

  /**
   * Generar cuestionario personalizado para un seguimiento
   */
  async generarCuestionario(seguimientoId: number): Promise<CuestionarioGenerado> {
    const response = await apiClient.post(`/seguimientos/${seguimientoId}/generar-cuestionario`)
    return response.data
  },

  /**
   * Completar seguimiento con respuestas del cuestionario
   */
  async completar(seguimientoId: number, respuestas: RespuestasCuestionario): Promise<Seguimiento> {
    const response = await apiClient.put(`/seguimientos/${seguimientoId}/completar`, respuestas)
    return response.data
  },

  /**
   * Obtener seguimiento por ID
   */
  async obtenerPorId(seguimientoId: number): Promise<Seguimiento> {
    const response = await apiClient.get(`/seguimientos/${seguimientoId}`)
    return response.data
  },

  /**
   * Generar seguimientos usando el workflow de n8n
   */
  async generarSeguimientos(pacienteId: number, atencionId: number, campanaId: number): Promise<any> {
    try {
      const response = await fetch(`${API_N8N_URL}/webhook/orquestador-seguimientos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paciente_id: pacienteId,
          atencion_id: atencionId,
          campana_id: campanaId
        })
      });

      if (!response.ok) {
        throw new Error(`Error del workflow: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generando seguimientos:', error);
      throw error;
    }
  }
}

export default seguimientosService 