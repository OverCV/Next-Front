import { API_ENDPOINTS } from "@/src/config/env"
import apiClient from "./api"

export const atencionesService = {
	obtenerSugerenciasDiagnostico: async (pacienteId: number) => {
		try {
			const response = await apiClient.get(`${API_ENDPOINTS.ATENCIONES}/sugerencias/${pacienteId}`)
			return response.data
		} catch (error) {
			console.error("Error al obtener sugerencias de diagnóstico:", error)
			return []
		}
	},

	registrarDiagnostico: async (pacienteId: number, diagnostico: any) => {
		try {
			const response = await apiClient.post(`${API_ENDPOINTS.ATENCIONES}/diagnostico/${pacienteId}`, diagnostico)
			return response.data
		} catch (error) {
			console.error("Error al registrar diagnóstico:", error)
			throw error
		}
	},

	obtenerHistorialAtenciones: async (pacienteId: number) => {
		try {
			const response = await apiClient.get(`${API_ENDPOINTS.ATENCIONES}/historial/${pacienteId}`)
			return response.data
		} catch (error) {
			console.error("Error al obtener historial de atenciones:", error)
			return []
		}
	}
} 