import apiClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export interface CitacionMedica {
	id: number
	pacienteId: number
	campanaId: number
	medicoId: number
	horaProgramada: string
	horaAtencion?: string
	duracionEstimada: number
	estado: 'PROGRAMADA' | 'ATENDIDA' | 'CANCELADA' | 'NO_ASISTIO'
	prediccionAsistencia: number
	codigoTicket: string
	notas?: string
}

export interface DatoClinico {
	id?: number
	pacienteId: number
	presionSistolica: number
	presionDiastolica: number
	frecuenciaCardiacaMin: number
	frecuenciaCardiacaMax: number
	saturacionOxigeno: number
	temperatura: number
	colesterolTotal: number
	hdl: number
	observaciones?: string
	fechaMedicion: string
}

export const medicosService = {
	// Obtener todas las citaciones médicas
	obtenerCitacionesMedicas: async (): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo citaciones médicas...')
		try {
			const response = await apiClient.get(ENDPOINTS.CITACIONES.BASE)
			console.log('✅ Citaciones obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones:', error)
			throw error
		}
	},

	// Obtener citaciones por médico
	obtenerCitacionesPorMedico: async (medicoId: number): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo citaciones para médico:', medicoId)
		try {
			const response = await apiClient.get(ENDPOINTS.CITACIONES.POR_MEDICO(medicoId))
			console.log('✅ Citaciones del médico obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones del médico:', error)
			throw error
		}
	},

	// Obtener citaciones por campaña
	obtenerCitacionesPorCampana: async (campanaId: number): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo citaciones para campaña:', campanaId)
		try {
			const response = await apiClient.get(ENDPOINTS.CITACIONES.POR_CAMPANA(campanaId))
			console.log('✅ Citaciones de la campaña obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones de la campaña:', error)
			throw error
		}
	},

	// Actualizar estado de citación
	actualizarEstadoCitacion: async (citacionId: number, estado: string): Promise<CitacionMedica> => {
		console.log('🔄 Actualizando estado de citación:', citacionId, estado)
		try {
			const response = await apiClient.patch(ENDPOINTS.CITACIONES.ACTUALIZAR_ESTADO(citacionId), { estado })
			console.log('✅ Estado de citación actualizado')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar estado de citación:', error)
			throw error
		}
	},

	// Obtener todos los datos clínicos
	obtenerDatosClinicos: async (): Promise<DatoClinico[]> => {
		console.log('🔍 Obteniendo datos clínicos...')
		try {
			const response = await apiClient.get(ENDPOINTS.DATOS_CLINICOS.BASE)
			console.log('✅ Datos clínicos obtenidos:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener datos clínicos:', error)
			throw error
		}
	},

	// Obtener datos clínicos por paciente
	obtenerDatosClinicosPorPaciente: async (pacienteId: number): Promise<DatoClinico[]> => {
		console.log('🔍 Obteniendo datos clínicos para paciente:', pacienteId)
		try {
			const response = await apiClient.get(ENDPOINTS.DATOS_CLINICOS.POR_PACIENTE(pacienteId))
			console.log('✅ Datos clínicos del paciente obtenidos:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener datos clínicos del paciente:', error)
			throw error
		}
	},

	// Crear datos clínicos
	crearDatosClinicos: async (datos: Omit<DatoClinico, 'id'>): Promise<DatoClinico> => {
		console.log('📝 Creando datos clínicos para paciente:', datos.pacienteId)
		try {
			const response = await apiClient.post(ENDPOINTS.DATOS_CLINICOS.CREAR, datos)
			console.log('✅ Datos clínicos creados exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al crear datos clínicos:', error)
			throw error
		}
	},

	// Actualizar datos clínicos
	actualizarDatosClinicos: async (id: number, datos: Partial<DatoClinico>): Promise<DatoClinico> => {
		console.log('🔄 Actualizando datos clínicos:', id)
		try {
			const response = await apiClient.put(ENDPOINTS.DATOS_CLINICOS.ACTUALIZAR(id), datos)
			console.log('✅ Datos clínicos actualizados exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar datos clínicos:', error)
			throw error
		}
	}
} 