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
// interface SolicitudRecuperacion {
// 	email: string
// }

interface CambiarContrasenaConToken {
	email: string
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
	 * Genera token temporal y envía correo usando notificaciones.ts
	 */
	solicitarRecuperacionContrasena: async (email: string): Promise<void> => {
		try {
			console.log("🔐 AUTH-SERVICE: Generando token de recuperación...")

			// Generar token temporal (válido por 24h)
			const tokenRecuperacion = crypto.randomUUID()
			const expiracion = Date.now() + (24 * 60 * 60 * 1000) // 24 horas

			// Guardar token en localStorage temporal
			const datosRecuperacion = {
				token: tokenRecuperacion,
				email,
				expiracion
			}
			localStorage.setItem('recuperacion_temp', JSON.stringify(datosRecuperacion))

			// Crear enlace de recuperación
			const enlaceRecuperacion = `${window.location.origin}/cambiar-contrasena?token=${tokenRecuperacion}`

			// Contenido del correo
			const contenidoCorreo = `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #2563eb;">Recuperación de Contraseña</h2>
					<p>Hola,</p>
					<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
					<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="${enlaceRecuperacion}" 
						   style="background-color: #2563eb; color: white; padding: 12px 24px; 
						          text-decoration: none; border-radius: 6px; display: inline-block;">
							Restablecer Contraseña
						</a>
					</div>
					<p style="color: #666; font-size: 14px;">
						Este enlace será válido por 24 horas.<br>
						Si no solicitaste este cambio, puedes ignorar este correo.
					</p>
					<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
					<p style="color: #999; font-size: 12px;">
						Sistema de Campañas de Salud
					</p>
				</div>
			`

			// Enviar correo usando el servicio de notificaciones
			const { notificacionesService } = await import('@/src/services/notificaciones')
			await notificacionesService.enviarCorreo(
				email,
				"Recuperación de Contraseña - Sistema de Campañas",
				contenidoCorreo
			)

			console.log("✅ AUTH-SERVICE: Correo de recuperación enviado")
		} catch (error) {
			console.error("❌ AUTH-SERVICE: Error al enviar recuperación:", error)
			throw error
		}
	},

	/**
	 * Cambia la contraseña usando email (validación de token ya hecha en frontend)
	 */
	cambiarContraseñaConToken: async (datos: CambiarContrasenaConToken): Promise<void> => {
		try {
			console.log("🔐 AUTH-SERVICE: Cambiando contraseña...")

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