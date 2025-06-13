import { AtencionMedica, CrearAtencionMedica, EstadoAtencion } from '@/src/types'

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const atencionesService = {
	// Obtener atención por ID
	obtenerAtencionPorId: async (atencionId: number): Promise<AtencionMedica> => {
		console.log('🔍 Obteniendo atención por ID:', atencionId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.ATENCIONES_MEDICAS.POR_ID(atencionId))
			console.log('✅ Atención obtenida por ID')
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener atención por ID:', error)
			throw error
		}
	},

	// Obtener atención por citación (para verificar si ya existe)
	obtenerAtencionPorCitacion: async (citacionId: number): Promise<AtencionMedica | null> => {
		console.log('🔍 Verificando atención existente para citación:', citacionId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.ATENCIONES_MEDICAS.POR_CITACION(citacionId))
			console.log('✅ Atención encontrada para la citación')
			return response.data
		} catch (error: any) {
			// Si es 404, significa que no existe atención para esa citación
			if (error.response?.status === 404) {
				console.log('ℹ️ No existe atención para esta citación')
				return null
			}
			console.error('❌ Error al verificar atención por citación:', error)
			throw error
		}
	},

	// Crear nueva atención médica
	crearAtencion: async (datosAtencion: CrearAtencionMedica): Promise<AtencionMedica> => {
		console.log('📝 Creando nueva atención médica para citación:', datosAtencion.citacionId)
		try {
			const response = await apiSpringClient.post(ENDPOINTS.ATENCIONES_MEDICAS.BASE, datosAtencion)
			console.log('✅ Atención médica creada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al crear atención médica:', error)
			throw error
		}
	},

	// Iniciar atención (crear con estado EN_PROCESO)
	iniciarAtencion: async (citacionId: number): Promise<AtencionMedica> => {
		console.log('🚀📅 Iniciando atención para citación:', citacionId)
		try {
			// Verificar si ya existe una atención
			const atencionExistente = await atencionesService.obtenerAtencionPorCitacion(citacionId)

			if (atencionExistente) {
				console.log('ℹ️📅 Ya existe una atención para esta citación')
				return atencionExistente
			}

			// Crear nueva atención
			const nuevaAtencion: CrearAtencionMedica = {
				citacionId,
				fechaHoraInicio: new Date().toISOString(),
				estado: EstadoAtencion.EN_PROCESO
			}

			return await atencionesService.crearAtencion(nuevaAtencion)
		} catch (error) {
			console.error('❌📅 Error al iniciar atención:', error)
			throw error
		}
	},

	// Finalizar atención (actualizar a COMPLETADA)
	finalizarAtencion: async (atencionId: number): Promise<AtencionMedica> => {
		console.log('🏁📅 Finalizando atención:', atencionId)
		try {
			const fechaHoraFin = new Date().toISOString()
			const fechaInicio = new Date((await atencionesService.obtenerAtencionPorId(atencionId)).fechaHoraInicio)
			const duracionReal = Math.round((new Date(fechaHoraFin).getTime() - fechaInicio.getTime()) / (1000 * 60)) // en minutos

			const datosActualizacion = {
				fechaHoraFin,
				duracionReal,
				estado: EstadoAtencion.COMPLETADA
			}

			const response = await apiSpringClient.put(ENDPOINTS.ATENCIONES_MEDICAS.ACTUALIZAR(atencionId), datosActualizacion)
			console.log('✅📅 Atención finalizada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌📅 Error al finalizar atención:', error)
			throw error
		}
	},

	// Cancelar atención
	cancelarAtencion: async (atencionId: number): Promise<AtencionMedica> => {
		console.log('❌ Cancelando atención:', atencionId)
		try {
			const datosActualizacion = {
				estado: EstadoAtencion.CANCELADA,
				fechaHoraFin: new Date().toISOString()
			}

			const response = await apiSpringClient.put(ENDPOINTS.ATENCIONES_MEDICAS.ACTUALIZAR(atencionId), datosActualizacion)
			console.log('✅📅 Atención cancelada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌📅 Error al cancelar atención:', error)
			throw error
		}
	},

	// Actualizar atención (método genérico)
	actualizarAtencion: async (atencionId: number, datos: Partial<AtencionMedica>): Promise<AtencionMedica> => {
		console.log('🔄📅 Actualizando atención:', atencionId)
		try {
			const response = await apiSpringClient.put(ENDPOINTS.ATENCIONES_MEDICAS.ACTUALIZAR(atencionId), datos)
			console.log('✅📅 Atención actualizada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar atención:', error)
			throw error
		}
	},

	registrarDiagnostico: async (pacienteId: number, diagnostico: any) => {
		try {
			const response = await apiSpringClient.post(`${ENDPOINTS.ATENCIONES_MEDICAS.BASE}/diagnostico/${pacienteId}`, diagnostico)
			return response.data
		} catch (error) {
			console.error("📅 Error al registrar diagnóstico:", error)
			throw error
		}
	},

	obtenerHistorialAtenciones: async (pacienteId: number) => {
		try {
			const response = await apiSpringClient.get(`${ENDPOINTS.ATENCIONES_MEDICAS.BASE}/historial/${pacienteId}`)
			return response.data
		} catch (error) {
			console.error("📅 Error al obtener historial de atenciones:", error)
			return []
		}
	}
}