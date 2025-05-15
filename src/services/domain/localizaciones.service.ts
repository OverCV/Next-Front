import { API_ENDPOINTS } from "@/src/config/env"
import { Localizacion } from "@/src/types"

import apiClient from "../api"

export const localizacionesService = {
	obtenerLocalizaciones: async (token: string): Promise<Localizacion[]> => {
		console.log("🔍 Iniciando obtención de localizaciones")
		console.log("🌐 URL API:", API_ENDPOINTS.LOCALIZACIONES)
		console.log("🔑 Token recibido:", token?.substring(0, 15) + "...")
		console.log("⚙️ Cliente API configurado con:", {
			baseURL: apiClient.defaults.baseURL,
			headers: apiClient.defaults.headers
		})

		try {
			console.log("📡 Realizando petición GET a", API_ENDPOINTS.LOCALIZACIONES)
			const response = await apiClient.get(API_ENDPOINTS.LOCALIZACIONES, {
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			if (!response.data) {
				console.warn("⚠️ La respuesta no contiene datos")
				return []
			}

			if (!Array.isArray(response.data)) {
				console.warn("⚠️ La respuesta no es un array:", response.data)
				return []
			}

			console.log("✅ Respuesta recibida:", {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				dataLength: response.data.length
			})
			console.log("📊 Primeros 2 items:", response.data.slice(0, 2))

			return response.data
		} catch (error: any) {
			console.error("❌ Error al obtener localizaciones:", {
				mensaje: error.message,
				status: error.response?.status,
				data: error.response?.data,
				config: {
					url: error.config?.url,
					method: error.config?.method,
					headers: error.config?.headers,
					baseURL: apiClient.defaults.baseURL
				}
			})
			throw error
		}
	}
}