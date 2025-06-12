import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'

export interface PersonalMedico {
	id?: number
	usuarioId: number
	numeroProfesional: string
	especialidad: string
	experiencia: number
	nombreCompleto?: string
	correo?: string
	telefono?: string
	identificacion?: string
}

export const personalMedicoService = {
	/**
	 * Crear un nuevo registro de personal médico
	 */
	crearPersonalMedico: async (datos: Omit<PersonalMedico, 'id'>): Promise<PersonalMedico> => {
		try {
			console.log('🏥 MEDICOS-SERVICE: Creando personal médico...', datos)
			const response = await apiSpringClient.post(ENDPOINTS.PERSONAL_MEDICO.BASE, datos)
			console.log('✅ MEDICOS-SERVICE: Personal médico creado exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ MEDICOS-SERVICE: Error al crear personal médico:', error)
			throw error
		}
	},

	/**
	 * Obtener personal médico por ID
	 */
	obtenerPersonalMedicoPorId: async (medicoId: number): Promise<PersonalMedico> => {
		try {
			console.log('🔍 MEDICOS-SERVICE: Obteniendo personal médico por ID:', medicoId)
			const response = await apiSpringClient.get(ENDPOINTS.PERSONAL_MEDICO.POR_ID(medicoId))
			return response.data
		} catch (error) {
			console.error('❌ MEDICOS-SERVICE: Error al obtener personal médico:', error)
			throw error
		}
	},

	/**
	 * Obtener todo el personal médico
	 */
	obtenerTodoPersonalMedico: async (): Promise<PersonalMedico[]> => {
		try {
			console.log('🔍 MEDICOS-SERVICE: Obteniendo todo el personal médico...')
			const response = await apiSpringClient.get(ENDPOINTS.PERSONAL_MEDICO.BASE)
			return response.data
		} catch (error) {
			console.error('❌ MEDICOS-SERVICE: Error al obtener personal médico:', error)
			throw error
		}
	}
}

export default personalMedicoService 