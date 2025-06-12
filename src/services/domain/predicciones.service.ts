import { PrediccionRiesgoCV, PrediccionGuardada, HealthCheck } from '@/src/types'

import apiSpringClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export const prediccionesService = {
	// Verificar estado de la API de FastAPI
	verificarSaludFastAPI: async (): Promise<HealthCheck> => {
		console.log('🔍 Verificando estado de FastAPI...')
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.HEALTH, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
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
	predecirRiesgoCardiovascular: async (pacienteId: number, campanaId: number): Promise<PredictionResponse> => {
		console.log('🔮 Prediciendo riesgo cardiovascular...')
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.PREDECIR_RIESGO(pacienteId, campanaId), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Predicción completada:', data)
			return data
		} catch (error) {
			console.error('❌ Error al predecir riesgo:', error)
			throw error
		}
	},

	// Actualizar priorización después del triaje
	actualizarPriorizacionPorTriaje: async (pacienteId: number): Promise<any> => {
		console.log('🔄 Actualizando priorización después del triaje para paciente:', pacienteId)
		try {
			const response = await fetch(`${ENDPOINTS.FASTAPI.PRIORIZACION.ACTUALIZAR_POR_TRIAJE}?paciente_id=${pacienteId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Priorización actualizada:', data)
			return data
		} catch (error) {
			console.error('❌ Error al actualizar priorización:', error)
			// No lanzamos el error para que no afecte el flujo principal del triaje
			console.warn('⚠️ La priorización no se pudo actualizar, pero el triaje fue exitoso')
			return null
		}
	},

	// Obtener priorización de pacientes para una campaña
	obtenerPriorizacionCampana: async (campanaId: number): Promise<any> => {
		console.log('📊 Obteniendo priorización para campaña:', campanaId)
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.PRIORIZACION.CAMPANA_PACIENTES(campanaId), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Priorización obtenida:', data)
			return data
		} catch (error) {
			console.error('❌ Error al obtener priorización:', error)
			throw error
		}
	},

	// Obtener citaciones de un paciente
	obtenerCitacionesPaciente: async (pacienteId: number, estado?: string): Promise<any> => {
		console.log('📅 Obteniendo citaciones para paciente:', pacienteId)
		try {
			let url = ENDPOINTS.FASTAPI.PRIORIZACION.CITACIONES_PACIENTE(pacienteId)
			if (estado) {
				url += `?estado=${estado}`
			}
			
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Citaciones obtenidas:', data)
			return data
		} catch (error) {
			console.error('❌ Error al obtener citaciones:', error)
			throw error
		}
	},

	// Obtener todas las predicciones guardadas
	obtenerPredicciones: async (): Promise<PrediccionGuardada[]> => {
		console.log('🔍 Obteniendo predicciones guardadas...')
		try {
			const response = await apiSpringClient.get(ENDPOINTS.PREDICCIONES.BASE)
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
			const response = await apiSpringClient.get(ENDPOINTS.PREDICCIONES.POR_PACIENTE(pacienteId))
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
			const response = await apiSpringClient.get(ENDPOINTS.PREDICCIONES.POR_CAMPANA(campanaId))
			console.log('✅ Predicciones de la campaña obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener predicciones de la campaña:', error)
			throw error
		}
	}
} 