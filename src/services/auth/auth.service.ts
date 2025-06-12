import { AxiosResponse } from "axios"
import Cookies from "js-cookie"

import { DatosAcceso, RespuestaAuth, Usuario, UsuarioAccedido } from "@/src/types"

import apiSpringClient from "../api"

import { ENDPOINTS } from "./endpoints"

/**
 * Token y claves de almacenamiento
 */
const TOKEN_KEY = 'authToken'
const USER_KEY = 'usuario'

// Tipos para recuperación de contraseña
interface SolicitudRecuperacion {
	email: string
}

interface CambiarContraseñaConToken {
	token: string
	nuevaContraseña: string
}

/**
 * Servicio centralizado de autenticación
 */
export const authService = {
	/**
	 * Registra un nuevo usuario
	 */
	registro: async (datosUsuario: Usuario): Promise<RespuestaAuth> => {
		try {
			console.log("🔐 AUTH-SERVICE: Registrando usuario...")
			const response: AxiosResponse<RespuestaAuth> = await apiSpringClient.post(
				ENDPOINTS.AUTH.REGISTRO,
				datosUsuario
			)

			console.log("✅ AUTH-SERVICE: Usuario registrado exitosamente")
			return response.data
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error en registro:", error)
			throw error
		}
	},

	/**
	 * Inicia sesión con credenciales
	 */
	acceso: async (credenciales: DatosAcceso): Promise<RespuestaAuth> => {
		try {
			console.log("🔐 AUTH-SERVICE: Iniciando sesión...")

			const response = await apiSpringClient.post(ENDPOINTS.AUTH.ACCESO, credenciales)

			// Guardar token
			authService.guardarToken(response.data.token)

			// Guardar usuario
			authService.guardarUsuario({
				...response.data.usuario,
				token: response.data.token
			})

			console.log("✅ AUTH-SERVICE: Sesión iniciada exitosamente")
			return response.data
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error en acceso:", error)
			throw error
		}
	},

	/**
	 * Cierra la sesión del usuario
	 */
	salir: async (): Promise<void> => {
		try {
			console.log("🔐 AUTH-SERVICE: Cerrando sesión...")

			// Intentar notificar al backend (opcional - no fallar si no funciona)
			try {
				await apiSpringClient.post(ENDPOINTS.AUTH.SALIR)
			} catch (error) {
				console.warn("⚠️ AUTH-SERVICE: Error al notificar logout al backend:", error)
			}

			// Limpiar datos locales
			authService.limpiarSesion()

			console.log("✅ AUTH-SERVICE: Sesión cerrada exitosamente")
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error al cerrar sesión:", error)
			throw error
		}
	},

	/**
	 * Solicita recuperación de contraseña por email
	 */
	solicitarRecuperacionContraseña: async (email: string): Promise<void> => {
		try {
			console.log("🔐 AUTH-SERVICE: Solicitando recuperación de contraseña...")

			const solicitud: SolicitudRecuperacion = { email }
			await apiSpringClient.post(ENDPOINTS.AUTH.SOLICITAR_RECUPERACION, solicitud)

			console.log("✅ AUTH-SERVICE: Solicitud de recuperación enviada")
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error al solicitar recuperación:", error)
			throw error
		}
	},

	/**
	 * Cambia la contraseña usando un token de recuperación
	 */
	cambiarContraseñaConToken: async (datos: CambiarContraseñaConToken): Promise<void> => {
		try {
			console.log("🔐 AUTH-SERVICE: Cambiando contraseña con token...")

			await apiSpringClient.post(ENDPOINTS.AUTH.CAMBIAR_CONTRASEÑA, datos)

			console.log("✅ AUTH-SERVICE: Contraseña cambiada exitosamente")
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error al cambiar contraseña:", error)
			throw error
		}
	},

	/**
	 * Guarda el token en las cookies y localStorage
	 */
	guardarToken: (token: string): void => {
		// Guardar en cookies (más seguro, incluye automáticamente)
		Cookies.set(TOKEN_KEY, token, {
			expires: 7, // 7 días
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		})

		// También en localStorage como respaldo
		if (typeof window !== "undefined") {
			localStorage.setItem(TOKEN_KEY, token)
		}

		console.log("💾 AUTH-SERVICE: Token guardado")
	},

	/**
	 * Obtiene el token desde cookies o localStorage
	 */
	obtenerToken: (): string | null => {
		// Intentar desde cookies primero
		let token = Cookies.get(TOKEN_KEY)

		// Si no está en cookies, intentar desde localStorage
		if (!token && typeof window !== "undefined") {
			token = localStorage.getItem(TOKEN_KEY) || undefined

			// Si lo encontramos en localStorage, guardarlo también en cookies
			if (token) {
				authService.guardarToken(token)
			}
		}

		return token || null
	},

	/**
	 * Guarda los datos del usuario en localStorage
	 */
	guardarUsuario: (usuario: UsuarioAccedido): void => {
		if (typeof window !== "undefined") {
			localStorage.setItem(USER_KEY, JSON.stringify(usuario))
			console.log("💾 AUTH-SERVICE: Usuario guardado")
		}
	},

	/**
	 * Obtiene el usuario actual desde localStorage
	 */
	obtenerUsuarioActual: (): UsuarioAccedido | null => {
		if (typeof window === "undefined") {
			return null
		}

		const usuarioStr = localStorage.getItem(USER_KEY)
		const token = authService.obtenerToken()

		if (!usuarioStr) return null

		try {
			const usuario = JSON.parse(usuarioStr) as UsuarioAccedido

			return {
				...usuario,
				token: token || usuario.token
			}
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error al parsear usuario:", error)
			localStorage.removeItem(USER_KEY)
			return null
		}
	},

	/**
	 * Verifica si hay un usuario autenticado
	 */
	estaAutenticado: (): boolean => {
		return !!authService.obtenerToken()
	},

	/**
	 * Verifica si el usuario tiene un rol específico
	 */
	tieneRol: (rolId: number): boolean => {
		const usuario = authService.obtenerUsuarioActual()
		return usuario?.rolId === rolId
	},

	/**
	 * Limpia toda la sesión (tokens y usuario)
	 */
	limpiarSesion: (): void => {
		Cookies.remove(TOKEN_KEY)
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(USER_KEY)
		console.log("🧹 AUTH-SERVICE: Sesión limpiada")
	}
} 