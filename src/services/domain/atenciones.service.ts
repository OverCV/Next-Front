import apiSpringClient from "../api"
import { ENDPOINTS } from "../auth/endpoints"

export const atencionesService = {
	obtenerSugerenciasDiagnostico: async (pacienteId: number) => {
		try {
			const response = await apiSpringClient.get(`${ENDPOINTS.ATENCIONES_MEDICAS.BASE}/sugerencias/${pacienteId}`)
			return response.data
		} catch (error) {
			console.error("Error al obtener sugerencias de diagnóstico:", error)
			return []
		}
	},

	registrarDiagnostico: async (pacienteId: number, diagnostico: any) => {
		try {
			const response = await apiSpringClient.post(`${ENDPOINTS.ATENCIONES_MEDICAS.BASE}/diagnostico/${pacienteId}`, diagnostico)
			return response.data
		} catch (error) {
			console.error("Error al registrar diagnóstico:", error)
			throw error
		}
	},

	obtenerHistorialAtenciones: async (pacienteId: number) => {
		try {
			const response = await apiSpringClient.get(`${ENDPOINTS.ATENCIONES_MEDICAS.BASE}/historial/${pacienteId}`)
			return response.data
		} catch (error) {
			console.error("Error al obtener historial de atenciones:", error)
			return []
		}
	}
}