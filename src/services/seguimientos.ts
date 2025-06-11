import apiClient from './api'

export interface Seguimiento {
  id: number
  atencion_id?: number
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
    const response = await apiClient.get(`/api/seguimientos/paciente/${pacienteId}`)
    return response.data
  },

  /**
   * Obtener seguimientos pendientes de un paciente
   */
  async obtenerPendientes(pacienteId: number): Promise<Seguimiento[]> {
    const response = await apiClient.get(`/api/seguimientos/paciente/${pacienteId}/pendientes`)
    return response.data
  },

  /**
   * Generar cuestionario personalizado para un seguimiento
   */
  async generarCuestionario(seguimientoId: number): Promise<CuestionarioGenerado> {
    const response = await apiClient.post(`/api/seguimientos/${seguimientoId}/generar-cuestionario`)
    return response.data
  },

  /**
   * Completar seguimiento con respuestas del cuestionario
   */
  async completar(seguimientoId: number, respuestas: RespuestasCuestionario): Promise<Seguimiento> {
    const response = await apiClient.put(`/api/seguimientos/${seguimientoId}/completar`, respuestas)
    return response.data
  },

  /**
   * Obtener seguimiento por ID
   */
  async obtenerPorId(seguimientoId: number): Promise<Seguimiento> {
    const response = await apiClient.get(`/api/seguimientos/${seguimientoId}`)
    return response.data
  }
}

export default seguimientosService 