import { Citacion } from '@/src/types'

import apiSpringClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export const citacionesService = {
	// Obtener citación por ID
	obtenerCitacionPorId: async (citacionId: number): Promise<Citacion> => {
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
	obtenerTodasCitaciones: async (): Promise<Citacion[]> => {
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
	obtenerCitacionesPorMedico: async (medicoId: number): Promise<Citacion[]> => {
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
	obtenerCitacionesPorCampana: async (campanaId: number): Promise<Citacion[]> => {
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
	actualizarCitacion: async (citacionId: number, citacionData: Partial<Citacion>): Promise<Citacion> => {
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

	// Actualizar estado de citación (auxiliares/médicos)
	actualizarEstadoCitacion: async (citacionId: number, nuevoEstado: EstadoCitacion): Promise<any> => {
		console.log('🔄 Actualizando estado de citación:', citacionId, nuevoEstado)
		try {
			const response = await apiSpringClient.put(`/api/citaciones-medicas/${citacionId}/estado`, {
				estado: nuevoEstado
			})
			console.log('✅ Estado de citación actualizado')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar estado de citación:', error)
			throw error
		}
	},

	// Cancelar citación (auxiliares) - obtiene primero y luego actualiza
	cancelarCitacion: async (citacionId: number): Promise<Citacion> => {
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
	reprogramarCitacion: async (citacionId: number): Promise<Citacion> => {
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

	// Marcar citación como atendida con seguimientos automáticos (médicos)
	marcarComoAtendida: async (citacionId: number): Promise<any> => {
		console.log('🩺 Marcando citación como atendida:', citacionId)
		try {
			const response = await apiSpringClient.put(`/api/citaciones-medicas/${citacionId}/marcar-atendida`)
			console.log('✅ Citación marcada como atendida - Seguimientos iniciados')
			return response.data
		} catch (error) {
			console.error('❌ Error al marcar citación como atendida:', error)
			throw error
		}
	},

	// Completar atención médica con hora específica
	completarAtencion: async (citacionId: number, horaAtencion?: string): Promise<any> => {
		console.log('📋 Completando atención médica:', citacionId)
		try {
			const payload = horaAtencion ? { hora_atencion: horaAtencion } : {}
			const response = await apiSpringClient.put(`/api/citaciones-medicas/${citacionId}/completar-atencion`, payload)
			console.log('✅ Atención médica completada')
			return response.data
		} catch (error) {
			console.error('❌ Error al completar atención médica:', error)
			throw error
		}
	}
} 