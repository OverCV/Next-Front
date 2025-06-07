import { API_ENDPOINTS } from "../../config/api-endpoints"
import apiClient from "../api"

export const pacientesService = {
	crearPerfil: async (datos: {
		fechaNacimiento: Date
		genero: string
		direccion: string
		tipoSangre: string
		localizacionId: number
		usuarioId: number
	}) => {
		try {
			console.log("📝 PACIENTES-SERVICE: Creando perfil de paciente:", {
				...datos,
				fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0]
			})

			const response = await apiClient.post(API_ENDPOINTS.PACIENTES, {
				fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0],
				genero: datos.genero,
				direccion: datos.direccion,
				tipoSangre: datos.tipoSangre,
				localizacionId: datos.localizacionId,
				usuarioId: datos.usuarioId
			})

			console.log("✅ PACIENTES-SERVICE: Perfil creado:", response.data)
			return response.data
		} catch (error) {
			console.error("❌ PACIENTES-SERVICE: Error al crear perfil:", error)
			throw error
		}
	},

	obtenerPerfilPorUsuarioId: async (usuarioId: number) => {
		try {
			console.log("🔍 PACIENTES-SERVICE: Obteniendo perfil para usuario:", usuarioId)

			const response = await apiClient.get(`${API_ENDPOINTS.PACIENTES}/usuario/${usuarioId}`)

			console.log("✅ PACIENTES-SERVICE: Perfil obtenido:", response.data)
			return response.data
		} catch (error: any) {
			console.error("❌ PACIENTES-SERVICE: Error al obtener perfil:", error)

			// Si es 404, significa que no existe el perfil
			if (error.response?.status === 404) {
				return { existe: false }
			}

			throw error
		}
	},

	crearTriaje: async (datos: {
		pacienteId: number
		edad: number
		presionSistolica: number
		presionDiastolica: number
		colesterolTotal: number
		hdl: number
		tabaquismo: boolean
		alcoholismo: boolean
		diabetes: boolean
		peso: number
		talla: number
		dolorPecho: boolean
		dolorIrradiado: boolean
		sudoracion: boolean
		nauseas: boolean
		antecedentesCardiacos: boolean
		descripcion?: string
	}) => {
		try {
			console.log("📝 PACIENTES-SERVICE: Creando triaje para paciente:", datos.pacienteId)

			// Calcular IMC automáticamente
			const talla = datos.talla / 100 // convertir cm a metros
			const imc = Math.round((datos.peso / (talla * talla)) * 10) / 10 // IMC con 1 decimal

			const response = await apiClient.post(API_ENDPOINTS.TRIAJE, {
				...datos,
				fechaTriaje: new Date().toISOString().split('T')[0],
				imc,
				nivelPrioridad: "MEDIA" // Por defecto asignamos prioridad MEDIA
			})

			console.log("✅ PACIENTES-SERVICE: Triaje creado:", response.data)
			return response.data
		} catch (error) {
			console.error("❌ PACIENTES-SERVICE: Error al crear triaje:", error)
			throw error
		}
	},

	verificarTriaje: async (pacienteId: number) => {
		try {
			console.log("🔍 PACIENTES-SERVICE: Verificando triaje para paciente:", pacienteId)

			const response = await apiClient.get(`${API_ENDPOINTS.TRIAJE}/paciente/${pacienteId}`)

			// El backend retorna un array de triajes, verificamos si tiene elementos
			const triajes = response.data
			const tieneTriaje = Array.isArray(triajes) && triajes.length > 0

			console.log("✅ PACIENTES-SERVICE: Triaje verificado:", { pacienteId, tieneTriaje, triajes: triajes.length })

			return {
				existe: tieneTriaje,
				triajes,
				ultimoTriaje: tieneTriaje ? triajes[0] : null
			}
		} catch (error: any) {
			console.error("❌ PACIENTES-SERVICE: Error al verificar triaje:", error)

			// Si es 404, significa que no tiene triajes
			if (error.response?.status === 404) {
				return { existe: false, triajes: [], ultimoTriaje: null }
			}

			throw error
		}
	}
}