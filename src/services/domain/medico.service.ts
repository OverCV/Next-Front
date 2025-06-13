import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { Medico } from '@/src/types'

// Modelo para crear un nuevo médico
export interface CrearMedicoPayload {
	usuarioId: number;
	entidadId: number;
	especialidad: string;
}

const MedicoService = {
	/**
	 * Registra un nuevo médico en el sistema.
	 * @param payload - Datos para la creación del médico.
	 * @returns El médico creado.
	 */
	crearMedico: async (payload: CrearMedicoPayload): Promise<Medico> => {
		const { data } = await apiSpringClient.post<Medico>(ENDPOINTS.PERSONAL_MEDICO.BASE, payload);
		return data;
	},

	/**
	 * Obtiene todos los médicos asociados a una entidad de salud.
	 * @param entidadId - El ID de la entidad de salud.
	 * @returns Un array de médicos.
	 */
	obtenerMedicosPorEntidad: async (entidadId: number): Promise<Medico[]> => {
		const { data } = await apiSpringClient.get<Medico[]>(ENDPOINTS.PERSONAL_MEDICO.POR_ENTIDAD(entidadId));
		return data;
	},

	/**
	 * Obtiene un médico por su ID.
	 * @param medicoId - El ID del médico.
	 * @returns El objeto del médico.
	 */
	obtenerMedicoPorId: async (medicoId: number): Promise<Medico> => {
		const { data } = await apiSpringClient.get<Medico>(ENDPOINTS.PERSONAL_MEDICO.POR_ID(medicoId));
		return data;
	},

	/**
	 * Elimina un médico del sistema.
	 * @param medicoId - El ID del médico a eliminar.
	 */
	eliminarMedico: async (medicoId: number): Promise<void> => {
		await apiSpringClient.delete(ENDPOINTS.PERSONAL_MEDICO.POR_ID(medicoId));
	}
};

export default MedicoService; 