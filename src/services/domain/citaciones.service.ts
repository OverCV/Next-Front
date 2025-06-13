import { Citacion, EstadoCitacion } from '@/src/types'

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
			const response = await apiSpringClient.put(ENDPOINTS.CITACIONES.ACTUALIZAR_ESTADO(citacionId), {
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

	// NUEVA FUNCIONALIDAD: Cancelación avanzada para auxiliares
	// Cancela, elimina, desvincula paciente y reorganiza horarios
	cancelarYEliminarCitacion: async (citacionId: number): Promise<{
		citacionEliminada: boolean
		pacienteDesvinculado: boolean
		horariosReorganizados: number
		mensaje: string
	}> => {
		console.log('🗑️ Iniciando cancelación avanzada de citación:', citacionId)
		
		try {
			// 1. Obtener datos de la citación antes de eliminarla
			const citacion = await citacionesService.obtenerCitacionPorId(citacionId)
			const { pacienteId, campanaId } = citacion
			
			console.log('📋 Datos de la citación:', { pacienteId, campanaId })

			// 2. Obtener todas las citaciones de la campaña para reorganizar
			const citacionesCampana = await citacionesService.obtenerCitacionesPorCampana(campanaId)
			
			// Filtrar citaciones posteriores a la que se va a cancelar
			const citacionesPosteriores = citacionesCampana
				.filter(c => c.id !== citacionId && c.estado === EstadoCitacion.AGENDADA)
				.filter(c => new Date(c.horaProgramada) > new Date(citacion.horaProgramada))
				.sort((a, b) => new Date(a.horaProgramada).getTime() - new Date(b.horaProgramada).getTime())

			console.log(`📅 Citaciones posteriores a reorganizar: ${citacionesPosteriores.length}`)

			// 3. Eliminar la citación de la base de datos
			await apiSpringClient.delete(ENDPOINTS.CITACIONES.ELIMINAR(citacionId))
			console.log('✅ Citación eliminada de la base de datos')

			// 4. Desvincular paciente de la campaña
			let pacienteDesvinculado = false
			try {
				// Importar dinámicamente para evitar dependencias circulares
				const { inscripcionesService } = await import('./inscripciones.service')
				
				// Obtener información del paciente para conseguir el usuarioId
				const pacienteResponse = await apiSpringClient.get(`${ENDPOINTS.PACIENTES.BASE}/${pacienteId}`)
				const paciente = pacienteResponse.data
				
				if (paciente?.usuarioId) {
					// Buscar la inscripción del usuario en la campaña
					const inscripciones = await inscripcionesService.obtenerInscripcionesPorUsuario(paciente.usuarioId)
					const inscripcionCampana = inscripciones.find(inscripcion => 
						inscripcion.campanaId === campanaId
					)

					if (inscripcionCampana) {
						await inscripcionesService.eliminarInscripcion(inscripcionCampana.id)
						pacienteDesvinculado = true
						console.log('🔓 Paciente desvinculado de la campaña')
					}
				}
			} catch (error) {
				console.error('❌ Error al desvincular paciente:', error)
			}

			// 5. Reorganizar horarios de citaciones posteriores
			let horariosReorganizados = 0
			if (citacionesPosteriores.length > 0) {
				const duracionCita = citacion.duracionEstimada || 30 // minutos por defecto
				
				for (const citacionPosterior of citacionesPosteriores) {
					try {
						// Adelantar la hora de la citación por la duración de la citación cancelada
						const horaActual = new Date(citacionPosterior.horaProgramada)
						const nuevaHora = new Date(horaActual.getTime() - (duracionCita * 60 * 1000))
						
						// Actualizar la citación con la nueva hora
						await citacionesService.actualizarCitacion(citacionPosterior.id, {
							...citacionPosterior,
							horaProgramada: nuevaHora.toISOString()
						})
						
						horariosReorganizados++
						console.log(`⏰ Citación ${citacionPosterior.id} reorganizada: ${horaActual.toLocaleTimeString()} → ${nuevaHora.toLocaleTimeString()}`)
					} catch (error) {
						console.error(`❌ Error reorganizando citación ${citacionPosterior.id}:`, error)
					}
				}
			}

			const resultado = {
				citacionEliminada: true,
				pacienteDesvinculado,
				horariosReorganizados,
				mensaje: `Citación eliminada exitosamente. ${pacienteDesvinculado ? 'Paciente desvinculado. ' : ''}${horariosReorganizados} horarios reorganizados.`
			}

			console.log('✅ Cancelación avanzada completada:', resultado)
			return resultado

		} catch (error) {
			console.error('❌ Error en cancelación avanzada:', error)
			throw new Error(`Error al cancelar citación: ${error instanceof Error ? error.message : 'Error desconocido'}`)
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
			const response = await apiSpringClient.put(`${ENDPOINTS.CITACIONES.BASE}/${citacionId}/marcar-atendida`)
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
			const response = await apiSpringClient.put(`${ENDPOINTS.CITACIONES.BASE}/${citacionId}/completar-atencion`, payload)
			console.log('✅ Atención médica completada')
			return response.data
		} catch (error) {
			console.error('❌ Error al completar atención médica:', error)
			throw error
		}
	}
} 