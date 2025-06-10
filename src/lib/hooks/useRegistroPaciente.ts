import { useState, useCallback } from "react"

import { ROLES, TiposIdentificacionEnum, TipoSangreEnum } from "@/src/constants"
import apiClient from "@/src/services/api"
import { ENDPOINTS } from "@/src/services/auth/endpoints"
import { pacientesService } from "@/src/services/domain/pacientes.service"
import { usuariosService } from "@/src/services/usuarios"
import { Usuario, GeneroBiologico, Campana, CampanaAPI } from "@/src/types"

export interface DatosRegistroCompleto {
	// Datos del Usuario
	tipoIdentificacion: TiposIdentificacionEnum
	identificacion: string
	nombres: string
	apellidos: string
	celular: string
	correo?: string

	// Datos del Paciente
	fechaNacimiento: Date
	genero: GeneroBiologico
	direccion: string
	tipoSangre: TipoSangreEnum
	localizacion_id: number

	// Datos de Campaña (opcional)
	campanaId?: number
}

export const useRegistroPaciente = () => {
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [exitoso, setExitoso] = useState(false)
	const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([])
	const [cargandoCampanas, setCargandoCampanas] = useState(false)

	// Función para convertir CampanaAPI a Campana (adaptador)
	const convertirCampanaAPI = (campanaAPI: CampanaAPI): Campana => {
		return {
			id: campanaAPI.id,
			nombre: campanaAPI.nombre,
			descripcion: campanaAPI.descripcion,
			fechaInicio: campanaAPI.fechaInicio,
			fechaLimite: campanaAPI.fechaLimite || campanaAPI.fechaLimiteInscripcion,
			minParticipantes: campanaAPI.minParticipantes,
			maxParticipantes: campanaAPI.maxParticipantes,
			entidadId: campanaAPI.entidadId,
			estatus: campanaAPI.estado.toLowerCase() as "postulada" | "ejecucion" | "finalizada" | "cancelada",
			estado: campanaAPI.estado,
			fechaCreacion: campanaAPI.fechaInicio, // Usar fechaInicio como fallback
			localizacion: undefined, // No viene en la API, se puede cargar después si es necesario
			pacientes: 0 // No viene en la API
		}
	}

	// Función para cargar campañas disponibles desde la API real
	const cargarCampanasDisponibles = useCallback(async () => {
		setCargandoCampanas(true)
		try {
			console.log("🔍 Cargando campañas disponibles desde API...")

			const response = await apiClient.get(ENDPOINTS.CAMPANAS.TODAS)
			const campanasAPI: CampanaAPI[] = response.data

			// Filtrar solo campañas activas (POSTULADA o EJECUCION)
			const campanasActivas = campanasAPI
				.filter(c => c.estado === 'POSTULADA' || c.estado === 'EJECUCION')
				.map(convertirCampanaAPI)

			setCampanasDisponibles(campanasActivas)
			console.log("✅ Campañas disponibles cargadas desde API:", campanasActivas.length)

		} catch (err) {
			console.error("❌ Error al cargar campañas desde API:", err)
			console.log("🔄 Fallback: usando campañas mock...")

			// Fallback a mock en caso de error
			try {
				// const { CAMPANAS_MOCK } = await import("@/src/constants")
				// setCampanasDisponibles(CAMPANAS_MOCK.filter(c => c.estatus === 'postulada' || c.estatus === 'ejecucion') as Campana[])
			} catch (mockErr) {
				console.error("❌ Error incluso con mock:", mockErr)
				setCampanasDisponibles([])
			}
		} finally {
			setCargandoCampanas(false)
		}
	}, []) // Sin dependencias porque es independiente

	const registrarPacienteCompleto = async (datos: DatosRegistroCompleto, token: string) => {
		setCargando(true)
		setError(null)
		setExitoso(false)

		try {
			console.log("🚀 HOOK: Iniciando registro completo de paciente")

			// PASO 1: Crear Usuario
			const datosUsuario: Usuario = {
				tipoIdentificacion: datos.tipoIdentificacion,
				identificacion: datos.identificacion,
				nombres: datos.nombres,
				apellidos: datos.apellidos,
				correo: datos.correo || `${datos.identificacion}@healink.com`,
				clave: datos.identificacion,
				celular: datos.celular,
				estaActivo: true,
				rolId: ROLES.PACIENTE,
				entidadSaludId: null,
				entidadSalud: null,
			}

			console.log("🔸 PASO 1: Creando usuario...")
			const usuarioCreado = await usuariosService.crearUsuario(token, datosUsuario)
			console.log("✅ Usuario creado ID:", usuarioCreado.id)

			// PASO 2: Crear Paciente
			const datosPaciente = {
				fechaNacimiento: datos.fechaNacimiento,
				genero: datos.genero,
				direccion: datos.direccion,
				tipoSangre: datos.tipoSangre,
				localizacionId: datos.localizacion_id,
				usuarioId: usuarioCreado.id
			}

			console.log("🔸 PASO 2: Creando paciente...")
			const pacienteCreado = await pacientesService.crearPaciente(datosPaciente)
			console.log("✅ Paciente creado ID:", pacienteCreado.id)

			// PASO 3: Inscribir a campaña (si se especifica)
			let inscripcionCreada = null
			if (datos.campanaId) {
				console.log("🔸 PASO 3: Inscribiendo a campaña...")
				inscripcionCreada = await pacientesService.inscribirPacienteCampana({
					usuarioId: usuarioCreado.id,
					campanaId: datos.campanaId,
				})
				console.log("✅ Paciente inscrito a campaña")
			}

			setExitoso(true)
			return {
				usuario: usuarioCreado,
				paciente: pacienteCreado,
				inscripcion: inscripcionCreada,
				exito: true
			}

		} catch (err: any) {
			console.error("❌ Error en registro completo:", err)

			let mensajeError = "Error al registrar el paciente. Verifica los datos."

			if (err.response?.status === 403) {
				mensajeError = "No tienes permisos para registrar pacientes."
			} else if (err.response?.status === 400) {
				mensajeError = err.response?.data?.mensaje || "Datos inválidos."
			} else if (err.response?.status === 409) {
				mensajeError = "Ya existe un usuario con esa identificación."
			}

			setError(mensajeError)
			throw err
		} finally {
			setCargando(false)
		}
	}

	const limpiarEstado = useCallback(() => {
		setError(null)
		setExitoso(false)
	}, [])

	return {
		registrarPacienteCompleto,
		cargarCampanasDisponibles,
		campanasDisponibles,
		cargandoCampanas,
		cargando,
		error,
		exitoso,
		limpiarEstado
	}
} 