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