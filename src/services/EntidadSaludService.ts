import { AxiosError } from "axios";

import { API_URL } from "@/src/config/env";
import { EntidadSalud } from "@/src/types";

import apiClient from "./api";
import { httpGet } from "../request/Requests";



// Servicio para gestionar campañas
export const entidadSaludService = {
  
  /**
   * Crea una nueva entidad de salud
   */
  crearEntidadSalud: async (entidadData: EntidadSalud): Promise<EntidadSalud> => {
    try {
      const response = await apiClient.post(`${API_URL}/entidades-salud`, entidadData);
      return response.data;
    } catch (error) {
      console.error("Error al crear entidad de salud:", error);
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
    const response = await httpGet(`${API_URL}/entidades-salud/${id}`);
    return response.data;
  },

  obtenerEntidadPorUsuarioId: async (usuarioId: number): Promise<EntidadSalud> => {
    console.log("Usuario ID:", usuarioId);
    console.log("API URL:", `${API_URL}/entidades-salud/usuario/${usuarioId}`);
    const response = await httpGet(`${API_URL}/entidades-salud/usuario/${usuarioId}`);
    console.log("Respuesta Entidad:", response);
    return response;
  },

};

export default entidadSaludService;
