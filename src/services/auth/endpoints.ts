import { API_SPRINGBOOT_URL, API_FASTAPI_URL } from '@/src/config/env'

/**
 * Configuración centralizada de todos los endpoints de la aplicación
 */
export const ENDPOINTS = {
	// Autenticación
	AUTH: {
		REGISTRO: `${API_SPRINGBOOT_URL}/auth/registro`,
		ACCESO: `${API_SPRINGBOOT_URL}/auth/acceso`,
		SALIR: `${API_SPRINGBOOT_URL}/auth/salir`,
	},

	// Usuarios
	USUARIOS: {
		BASE: `${API_SPRINGBOOT_URL}/usuarios`,
		PERFIL: (id: number) => `${API_SPRINGBOOT_URL}/usuarios/${id}`
	},

	// Pacientes
	PACIENTES: {
		BASE: `${API_SPRINGBOOT_URL}/pacientes`,
		POR_ID: (pacienteId: number) => `${API_SPRINGBOOT_URL}/pacientes/${pacienteId}`,
		PERFIL: (usuarioId: number) => `${API_SPRINGBOOT_URL}/pacientes/usuario/${usuarioId}`,
		TRIAJE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/pacientes/triaje?pacienteId=${pacienteId}`,
		CREAR_TRIAJE: `${API_SPRINGBOOT_URL}/triaje`
	},

	// Triajes
	TRIAJES: {
		BASE: `${API_SPRINGBOOT_URL}/triaje`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/triaje/paciente/${pacienteId}`
	},

	// Campañas e Inscripciones
	CAMPANAS: {
		BASE: `${API_SPRINGBOOT_URL}/campanas`,
		TODAS: `${API_SPRINGBOOT_URL}/campana`,
		POR_ID: (campanaId: number) => `${API_SPRINGBOOT_URL}/campana/${campanaId}`,
		INSCRIPCIONES: {
			BASE: `${API_SPRINGBOOT_URL}/inscripciones-campana`,
			POR_USUARIO: (usuarioId: number) => `${API_SPRINGBOOT_URL}/inscripciones-campana/usuario/${usuarioId}`,
			CREAR: `${API_SPRINGBOOT_URL}/inscripciones-campana`
		}
	},

	// Localizaciones
	LOCALIZACIONES: {
		BASE: `${API_SPRINGBOOT_URL}/localizaciones`,
		DEPARTAMENTOS: `${API_SPRINGBOOT_URL}/localizaciones/departamentos`,
		MUNICIPIOS: (departamentoId: number) => `${API_SPRINGBOOT_URL}/localizaciones/municipios?departamentoId=${departamentoId}`
	},

	// Notificaciones
	NOTIFICACIONES: {
		EMAIL: `${API_SPRINGBOOT_URL}/notificaciones/email`,
		SMS: `${API_SPRINGBOOT_URL}/notificaciones/sms`
	},

	// Citaciones Médicas
	CITACIONES: {
		BASE: `${API_SPRINGBOOT_URL}/citaciones-medicas`,
		POR_MEDICO: (medicoId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/medico/${medicoId}`,
		POR_CAMPANA: (campanaId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/campana/${campanaId}`,
		ACTUALIZAR_ESTADO: (citacionId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/${citacionId}/estado`
	},

	// Datos Clínicos
	DATOS_CLINICOS: {
		BASE: `${API_SPRINGBOOT_URL}/datos-clinicos`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/datos-clinicos/paciente/${pacienteId}`,
		CREAR: `${API_SPRINGBOOT_URL}/datos-clinicos`,
		ACTUALIZAR: (id: number) => `${API_SPRINGBOOT_URL}/datos-clinicos/${id}`
	},

	// API de FastAPI - Predicciones de Riesgo Cardiovascular
	FASTAPI: {
		HEALTH: `${API_FASTAPI_URL}/`,
		PREDECIR_RIESGO: (pacienteId: number, campanaId: number) =>
			`${API_FASTAPI_URL}/api/riesgo-cardiovascular/predecir/${pacienteId}/${campanaId}`
	},

	// Predicciones (Backend Spring)
	PREDICCIONES: {
		BASE: `${API_SPRINGBOOT_URL}/predicciones`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/predicciones/paciente/${pacienteId}`,
		POR_CAMPANA: (campanaId: number) => `${API_SPRINGBOOT_URL}/predicciones/campana/${campanaId}`
	}
} 