import { DatoClinico, TriajePaciente, PacienteInfo, UsuarioInfo, PacienteCompleto } from '@/src/types'

import apiSpringClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export const medicosService = {
	// Obtener todos los datos clínicos
	obtenerDatosClinicos: async (): Promise<DatoClinico[]> => {
		console.log('🔍 Obteniendo datos clínicos...')
		try {
			const response = await apiSpringClient.get(ENDPOINTS.DATOS_CLINICOS.BASE)
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
			const response = await apiSpringClient.get(ENDPOINTS.DATOS_CLINICOS.POR_PACIENTE(pacienteId))
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
			const response = await apiSpringClient.post(ENDPOINTS.DATOS_CLINICOS.CREAR, datos)
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
			const response = await apiSpringClient.put(ENDPOINTS.DATOS_CLINICOS.ACTUALIZAR(id), datos)
			console.log('✅ Datos clínicos actualizados exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar datos clínicos:', error)
			throw error
		}
	},

	// Obtener triajes de un paciente
	obtenerTriajesPorPaciente: async (pacienteId: number): Promise<TriajePaciente[]> => {
		console.log('🔍 Obteniendo triajes para paciente:', pacienteId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.TRIAJES.POR_PACIENTE(pacienteId))
			console.log('✅ Triajes del paciente obtenidos:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener triajes del paciente:', error)
			throw error
		}
	},

	// Obtener información del paciente
	obtenerPaciente: async (pacienteId: number): Promise<PacienteInfo> => {
		console.log('🔍 Obteniendo información del paciente:', pacienteId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.PACIENTES.POR_ID(pacienteId))
			console.log('✅ Información del paciente obtenida')
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener información del paciente:', error)
			throw error
		}
	},

	// Obtener información del usuario
	obtenerUsuario: async (usuarioId: number): Promise<UsuarioInfo> => {
		console.log('🔍 Obteniendo información del usuario:', usuarioId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.USUARIOS.PERFIL(usuarioId))
			console.log('✅ Información del usuario obtenida')
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener información del usuario:', error)
			throw error
		}
	},

	// Obtener información completa del paciente (consolidada)
	obtenerPacienteCompleto: async (pacienteId: number): Promise<PacienteCompleto> => {
		console.log('🔍 Obteniendo información completa del paciente:', pacienteId)
		try {
			// Obtener información básica del paciente
			const paciente = await medicosService.obtenerPaciente(pacienteId)

			// Obtener información del usuario
			const usuario = await medicosService.obtenerUsuario(paciente.usuarioId)

			// Obtener triajes del paciente
			const triajes = await medicosService.obtenerTriajesPorPaciente(pacienteId)

			// Obtener datos clínicos recientes
			const datosClinicosRecientes = await medicosService.obtenerDatosClinicosPorPaciente(pacienteId)

			console.log('✅ Información completa del paciente obtenida')
			return {
				paciente,
				usuario,
				triajes,
				datosClinicosRecientes
			}
		} catch (error) {
			console.error('❌ Error al obtener información completa del paciente:', error)
			throw error
		}
	}
} 