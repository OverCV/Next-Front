import { InscripcionCampana, CampanaConLocalizacion } from '@/src/types';
import apiSpringClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export interface InscripcionCompleta {
	inscripcion: InscripcionCampana
	campana: CampanaConLocalizacion
}

export const inscripcionesService = {
	// Obtener inscripciones de un usuario
	obtenerInscripcionesPorUsuario: async (usuarioId: number): Promise<InscripcionCampana[]> => {
		console.log('🔍 Obteniendo inscripciones para usuario:', usuarioId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.INSCRIPCIONES.POR_USUARIO(usuarioId))
			console.log('✅ Inscripciones obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener inscripciones:', error)
			throw error
		}
	},

	// Obtener campaña por ID
	obtenerCampanaPorId: async (campanaId: number): Promise<CampanaConLocalizacion> => {
		console.log('🔍 Obteniendo campaña:', campanaId)
		try {
			const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.POR_ID(campanaId))
			console.log('✅ Campaña obtenida:', response.data.nombre)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener campaña:', error)
			throw error
		}
	},

	// Obtener localización por ID
	obtenerLocalizacionPorId: async (localizacionId: number) => {
		console.log('🔍 Obteniendo localización:', localizacionId)
		try {
			const response = await apiSpringClient.get(`/localizaciones/${localizacionId}`)
			console.log('✅ Localización obtenida:', response.data.municipio)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener localización:', error)
			throw error
		}
	},

	// Obtener inscripciones completas de un usuario (con datos de campaña y localización)
	obtenerInscripcionesCompletas: async (usuarioId: number): Promise<InscripcionCompleta[]> => {
		console.log('🔍 Obteniendo inscripciones completas para usuario:', usuarioId)
		try {
			// Obtener inscripciones
			const inscripciones = await inscripcionesService.obtenerInscripcionesPorUsuario(usuarioId)

			// Obtener datos completos para cada inscripción
			const inscripcionesCompletas = await Promise.all(
				inscripciones.map(async (inscripcion) => {
					const campana = await inscripcionesService.obtenerCampanaPorId(inscripcion.campanaId)

					// Obtener localización si existe
					if (campana.localizacionId) {
						try {
							const localizacion = await inscripcionesService.obtenerLocalizacionPorId(campana.localizacionId)
							campana.localizacion = localizacion
						} catch (error) {
							console.warn('No se pudo obtener localización para campaña:', campana.id)
						}
					}

					return {
						inscripcion,
						campana
					}
				})
			)

			console.log('✅ Inscripciones completas obtenidas:', inscripcionesCompletas.length)
			return inscripcionesCompletas
		} catch (error) {
			console.error('❌ Error al obtener inscripciones completas:', error)
			throw error
		}
	},

	// Crear nueva inscripción
	crearInscripcion: async (usuarioId: number, campanaId: number): Promise<InscripcionCampana> => {
		console.log('📝 Creando inscripción - Usuario:', usuarioId, 'Campaña:', campanaId)
		try {
			const response = await apiSpringClient.post(ENDPOINTS.CAMPANAS.INSCRIPCIONES.CREAR, {
				usuarioId,
				campanaId
			})
			console.log('✅ Inscripción creada exitosamente')
			return response.data
		} catch (error) {
			console.error('❌ Error al crear inscripción:', error)
			throw error
		}
	},

	// Eliminar inscripción por ID
	eliminarInscripcion: async (inscripcionId: number): Promise<void> => {
		console.log('🗑️ Eliminando inscripción ID:', inscripcionId)
		try {
			await apiSpringClient.delete(`${ENDPOINTS.CAMPANAS.INSCRIPCIONES.BASE}/${inscripcionId}`)
			console.log('✅ Inscripción eliminada exitosamente')
		} catch (error) {
			console.error('❌ Error al eliminar inscripción:', error)
			throw error
		}
	}
} 