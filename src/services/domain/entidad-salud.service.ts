import { AxiosError } from "axios";

import { EntidadSalud } from "@/src/types";

import apiSpringClient from "../api";
import { ENDPOINTS } from "../auth/endpoints";

// Servicio para gestionar entidades de salud
export const entidadSaludService = {

  /**
   * Crea una nueva entidad de salud
   */
  crearEntidadSalud: async (entidadData: EntidadSalud): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.post(ENDPOINTS.ENTIDADES_SALUD.BASE, entidadData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        );
      }
      throw new Error("Error al crear la entidad de salud");
    }
  },

  obtenerEntidadPorId: async (id: number): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.get(ENDPOINTS.ENTIDADES_SALUD.POR_ID(id));
      return response.data;
    } catch (error) {
      console.error("Error al obtener entidad por ID:", error);
      throw error;
    }
  },

  obtenerEntidadPorUsuarioId: async (usuarioId: number): Promise<EntidadSalud> => {
    try {
      const response = await apiSpringClient.get(`${ENDPOINTS.ENTIDADES_SALUD.BASE}/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener entidad por usuario ID:", error);
      throw error;
    }
  },

};

export default entidadSaludService;
