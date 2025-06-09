import { API_ENDPOINTS } from "../../config/api-endpoints"
import apiClient from "../api"

export const pacientesService = {
	crearPaciente: async (datos: {
		fechaNacimiento: Date
		genero: string
		direccion: string
		tipoSangre: string
		localizacionId: number
		usuarioId: number
	}) => {
		try {
			console.log("📝 PACIENTES-SERVICE: Creando paciente:", {
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

			console.log("✅ PACIENTES-SERVICE: Paciente creado:", response.data)
			return response.data
		} catch (error) {
			console.error("❌ PACIENTES-SERVICE: Error al crear paciente:", error)
			throw error
		}
	},

	obtenerPacientePorUsuarioId: async (usuarioId: number) => {
		try {
			console.log("🔍 PACIENTES-SERVICE: Obteniendo para usuario:", usuarioId)

			const response = await apiClient.get(`${API_ENDPOINTS.PACIENTES}/usuario/${usuarioId}`)

			console.log("✅ PACIENTES-SERVICE: Paciente obtenido:", response.data)
			return response.data
		} catch (error: any) {
			console.error("❌ PACIENTES-SERVICE: Error al obtener paciente:", error)

			// Si es 404, significa que no existe el paciente
			if (error.response?.status === 404) {
				return { existe: false }
			}

			throw error
		}
	},

	crearTriaje: async (datos: {
		pacienteId: number
		edad: number
		peso: number
		estatura: number
		tabaquismo: boolean
		alcoholismo: boolean
		diabetes: boolean
		actividadFisica: boolean
		hipertension: boolean
		dolorPecho: boolean
		dolorIrradiado: boolean
		sudoracion: boolean
		nauseas: boolean
		antecedentesCardiacos: boolean
		fechaTriaje: string
		descripcion?: string
	}) => {
		try {
			console.log("📝 PACIENTES-SERVICE: Creando triaje para paciente:", datos.pacienteId)

			const response = await apiClient.post(API_ENDPOINTS.TRIAJE, {
				pacienteId: datos.pacienteId,
				edad: datos.edad,
				peso: datos.peso,
				estatura: datos.estatura,
				tabaquismo: datos.tabaquismo,
				alcoholismo: datos.alcoholismo,
				diabetes: datos.diabetes,
				actividadFisica: datos.actividadFisica,
				hipertension: datos.hipertension,
				dolorPecho: datos.dolorPecho,
				dolorIrradiado: datos.dolorIrradiado,
				sudoracion: datos.sudoracion,
				nauseas: datos.nauseas,
				antecedentesCardiacos: datos.antecedentesCardiacos,
				fechaTriaje: datos.fechaTriaje,
				descripcion: datos.descripcion || ""
			})

			console.log("✅ PACIENTES-SERVICE: Triaje creado:", response.data)
			return response.data
		} catch (error: any) {
			console.error("❌ PACIENTES-SERVICE: Error al crear triaje:", error)
			console.error("❌ PACIENTES-SERVICE: Respuesta del servidor:", error.response?.data)
			console.error("❌ PACIENTES-SERVICE: Status:", error.response?.status)
			console.error("❌ PACIENTES-SERVICE: Headers:", error.response?.headers)
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