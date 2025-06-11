import { FactorRiesgo } from "@/src/types";

import apiSpringClient from "../api";
import { ENDPOINTS } from "../auth/endpoints";

export const FactorRiesgoServicio = {
  /**
   * Obtiene los factores de riesgo disponibles
   */
  obtenerFactoresRiesgo: async (): Promise<FactorRiesgo[]> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.FACTORES_RIESGO.BASE);
      return response.data;
    } catch (error) {
      console.error("Error al obtener factores de riesgo:", error);
      return [];
    }
  },
};

export default FactorRiesgoServicio;
