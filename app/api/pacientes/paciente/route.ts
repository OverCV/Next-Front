import { NextResponse } from "next/server"

import apiClient from "@/src/services/api"

// Función para escribir logs en un archivo
function logError(message: string, error: any) {
	console.error(`[API] ${message}:`, error)
	// En un entorno de producción, podrías escribir en un archivo o enviar a un servicio de logging
}

export async function POST(request: Request) {
	try {
		const datos = await request.json()
		const { token, ...datosParaEnviar } = datos

		if (!token) {
			logError("Token no proporcionado", { datos })
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 401 }
			)
		}

		// Llamar al backend para crear el paciente
		const response = await apiClient.post(
			"/pacientes",
			datosParaEnviar,
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}
			}
		)

		// En caso de éxito, enviamos una respuesta simplificada con existe: true
		return NextResponse.json({
			...response.data,
			existe: true,
			mensaje: "Paciente creado correctamente"
		})
	} catch (error: any) {
		logError("Error al crear paciente", error)

		return NextResponse.json(
			{ error: "Error al crear el paciente" },
			{ status: error.response?.status || 500 }
		)
	}
}

export async function GET(request: Request) {
	try {
		// Obtener el ID del usuario de los parámetros de la URL
		const url = new URL(request.url)
		const usuarioId = url.searchParams.get("usuarioId")
		const token = url.searchParams.get("token") || ""

		if (!usuarioId) {
			logError("ID de usuario no proporcionado", { url: url.toString() })
			return NextResponse.json(
				{ error: "ID de usuario no proporcionado" },
				{ status: 400 }
			)
		}

		try {
			// Intentar obtener el paciente
			console.log(`[API] Consultando paciente para usuarioId: ${usuarioId}`)

			try {
				// Intentar obtener el paciente del backend real
				const response = await apiClient.get(`/pacientes/usuario/${usuarioId}`, {
					headers: {
						"Authorization": token ? `Bearer ${token}` : ""
					}
				})

				// Si llegamos aquí, el paciente existe
				console.log(`[API] Paciente encontrado para usuarioId: ${usuarioId}`, response.data)

				return NextResponse.json({
					...response.data,
					existe: true
				})
			} catch (backendError: any) {
				// Si el error es 404, significa que el paciente no existe
				if (backendError.response?.status === 404) {
					console.log(`[API] Paciente no encontrado para usuarioId: ${usuarioId} (404)`)

					return NextResponse.json({
						existe: false,
						mensaje: "El paciente no existe"
					}, { status: 200 })
				}

				// Si es un error 403, simulamos una respuesta falsa para evitar loops
				if (backendError.response?.status === 403) {
					console.log(`[API] Error de autorización al consultar paciente para usuarioId: ${usuarioId} (403)`)

					// Para destrabar el flujo, asumimos que el paciente no existe
					return NextResponse.json({
						existe: false,
						mensaje: "No se pudo verificar el paciente (error de autorización)",
						simulado: true
					}, { status: 200 })
				}

				// Cualquier otro error, lo propagamos
				throw backendError
			}
		} catch (error: any) {
			logError("Error al obtener paciente", error)

			return NextResponse.json(
				{
					error: "Error al obtener el paciente",
					detalles: error.message,
					status: error.response?.status
				},
				{ status: 200 } // Devolvemos 200 para evitar errores en el cliente
			)
		}
	} catch (error: any) {
		logError("Error general al procesar solicitud de paciente", error)

		return NextResponse.json(
			{
				error: "Error al procesar la solicitud del paciente",
				detalles: error.message
			},
			{ status: 200 } // Devolvemos 200 para evitar errores en el cliente
		)
	}
}