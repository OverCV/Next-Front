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
	predecirRiesgoCardiovascular: async (pacienteId: number, campanaId: number): Promise<any> => {
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

	// Actualizar priorización por triaje (FastAPI)
	actualizarPriorizacionPorTriaje: async (pacienteId: number): Promise<any> => {
		console.log('🔄 Actualizando priorización por triaje para paciente:', pacienteId)
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.PRIORIZACION.ACTUALIZAR_POR_TRIAJE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ paciente_id: pacienteId }),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Priorización actualizada:', data)
			return data
		} catch (error) {
			console.error('❌ Error al actualizar priorización:', error)
			throw error
		}
	},

	// Obtener pacientes priorizados de una campaña (FastAPI)
	obtenerPacientesPriorizados: async (campanaId: number): Promise<any> => {
		console.log('📊 Obteniendo pacientes priorizados para campaña:', campanaId)
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.PRIORIZACION.CAMPANA_PACIENTES(campanaId), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				// Si es un error 404 o similar, podría ser que no hay pacientes inscritos
				if (response.status === 404) {
					console.log('ℹ️ No se encontraron pacientes priorizados para la campaña:', campanaId)
					return [] // Retornar array vacío en lugar de lanzar error
				}
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Pacientes priorizados obtenidos:', data)
			return data || [] // Asegurar que siempre se retorne un array
		} catch (error: any) {
			console.error('❌ Error al obtener pacientes priorizados:', error)
			
			// Si el error contiene mensajes que sugieren que no hay pacientes, retornar array vacío
			const errorMessage = error?.message || error?.toString() || ''
			if (errorMessage.includes('No se encontraron pacientes') || 
				errorMessage.includes('No patients found') ||
				errorMessage.includes('404')) {
				console.log('ℹ️ Interpretando como campaña sin pacientes inscritos')
				return []
			}
			
			throw error
		}
	},

	// Generar priorización manual (FastAPI)
	generarPriorizacionManual: async (campanaId: number): Promise<any> => {
		console.log('🔧 Generando priorización manual para campaña:', campanaId)
		try {
			const response = await fetch(ENDPOINTS.FASTAPI.PRIORIZACION.GENERAR_MANUAL(campanaId), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('✅ Priorización manual generada:', data)
			return data
		} catch (error) {
			console.error('❌ Error al generar priorización manual:', error)
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