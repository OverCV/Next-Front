/**
 * Endpoints de la API de Spring Boot
 * Basado en la documentación de endpoints-springboot.md
 */

import { API_SPRINGBOOT_URL } from './env'

export const API_ENDPOINTS = {
	// Servicios Médicos
	SERVICIOS_MEDICOS: `${API_SPRINGBOOT_URL}/servicios-medicos`,

	// Roles
	ROLES: `${API_SPRINGBOOT_URL}/roles`,

	// Interacciones con el chatbot
	INTERACCIONES_CHATBOT: `${API_SPRINGBOOT_URL}/interacciones_chatbot`,

	// Prescripciones
	PRESCRIPCIONES: `${API_SPRINGBOOT_URL}/prescripciones`,

	// Servicios Campaña
	SERVICIOS_CAMPANA: `${API_SPRINGBOOT_URL}/servicios-campana`,

	// Triaje
	TRIAJE: `${API_SPRINGBOOT_URL}/triaje`,

	// Citaciones Médicas
	CITACIONES_MEDICAS: `${API_SPRINGBOOT_URL}/citaciones-medicas`,

	// Embajadores
	EMBAJADORES: `${API_SPRINGBOOT_URL}/embajadores`,

	// Seguimientos
	SEGUIMIENTOS: `${API_SPRINGBOOT_URL}/seguimientos`,

	// Localizaciones
	LOCALIZACIONES: `${API_SPRINGBOOT_URL}/localizaciones`,

	// Pacientes
	PACIENTES: `${API_SPRINGBOOT_URL}/pacientes`,

	// Entidades de Salud
	ENTIDADES_SALUD: `${API_SPRINGBOOT_URL}/entidades-salud`,

	// Inscripciones a Campañas
	INSCRIPCIONES_CAMPANA: `${API_SPRINGBOOT_URL}/inscripciones-campana`,

	// Usuarios
	USUARIOS: `${API_SPRINGBOOT_URL}/usuarios`,

	// Datos Clínicos
	DATOS_CLINICOS: `${API_SPRINGBOOT_URL}/datos-clinicos`,

	// Atenciones Médicas
	ATENCIONES_MEDICAS: `${API_SPRINGBOOT_URL}/atenciones_medicas`,

	// Recomendaciones
	RECOMENDACIONES: `${API_SPRINGBOOT_URL}/recomendaciones`,

	// Historias Clínicas
	HISTORIAS_CLINICAS: `${API_SPRINGBOOT_URL}/historias-clinicas`,

	// Personal Médico
	PERSONAL_MEDICO: `${API_SPRINGBOOT_URL}/personal-medico`,

	// Diagnósticos
	DIAGNOSTICOS: `${API_SPRINGBOOT_URL}/diagnosticos`,

	// Predicciones
	PREDICCIONES: `${API_SPRINGBOOT_URL}/predicciones`,

	// Factores de riesgo
	FACTOR_RIESGO: `${API_SPRINGBOOT_URL}/factor-riesgo`,

	// Factores paciente
	FACTOR_PACIENTE: `${API_SPRINGBOOT_URL}/factor-paciente`,

	// Campaña
	CAMPANA: `${API_SPRINGBOOT_URL}/campana`,

	// Campaña factores
	CAMPANA_FACTORES: `${API_SPRINGBOOT_URL}/campana-factores`,

	// Autenticación
	AUTH: {
		SALIR: `${API_SPRINGBOOT_URL}/auth/salir`,
		REGISTRO: `${API_SPRINGBOOT_URL}/auth/registro`,
		ACCESO: `${API_SPRINGBOOT_URL}/auth/acceso`
	},

	// Health Check
	HEALTH: {
		CHECK: `${API_SPRINGBOOT_URL.replace('/api', '')}/healthz`,
		TEST: `${API_SPRINGBOOT_URL}/test`
	}
}

// Alias para compatibilidad
export const ATENCIONES = API_ENDPOINTS.ATENCIONES_MEDICAS