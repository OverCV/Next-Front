import { API_URL } from '@/src/config/env'

/**
 * Configuración centralizada de todos los endpoints de la aplicación
 */
export const ENDPOINTS = {
	// Autenticación
	AUTH: {
		REGISTRO: `${API_URL}/auth/registro`,
		ACCESO: `${API_URL}/auth/acceso`,
		SALIR: `${API_URL}/auth/salir`,
	},

	// Usuarios
	USUARIOS: {
		BASE: `${API_URL}/usuarios`,
		PERFIL: (id: number) => `${API_URL}/usuarios/${id}`
	},

	// Pacientes
	PACIENTES: {
		BASE: `${API_URL}/pacientes`,
		PERFIL: (usuarioId: number) => `${API_URL}/pacientes/usuario/${usuarioId}`,
		TRIAJE: (pacienteId: number) => `${API_URL}/pacientes/triaje?pacienteId=${pacienteId}`,
		CREAR_TRIAJE: `${API_URL}/triaje`
	},

	// Triajes
	TRIAJES: {
		BASE: `${API_URL}/triaje`,
		POR_PACIENTE: (pacienteId: number) => `${API_URL}/triaje/paciente/${pacienteId}`
	},

	// Campañas e Inscripciones
	CAMPANAS: {
		BASE: `${API_URL}/campanas`,
		TODAS: `${API_URL}/campana`,
		POR_ID: (campanaId: number) => `${API_URL}/campana/${campanaId}`,
		INSCRIPCIONES: {
			BASE: `${API_URL}/inscripciones-campana`,
			POR_USUARIO: (usuarioId: number) => `${API_URL}/inscripciones-campana/usuario/${usuarioId}`,
			CREAR: `${API_URL}/inscripciones-campana`
		}
	},

	// Localizaciones
	LOCALIZACIONES: {
		BASE: `${API_URL}/localizaciones`,
		DEPARTAMENTOS: `${API_URL}/localizaciones/departamentos`,
		MUNICIPIOS: (departamentoId: number) => `${API_URL}/localizaciones/municipios?departamentoId=${departamentoId}`
	},

	// Notificaciones
	NOTIFICACIONES: {
		EMAIL: `${API_URL}/notificaciones/email`,
		SMS: `${API_URL}/notificaciones/sms`
	},

	// Citaciones Médicas
	CITACIONES: {
		BASE: `${API_URL}/citaciones-medicas`,
		POR_MEDICO: (medicoId: number) => `${API_URL}/citaciones-medicas/medico/${medicoId}`,
		POR_CAMPANA: (campanaId: number) => `${API_URL}/citaciones-medicas/campana/${campanaId}`,
		ACTUALIZAR_ESTADO: (citacionId: number) => `${API_URL}/citaciones-medicas/${citacionId}/estado`
	},

	// Datos Clínicos
	DATOS_CLINICOS: {
		BASE: `${API_URL}/datos-clinicos`,
		POR_PACIENTE: (pacienteId: number) => `${API_URL}/datos-clinicos/paciente/${pacienteId}`,
		CREAR: `${API_URL}/datos-clinicos`,
		ACTUALIZAR: (id: number) => `${API_URL}/datos-clinicos/${id}`
	}
} 