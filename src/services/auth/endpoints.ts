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
		PERFIL: `${API_URL}/auth/perfil`
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
		CREAR_TRIAJE: `${API_URL}/pacientes/triaje`
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
	}
} 