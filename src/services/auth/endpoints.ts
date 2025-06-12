import { API_SPRINGBOOT_URL, API_FASTAPI_URL } from '@/src/config/env'

/**
 * Configuración centralizada de todos los endpoints de la aplicación
 */
export const ENDPOINTS = {
	// Autenticación
	AUTH: {
		BASE: `${API_SPRINGBOOT_URL}/auth`,
		REGISTRO: `${API_SPRINGBOOT_URL}/auth/registro`,
		ACCESO: `${API_SPRINGBOOT_URL}/auth/acceso`,
		SALIR: `${API_SPRINGBOOT_URL}/auth/salir`,
		SOLICITAR_RECUPERACION: `${API_SPRINGBOOT_URL}/auth/solicitar-recuperacion`,
		CAMBIAR_CONTRASEÑA: `${API_SPRINGBOOT_URL}/auth/cambiar-contraseña`
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
		BASE: `${API_SPRINGBOOT_URL}/campana`,
		TODAS: `${API_SPRINGBOOT_URL}/campana`,
		POR_ID: (campanaId: number) => `${API_SPRINGBOOT_URL}/campana/${campanaId}`,
		POR_ENTIDAD: (entidadId: number) => `${API_SPRINGBOOT_URL}/campana/entidad/${entidadId}`,
		// CAMBIAR_ESTADO: (campanaId: number) => `${API_SPRINGBOOT_URL}/campanas/${campanaId}/estatus`,
		INSCRIPCIONES: {
			BASE: `${API_SPRINGBOOT_URL}/inscripciones-campana`,
			POR_USUARIO: (usuarioId: number) => `${API_SPRINGBOOT_URL}/inscripciones-campana/usuario/${usuarioId}`,
			CREAR: `${API_SPRINGBOOT_URL}/inscripciones-campana`
		}
	},

	// Embajadores
	EMBAJADORES: {
		BASE: `${API_SPRINGBOOT_URL}/embajadores`,
		POR_IDS: (ids: number[]) => `${API_SPRINGBOOT_URL}/embajadores/ids?ids=${ids.join(",")}`,
		ENTIDADES: {
			BASE: `${API_SPRINGBOOT_URL}/embajadores-entidades`,
			POR_EMBAJADOR: (embajadorId: number) => `${API_SPRINGBOOT_URL}/embajadores-entidades/embajador/${embajadorId}`,
			POR_ENTIDAD: (entidadId: number) => `${API_SPRINGBOOT_URL}/embajadores-entidades/entidad/${entidadId}`
		}
	},

	// Servicios Médicos
	SERVICIOS_MEDICOS: {
		BASE: `${API_SPRINGBOOT_URL}/servicios-medicos`,
		CAMPANA: `${API_SPRINGBOOT_URL}/servicios-campana`
	},

	// Factores de Riesgo
	FACTORES_RIESGO: {
		BASE: `${API_SPRINGBOOT_URL}/factor-riesgo`,
		PACIENTE: `${API_SPRINGBOOT_URL}/factor-paciente`,
		CAMPANA: `${API_SPRINGBOOT_URL}/campana-factores`
	},

	// Entidades de Salud
	ENTIDADES_SALUD: {
		BASE: `${API_SPRINGBOOT_URL}/entidades-salud`,
		POR_ID: (entidadId: number) => `${API_SPRINGBOOT_URL}/entidades-salud/${entidadId}`,
		POR_USUARIO: (usuarioId: number) => `${API_SPRINGBOOT_URL}/entidades-salud/entidad/${usuarioId}`,
	},

	// Personal Médico
	PERSONAL_MEDICO: {
		BASE: `${API_SPRINGBOOT_URL}/personal-medico`,
		POR_ID: (medicoId: number) => `${API_SPRINGBOOT_URL}/personal-medico/${medicoId}`,
		POR_USUARIO: (usuarioId: number) => `${API_SPRINGBOOT_URL}/personal-medico/usuario/${usuarioId}`,
		PAGINADO: `${API_SPRINGBOOT_URL}/personal-medico/paged`,
		POR_ESPECIALIDAD: (especialidad: string) => `${API_SPRINGBOOT_URL}/personal-medico/especialidad/${especialidad}`,
		POR_ENTIDAD: (entidadId: number) => `${API_SPRINGBOOT_URL}/personal-medico/entidad/${entidadId}`,
		POR_ENTIDAD_Y_ESPECIALIDAD: (entidadId: number, especialidad: string) => `${API_SPRINGBOOT_URL}/personal-medico/entidad/${entidadId}/especialidad/${especialidad}`
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
		POR_ID: (citacionId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/${citacionId}`,
		POR_MEDICO: (medicoId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/medico/${medicoId}`,
		POR_CAMPANA: (campanaId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/campana/${campanaId}`,
		ACTUALIZAR_ESTADO: (citacionId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/${citacionId}/estado`,
		ACTUALIZAR: (citacionId: number) => `${API_SPRINGBOOT_URL}/citaciones-medicas/${citacionId}`
	},

	// Diagnósticos
	DIAGNOSTICOS: {
		BASE: `${API_SPRINGBOOT_URL}/diagnosticos`,
		POR_ID: (diagnosticoId: number) => `${API_SPRINGBOOT_URL}/diagnosticos/${diagnosticoId}`
	},

	// Historias Clínicas
	HISTORIAS_CLINICAS: {
		BASE: `${API_SPRINGBOOT_URL}/historias-clinicas`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/historias-clinicas/paciente/${pacienteId}`
	},

	// Recomendaciones
	RECOMENDACIONES: {
		BASE: `${API_SPRINGBOOT_URL}/recomendaciones`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/recomendaciones/paciente/${pacienteId}`
	},

	// Prescripciones
	PRESCRIPCIONES: {
		BASE: `${API_SPRINGBOOT_URL}/prescripciones`,
		POR_ID: (prescripcionId: number) => `${API_SPRINGBOOT_URL}/prescripciones/${prescripcionId}`
	},

	// Seguimientos
	SEGUIMIENTOS: {
		BASE: `${API_SPRINGBOOT_URL}/seguimientos`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/seguimientos/paciente/${pacienteId}`
	},

	// Interacciones Chatbot
	INTERACCIONES_CHATBOT: {
		BASE: `${API_SPRINGBOOT_URL}/interacciones_chatbot`,
		POR_USUARIO: (usuarioId: number) => `${API_SPRINGBOOT_URL}/interacciones_chatbot/usuario/${usuarioId}`
	},

	// Roles
	ROLES: {
		BASE: `${API_SPRINGBOOT_URL}/roles`,
		POR_ID: (rolId: number) => `${API_SPRINGBOOT_URL}/roles/${rolId}`
	},

	// API de FastAPI - Predicciones de Riesgo Cardiovascular
	FASTAPI: {
		HEALTH: `${API_FASTAPI_URL}/`,
		PREDECIR_RIESGO: (pacienteId: number, campanaId: number) =>
			`${API_FASTAPI_URL}/api/riesgo-cardiovascular/predecir/${pacienteId}/${campanaId}`,
		PRIORIZACION: {
			ACTUALIZAR_POR_TRIAJE: `${API_FASTAPI_URL}/api/priorizacion/actualizar-por-triaje`,
			CAMPANA_PACIENTES: (campanaId: number) => `${API_FASTAPI_URL}/api/priorizacion/campana/${campanaId}/pacientes`,
			CITACIONES_PACIENTE: (pacienteId: number) => `${API_FASTAPI_URL}/api/priorizacion/paciente/${pacienteId}/citaciones`
		}
	},

	// Predicciones (Backend Spring)
	PREDICCIONES: {
		BASE: `${API_SPRINGBOOT_URL}/predicciones`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/predicciones/paciente/${pacienteId}`,
		POR_CAMPANA: (campanaId: number) => `${API_SPRINGBOOT_URL}/predicciones/campana/${campanaId}`
	},

	// Health Check
	HEALTH: {
		CHECK: `${API_SPRINGBOOT_URL.replace('/api', '')}/healthz`,
		TEST: `${API_SPRINGBOOT_URL}/test`
	},

	// Atenciones Médicas
	ATENCIONES_MEDICAS: {
		BASE: `${API_SPRINGBOOT_URL}/atenciones-medicas`,
		POR_ID: (atencionId: number) => `${API_SPRINGBOOT_URL}/atenciones-medicas/${atencionId}`,
		POR_CITACION: (citacionId: number) => `${API_SPRINGBOOT_URL}/atenciones-medicas/citacion/${citacionId}`,
		ACTUALIZAR: (atencionId: number) => `${API_SPRINGBOOT_URL}/atenciones-medicas/${atencionId}`
	},

	// Datos Clínicos
	DATOS_CLINICOS: {
		BASE: `${API_SPRINGBOOT_URL}/datos-clinicos`,
		POR_PACIENTE: (pacienteId: number) => `${API_SPRINGBOOT_URL}/datos-clinicos/paciente/${pacienteId}`,
		CREAR: `${API_SPRINGBOOT_URL}/datos-clinicos`,
		ACTUALIZAR: (id: number) => `${API_SPRINGBOOT_URL}/datos-clinicos/${id}`
	}
} 