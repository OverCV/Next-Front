import { AxiosResponse } from "axios"
import Cookies from "js-cookie"

import { API_ENDPOINTS } from "../../config/api-endpoints"
import { DatosAcceso, RespuestaAuth, Usuario, UsuarioAccedido } from "../../types"
import apiClient from "../api"

/**
 * Token y claves de almacenamiento
 */
const TOKEN_KEY = 'authToken'
const USER_KEY = 'usuario'

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
			const response: AxiosResponse<RespuestaAuth> = await apiClient.post(
				API_ENDPOINTS.AUTH.REGISTRO,
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

			const response = await apiClient.post(API_ENDPOINTS.AUTH.ACCESO, credenciales)

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
				await apiClient.post(API_ENDPOINTS.AUTH.SALIR)
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
	 * Guarda el token en las cookies y localStorage
	 */
	guardarToken: (token: string): void => {
		// Guardar en cookies (más seguro, se incluye automáticamente en requests)
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
			token = localStorage.getItem(TOKEN_KEY)

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