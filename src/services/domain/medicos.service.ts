import apiClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

export interface CitacionMedica {
	id: number
	pacienteId: number
	campanaId: number
	medicoId: number
	horaProgramada: string
	horaAtencion?: string
	duracionEstimada: number
	estado: 'PROGRAMADA' | 'ATENDIDA' | 'CANCELADA' | 'NO_ASISTIO'
	prediccionAsistencia: number
	codigoTicket: string
	notas?: string
}

export interface DatoClinico {
	id?: number
	pacienteId: number
	presionSistolica: number
	presionDiastolica: number
	frecuenciaCardiacaMin: number
	frecuenciaCardiacaMax: number
	saturacionOxigeno: number
	temperatura: number
	colesterolTotal: number
	hdl: number
	observaciones?: string
	fechaMedicion: string
}

export interface TriajePaciente {
	id: number
	pacienteId: number
	edad: number
	actividadFisica: boolean
	peso: number
	estatura: number
	tabaquismo: boolean
	alcoholismo: boolean
	diabetes: boolean
	dolorPecho: boolean
	dolorIrradiado: boolean
	sudoracion: boolean
	nauseas: boolean
	antecedentesCardiacos: boolean
	hipertension: boolean
	fechaTriaje: string
	descripcion?: string
}

export interface PacienteInfo {
	id: number
	fechaNacimiento: string
	genero: string
	direccion: string
	tipoSangre: string
	localizacionId: number
	usuarioId: number
}

export interface UsuarioInfo {
	id: number
	nombres: string
	apellidos: string
	correo: string
	celular: string
	tipoIdentificacion: string
	identificacion: string
}

export interface PacienteCompleto {
	paciente: PacienteInfo
	usuario: UsuarioInfo
	triajes: TriajePaciente[]
	datosClinicosRecientes: DatoClinico[]
}

export const medicosService = {
	// Obtener todas las citaciones médicas
	obtenerCitacionesMedicas: async (): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo citaciones médicas...')
		try {
			const response = await apiClient.get(ENDPOINTS.CITACIONES.BASE)
			console.log('✅ Citaciones obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones:', error)
			throw error
		}
	},

	// Obtener citaciones por médico
	obtenerCitacionesPorMedico: async (medicoId: number): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo citaciones para médico:', medicoId)
		try {
			const response = await apiClient.get(ENDPOINTS.CITACIONES.POR_MEDICO(medicoId))
			console.log('✅ Citaciones del médico obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones del médico:', error)
			throw error
		}
	},

	// Obtener citaciones por campaña
	obtenerCitacionesPorCampana: async (campanaId: number): Promise<CitacionMedica[]> => {
		console.log('🔍 Obteniendo citaciones para campaña:', campanaId)
		try {
			const response = await apiClient.get(ENDPOINTS.CITACIONES.POR_CAMPANA(campanaId))
			console.log('✅ Citaciones de la campaña obtenidas:', response.data.length)
			return response.data
		} catch (error) {
			console.error('❌ Error al obtener citaciones de la campaña:', error)
			throw error
		}
	},

	// Actualizar estado de citación
	actualizarEstadoCitacion: async (citacionId: number, estado: string): Promise<CitacionMedica> => {
		console.log('🔄 Actualizando estado de citación:', citacionId, estado)
		try {
			const response = await apiClient.patch(ENDPOINTS.CITACIONES.ACTUALIZAR_ESTADO(citacionId), { estado })
			console.log('✅ Estado de citación actualizado')
			return response.data
		} catch (error) {
			console.error('❌ Error al actualizar estado de citación:', error)
			throw error
		}
	},

	// Marcar citación como atendida
	atenderCitacion: async (citacionId: number): Promise<CitacionMedica> => {
		console.log('👨‍⚕️ Marcando citación como atendida:', citacionId)
		try {
			const horaAtencion = new Date().toISOString()
			const response = await apiClient.patch(ENDPOINTS.CITACIONES.ACTUALIZAR_ESTADO(citacionId), {
				estado: 'ATENDIDA',
				horaAtencion
			})
			console.log('✅ Citación marcada como atendida')
			return response.data
		} catch (error) {
			console.error('❌ Error al marcar citación como atendida:', error)
			throw error
		}
	},

	// Obtener todos los datos clínicos
	obtenerDatosClinicos: async (): Promise<DatoClinico[]> => {
		console.log('🔍 Obteniendo datos clínicos...')
		try {
			const response = await apiClient.get(ENDPOINTS.DATOS_CLINICOS.BASE)
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
			const response = await apiClient.get(ENDPOINTS.DATOS_CLINICOS.POR_PACIENTE(pacienteId))
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
			const response = await apiClient.post(ENDPOINTS.DATOS_CLINICOS.CREAR, datos)
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
			const response = await apiClient.put(ENDPOINTS.DATOS_CLINICOS.ACTUALIZAR(id), datos)
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
			const response = await apiClient.get(ENDPOINTS.TRIAJES.POR_PACIENTE(pacienteId))
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
			const response = await apiClient.get(ENDPOINTS.PACIENTES.POR_ID(pacienteId))
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
			const response = await apiClient.get(ENDPOINTS.USUARIOS.PERFIL(usuarioId))
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