import { CrearInscripcionCampana, InscripcionCampana } from "@/src/types"

import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

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
			const response = await apiSpringClient.post(ENDPOINTS.PACIENTES.BASE, {
				fechaNacimiento: datos.fechaNacimiento.toISOString().split('T')[0],
				genero: datos.genero,
				direccion: datos.direccion,
				tipoSangre: datos.tipoSangre,
				localizacionId: datos.localizacionId,
				usuarioId: datos.usuarioId
			})

			return response.data
		} catch (error) {
			console.error("❌ Error al crear paciente:", error)
			throw error
		}
	},

	obtenerPacientePorUsuarioId: async (usuarioId: number) => {
		try {
			const response = await apiSpringClient.get(ENDPOINTS.PACIENTES.PERFIL(usuarioId))
			return response.data
		} catch (error: any) {
			// Si es 404, significa que no existe el paciente
			if (error.response?.status === 404) {
				return { existe: false }
			}
			throw error
		}
	},

	// Función para verificar si existe un paciente (consolidada desde auth)
	verificarPaciente: async (usuarioId: number): Promise<{ existe: boolean; id?: number; datos?: any }> => {
		try {
			console.log("🔍 PACIENTES-SERVICE: Verificando paciente para usuario:", usuarioId)

			const response = await apiSpringClient.get(ENDPOINTS.PACIENTES.PERFIL(usuarioId))

			console.log("✅ PACIENTES-SERVICE: Paciente encontrado:", response.data)
			return { existe: true, id: response.data.id, datos: response.data }

		} catch (error: any) {
			console.error("❌ PACIENTES-SERVICE: Error al verificar paciente:", error)

			// Si es 404, significa que no existe
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
			const response = await apiSpringClient.post(ENDPOINTS.PACIENTES.CREAR_TRIAJE, {
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

			return response.data
		} catch (error: any) {
			console.error("❌ Error al crear triaje:", error)
			throw error
		}
	},

	verificarTriaje: async (pacienteId: number) => {
		try {
			const response = await apiSpringClient.get(ENDPOINTS.TRIAJES.POR_PACIENTE(pacienteId))

			// El backend retorna un array de triajes, verificamos si tiene elementos
			const triajes = response.data
			const tieneTriaje = Array.isArray(triajes) && triajes.length > 0

			return {
				existe: tieneTriaje,
				triajes,
				ultimoTriaje: tieneTriaje ? triajes[0] : null
			}
		} catch (error: any) {
			// Si es 404, significa que no tiene triajes
			if (error.response?.status === 404) {
				return { existe: false, triajes: [], ultimoTriaje: null }
			}
			throw error
		}
	},

	// Función para verificar estado completo del paciente (consolidada desde auth)
	verificarEstadoCompleto: async (usuarioId: number): Promise<{
		tienePaciente: boolean
		tieneTriaje: boolean
		pacienteData?: any
		triajeData?: any
		pacienteId?: number
	}> => {
		try {
			console.log("🔍 PACIENTES-SERVICE: Verificando estado completo para usuario:", usuarioId)

			// Verificar paciente
			const { existe: tienePaciente, id: pacienteId, datos: pacienteData } = await pacientesService.verificarPaciente(usuarioId)

			if (!tienePaciente) {
				console.log("❌ PACIENTES-SERVICE: Usuario sin paciente")
				return {
					tienePaciente: false,
					tieneTriaje: false,
					pacienteData
				}
			}

			// Si tiene perfil, verificar triaje
			if (!pacienteId) {
				console.warn("⚠️ PACIENTES-SERVICE: Paciente sin ID")
				return {
					tienePaciente: true,
					tieneTriaje: false,
					pacienteData
				}
			}

			const { existe: tieneTriaje, ultimoTriaje: triajeData } = await pacientesService.verificarTriaje(pacienteId)

			console.log("✅ PACIENTES-SERVICE: Estado completo verificado:", {
				tienePaciente,
				tieneTriaje,
				pacienteId
			})

			return {
				tienePaciente,
				tieneTriaje,
				pacienteData,
				triajeData,
				pacienteId
			}
		} catch (error: any) {
			console.error("❌ PACIENTES-SERVICE: Error al verificar estado completo:", error)

			// En caso de error, asumir que necesita completar todo
			return {
				tienePaciente: false,
				tieneTriaje: false
			}
		}
	},

	// Función para inscribir paciente a campaña
	inscribirPacienteCampana: async (datos: CrearInscripcionCampana): Promise<InscripcionCampana> => {
		try {
			console.log("📝 Inscribiendo usuario a campaña:", datos)

			const response = await apiSpringClient.post(
				ENDPOINTS.CAMPANAS.INSCRIPCIONES.CREAR, {
				usuarioId: datos.usuarioId,
				campanaId: datos.campanaId,
			})

			console.log("✅ Usuario inscrito a campaña:", response.data)
			return response.data
		} catch (error: any) {
			console.error("❌ Error al inscribir usuario a campaña:", error)
			throw error
		}
	},

	// Obtener datos de contacto del paciente para notificaciones
	obtenerDatosContactoPaciente: async (pacienteId: number): Promise<{
		nombres: string;
		apellidos: string;
		telefono: string;
		correo: string;
	}> => {
		try {
			console.log("📞 Obteniendo datos de contacto para paciente:", pacienteId)

			// Obtener información del paciente
			const pacienteResponse = await apiSpringClient.get(ENDPOINTS.PACIENTES.POR_ID(pacienteId))
			const paciente = pacienteResponse.data

			// Obtener información del usuario asociado
			const usuarioResponse = await apiSpringClient.get(ENDPOINTS.USUARIOS.PERFIL(paciente.usuarioId))
			const usuario = usuarioResponse.data

			console.log("✅ Datos de contacto obtenidos:", {
				nombres: usuario.nombres,
				apellidos: usuario.apellidos,
				telefono: usuario.celular,
				correo: usuario.correo
			})

			return {
				nombres: usuario.nombres || '',
				apellidos: usuario.apellidos || '',
				telefono: usuario.celular || '',
				correo: usuario.correo || ''
			}
		} catch (error: any) {
			console.error("❌ Error al obtener datos de contacto del paciente:", error)
			throw error
		}
	}
}