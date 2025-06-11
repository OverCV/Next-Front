import apiClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

// Interfaces para las predicciones
export interface FactorInfluyente {
	[key: string]: number
}

export interface PrediccionRiesgoCV {
	confianza: number
	factores_principales: FactorInfluyente[]
	fecha_prediccion: string
	modelo_version: string
	nivel_riesgo: string
	probabilidad: number
	recomendaciones: string[]
	riesgo: boolean
	valor_prediccion: number
}

export interface PrediccionGuardada {
	id: number
	pacienteId: number
	campanaId: number
	valorPrediccion: number
	confianza: number
	factoresInfluyentes: object
	fechaPrediccion: string
	modeloVersion: string
	tipo: string
	nivelRiesgo: string
	recomendaciones: string[]
	creadoPor: string
	actualizadoPor?: string
	fechaCreacion: string
	fechaActualizacion?: string
}

export interface HealthCheck {
	status: string
	service: string
	version: string
}

export const prediccionesService = {
	// Verificar estado de la API de FastAPI
	verificarSaludFastAPI: async (): Promise<HealthCheck> => {
		console.log('🔍 Verificando estado de FastAPI...')
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.HEALTH, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
				}
			})

			if (!response.ok) {
				throw new Error(`Error HTTP: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ FastAPI está disponible:', data)
			return data
		} catch (error) {
			console.error('❌ Error al verificar FastAPI:', error)
			throw error
		}
	},

	// Predecir riesgo cardiovascular (FastAPI)
	predecirRiesgoCV: async (pacienteId: number, campanaId: number, token: string): Promise<PrediccionRiesgoCV> => {
		console.log('🔮 Prediciendo riesgo CV para paciente:', pacienteId, 'campaña:', campanaId)
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.PREDECIR_RIESGO(pacienteId, campanaId), {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'spring-auth': token
				}
			})

			if (!response.ok) {
				const errorData = await response.text()
				console.error('Error response:', errorData)
				throw new Error(`Error HTTP: ${response.status} - ${errorData}`)
			}

			const data = await response.json()
			console.log('✅ Predicción de riesgo CV completada:', data)
			return data
		} catch (error) {
			console.error('❌ Error al predecir riesgo CV:', error)
			throw error
		}
	},

	// Obtener todas las predicciones guardadas
	obtenerPredicciones: async (): Promise<PrediccionGuardada[]> => {
		console.log('🔍 Obteniendo predicciones guardadas...')
		try {
			const response = await apiClient.get(ENDPOINTS.PREDICCIONES.BASE)
			console.log('✅ Predicciones obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener predicciones:', error)
			throw error
		}
	},

	// Obtener predicciones por paciente
	obtenerPrediccionesPorPaciente: async (pacienteId: number): Promise<PrediccionGuardada[]> => {
		console.log('🔍 Obteniendo predicciones para paciente:', pacienteId)
		try {
			const response = await apiClient.get(ENDPOINTS.PREDICCIONES.POR_PACIENTE(pacienteId))
			console.log('✅ Predicciones del paciente obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener predicciones del paciente:', error)
			throw error
		}
	},

	// Obtener predicciones por campaña
	obtenerPrediccionesPorCampana: async (campanaId: number): Promise<PrediccionGuardada[]> => {
		console.log('🔍 Obteniendo predicciones para campaña:', campanaId)
		try {
			const response = await apiClient.get(ENDPOINTS.PREDICCIONES.POR_CAMPANA(campanaId))
			console.log('✅ Predicciones de la campaña obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener predicciones de la campaña:', error)
			throw error
		}
	}
} 