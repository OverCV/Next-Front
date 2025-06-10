/**
 * Endpoints de la API de Spring Boot
 * Basado en la documentación de endpoints-springboot.md
 */

import { API_URL } from './env'

export const API_ENDPOINTS = {
	// Servicios Médicos
	SERVICIOS_MEDICOS: `${API_URL}/servicios-medicos`,

	// Roles
	ROLES: `${API_URL}/roles`,

	// Interacciones con el chatbot
	INTERACCIONES_CHATBOT: `${API_URL}/interacciones_chatbot`,

	// Prescripciones
	PRESCRIPCIONES: `${API_URL}/prescripciones`,

	// Servicios Campaña
	SERVICIOS_CAMPANA: `${API_URL}/servicios-campana`,

	// Triaje
	TRIAJE: `${API_URL}/triaje`,

	// Citaciones Médicas
	CITACIONES_MEDICAS: `${API_URL}/citaciones-medicas`,

	// Embajadores
	EMBAJADORES: `${API_URL}/embajadores`,

	// Seguimientos
	SEGUIMIENTOS: `${API_URL}/seguimientos`,

	// Localizaciones
	LOCALIZACIONES: `${API_URL}/localizaciones`,

	// Pacientes
	PACIENTES: `${API_URL}/pacientes`,

	// Entidades de Salud
	ENTIDADES_SALUD: `${API_URL}/entidades-salud`,

	// Inscripciones a Campañas
	INSCRIPCIONES_CAMPANA: `${API_URL}/inscripciones-campana`,

	// Usuarios
	USUARIOS: `${API_URL}/usuarios`,

	// Datos Clínicos
	DATOS_CLINICOS: `${API_URL}/datos-clinicos`,

	// Atenciones Médicas
	ATENCIONES_MEDICAS: `${API_URL}/atenciones_medicas`,

	// Recomendaciones
	RECOMENDACIONES: `${API_URL}/recomendaciones`,

	// Historias Clínicas
	HISTORIAS_CLINICAS: `${API_URL}/historias-clinicas`,

	// Personal Médico
	PERSONAL_MEDICO: `${API_URL}/personal-medico`,

	// Diagnósticos
	DIAGNOSTICOS: `${API_URL}/diagnosticos`,

	// Predicciones
	PREDICCIONES: `${API_URL}/predicciones`,

	// Factores de riesgo
	FACTOR_RIESGO: `${API_URL}/factor-riesgo`,

	// Factores paciente
	FACTOR_PACIENTE: `${API_URL}/factor-paciente`,

	// Campaña
	CAMPANA: `${API_URL}/campana`,

	// Campaña factores
	CAMPANA_FACTORES: `${API_URL}/campana-factores`,

	// Autenticación
	AUTH: {
		SALIR: `${API_URL}/auth/salir`,
		REGISTRO: `${API_URL}/auth/registro`,
		ACCESO: `${API_URL}/auth/acceso`
	},

	// Health Check
	HEALTH: {
		CHECK: `${API_URL.replace('/api', '')}/healthz`,
		TEST: `${API_URL}/test`
	}
}

// Alias para compatibilidad
export const ATENCIONES = API_ENDPOINTS.ATENCIONES_MEDICAS