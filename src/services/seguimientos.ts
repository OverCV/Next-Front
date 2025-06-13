import apiClient from './api'

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
   * DEPRECADO: Generar seguimientos usando el workflow de n8n
   * AHORA: Spring Boot maneja esto automáticamente cuando una citación cambia a ATENDIDA
   */
  // async generarSeguimientos(pacienteId: number, atencionId: number, campanaId: number): Promise<any> {
  //   console.log('⚠️ MÉTODO DEPRECADO: generarSeguimientos')
  //   console.log('Spring Boot maneja seguimientos automáticamente cuando citación estado = ATENDIDA')
  //   return Promise.resolve({ 
  //     status: 'handled_by_springboot',
  //     mensaje: 'Los seguimientos se generan automáticamente en el backend'
  //   })
  // }

  /**
   * NUEVO: Método placeholder para mantener compatibilidad
   * Los seguimientos se generan automáticamente en Spring Boot
   */
  async generarSeguimientos(pacienteId: number, citacionId: number, campanaId: number): Promise<any> {
    console.log('ℹ️ Seguimientos manejados automáticamente por Spring Boot')
    console.log('📋 Citación ID:', citacionId, 'Paciente ID:', pacienteId, 'Campaña ID:', campanaId)
    
    return Promise.resolve({
      status: 'automatic_backend_handling',
      mensaje: 'Los seguimientos se generan automáticamente cuando la citación cambia a ATENDIDA',
      citacionId,
      pacienteId,
      campanaId,
      timestamp: new Date().toISOString()
    })
  }
}

export default seguimientosService 