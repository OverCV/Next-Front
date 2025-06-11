import { CitacionMedica } from '@/src/types'

import apiSpringClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export const citacionesService = {
	// Obtener citación por ID
	obtenerCitacionPorId: async (citacionId: number): Promise<CitacionMedica> => {
		console.log('🔍 Obteniendo citación por ID:', citacionId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.CITACIONES.POR_ID(citacionId))
			console.log('✅ Citación obtenida por ID')
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citación por ID:', error)
			throw error
		}
	},

	// Obtener todas las citaciones médicas
	obtenerTodasCitaciones: async (): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo todas las citaciones médicas...')
		try {
			const response = await apiSpringClient.get(ENDPOINTS.CITACIONES.BASE)
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
			const response = await apiSpringClient.get(ENDPOINTS.CITACIONES.POR_MEDICO(medicoId))
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
			const response = await apiSpringClient.get(ENDPOINTS.CITACIONES.POR_CAMPANA(campanaId))
			console.log('✅ Citaciones de la campaña obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones de la campaña:', error)
			throw error
		}
	},

	// Actualizar citación completa (PUT) - método principal
	actualizarCitacion: async (citacionId: number, citacionData: Partial<CitacionMedica>): Promise<CitacionMedica> => {
		console.log('🔄 Actualizando citación completa:', citacionId)
		try {
			const response = await apiSpringClient.put(ENDPOINTS.CITACIONES.ACTUALIZAR(citacionId), citacionData)
			console.log('✅ Citación actualizada completamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar citación:', error)
			throw error
		}
	},

	// Actualizar solo estado de citación (PATCH) - método alternativo más simple
	actualizarEstadoCitacion: async (citacionId: number, estado: string): Promise<CitacionMedica> => {
		console.log('🔄 Actualizando estado de citación:', citacionId, estado)
		try {
			const response = await apiSpringClient.patch(ENDPOINTS.CITACIONES.ACTUALIZAR_ESTADO(citacionId), { estado })
			console.log('✅ Estado de citación actualizado')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar estado de citación:', error)
			throw error
		}
	},

	// Cancelar citación (auxiliares) - obtiene primero y luego actualiza
	cancelarCitacion: async (citacionId: number): Promise<CitacionMedica> => {
		console.log('❌ Cancelando citación:', citacionId)
		try {
			// Obtener la citación completa primero
			const citacionActual = await citacionesService.obtenerCitacionPorId(citacionId)

			// Actualizar solo el estado
			const citacionActualizada = {
				...citacionActual,
				estado: 'CANCELADA' as const
			}

			const response = await apiSpringClient.put(ENDPOINTS.CITACIONES.ACTUALIZAR(citacionId), citacionActualizada)
			console.log('✅ Citación cancelada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al cancelar citación:', error)
			throw error
		}
	},

	// Reprogramar citación (auxiliares) - obtiene primero y luego actualiza
	reprogramarCitacion: async (citacionId: number): Promise<CitacionMedica> => {
		console.log('📅 Reprogramando citación:', citacionId)
		try {
			// Obtener la citación completa primero
			const citacionActual = await citacionesService.obtenerCitacionPorId(citacionId)

			// Actualizar solo el estado
			const citacionActualizada = {
				...citacionActual,
				estado: 'AGENDADA' as const
			}

			const response = await apiSpringClient.put(ENDPOINTS.CITACIONES.ACTUALIZAR(citacionId), citacionActualizada)
			console.log('✅ Citación reprogramada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al reprogramar citación:', error)
			throw error
		}
	},

	// Marcar citación como atendida (médicos)
	atenderCitacion: async (citacionId: number): Promise<CitacionMedica> => {
		console.log('👨‍⚕️ Marcando citación como atendida:', citacionId)
		try {
			// Obtener la citación completa primero
			const citacionActual = await citacionesService.obtenerCitacionPorId(citacionId)

			// Actualizar estado y hora de atención
			const horaAtencion = new Date().toISOString()
			const citacionActualizada = {
				...citacionActual,
				estado: 'ATENDIDA' as const,
				horaAtencion
			}

			const response = await apiSpringClient.put(ENDPOINTS.CITACIONES.ACTUALIZAR(citacionId), citacionActualizada)
			console.log('✅ Citación marcada como atendida')
			return response.data
		} catch (error) {
			console.error('❌ Error al marcar citación como atendida:', error)
			throw error
		}
	}
} 