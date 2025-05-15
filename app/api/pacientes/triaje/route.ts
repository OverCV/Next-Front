import { NextResponse } from "next/server";

import apiClient from "@/src/services/api";

// Función para escribir logs en un archivo
function logError(message: string, error: any) {
	console.error(`[API] ${message}:`, error);
	// En un entorno de producción, podrías escribir en un archivo o enviar a un servicio de logging
}

export async function POST(request: Request) {
	try {
		const datos = await request.json();
		const { token, ...datosParaEnviar } = datos;

		if (!token) {
			logError("Token no proporcionado", { datos });
			return NextResponse.json(
				{ error: "Token no proporcionado" },
				{ status: 401 }
			);
		}

		// Llamar al backend para crear el triaje del paciente
		const response = await apiClient.post(
			"/pacientes/triaje",
			datosParaEnviar,
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}
			}
		);

		// En caso de éxito, enviamos una respuesta simplificada
		return NextResponse.json({
			...response.data,
			existe: true,
			mensaje: "Triaje creado correctamente"
		});
	} catch (error: any) {
		logError("Error al crear triaje del paciente", error);

		return NextResponse.json(
			{ error: "Error al crear el triaje del paciente" },
			{ status: error.response?.status || 500 }
		);
	}
}

export async function GET(request: Request) {
	try {
		// Obtener el ID del paciente de los parámetros de la URL
		const url = new URL(request.url)
		const pacienteId = url.searchParams.get("pacienteId")
		const token = url.searchParams.get("token") || ""

		if (!pacienteId) {
			logError("ID de paciente no proporcionado", { url: url.toString() });
			return NextResponse.json(
				{ error: "ID de paciente no proporcionado" },
				{ status: 400 }
			)
		}

		try {
			// Intentar obtener el triaje del paciente
			console.log(`[API] Consultando triaje para pacienteId: ${pacienteId}`);

			try {
				// Intentar obtener el triaje del backend real
				const response = await apiClient.get(`/triaje/paciente/${pacienteId}`, {
					headers: {
						"Authorization": token ? `Bearer ${token}` : ""
					}
				})

				// Si llegamos aquí, verificamos si hay triajes
				console.log(`[API] Triaje encontrado para pacienteId: ${pacienteId}`, response.data);

				// Si la respuesta es un array vacío, significa que no hay triajes
				if (Array.isArray(response.data) && response.data.length === 0) {
					return NextResponse.json({
						existe: false,
						mensaje: "El paciente no tiene triajes registrados",
						triajes: []
					}, { status: 200 })
				}

				return NextResponse.json({
					existe: true,
					triajes: response.data
				})
			} catch (backendError: any) {
				// Si el error es 404, significa que el triaje no existe
				if (backendError.response?.status === 404) {
					console.log(`[API] Triaje no encontrado para pacienteId: ${pacienteId} (404)`);

					return NextResponse.json({
						existe: false,
						mensaje: "El triaje del paciente no existe"
					}, { status: 200 })
				}

				// Si es un error 403, simulamos una respuesta falsa para evitar loops
				if (backendError.response?.status === 403) {
					console.log(`[API] Error de autorización al consultar triaje para pacienteId: ${pacienteId} (403)`);

					// Para destrabar el flujo, asumimos que el triaje no existe
					return NextResponse.json({
						existe: false,
						mensaje: "No se pudo verificar el triaje (error de autorización)",
						simulado: true
					}, { status: 200 });
				}

				// Cualquier otro error, lo propagamos
				throw backendError;
			}
		} catch (error: any) {
			logError("Error al obtener triaje del paciente", error);

			return NextResponse.json(
				{
					error: "Error al obtener el triaje del paciente",
					detalles: error.message,
					status: error.response?.status
				},
				{ status: 200 } // Devolvemos 200 para evitar errores en el cliente
			)
		}
	} catch (error: any) {
		logError("Error general al procesar solicitud de triaje", error);

		return NextResponse.json(
			{
				error: "Error al procesar la solicitud del triaje",
				detalles: error.message
			},
			{ status: 200 } // Devolvemos 200 para evitar errores en el cliente
		)
	}
}