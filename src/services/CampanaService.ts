import { AxiosError } from "axios";

import { API_URL } from "@/src/config/env";
import { Campana, FactorRiesgo, ServicioMedico } from "@/src/types";
import { CAMPANAS_MOCK } from "@/src/constants";

import apiClient from "./api";
import { httpGet } from "../request/Requests";

// Interfaz para datos de creación de campaña
export interface CrearCampanaParams {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaLimite: string;
  minParticipantes: number;
  maxParticipantes: number;
  localizacionId?: number;
  serviciosIds?: number[];
  factoresIds?: number[];
}

// Interfaz para datos de actualización de campaña
export interface ActualizarCampanaParams {
  id: number;
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaLimite?: string;
  minParticipantes?: number;
  maxParticipantes?: number;
  estatus?: string;
  localizacionId?: number;
  serviciosIds?: number[];
  factoresIds?: number[];
}

// Servicio para gestionar campañas
export const campanasService = {
  /**
   * Obtiene todas las campañas de una entidad
   */
  obtenerCampanasPorEntidad: async (entidadId: number) => {
    await httpGet(`/campanas/${entidadId}`)
      .then((response) => {
        if (response !== undefined) {
          return response;
        }
      })
      .then((err) => {
        console.log("error obteniendo una entidad");
      });
  },

  /**
   * Obtiene una campaña específica por su ID
   */
  obtenerCampanaPorId: async (campanaId: number): Promise<Campana> => {
    try {
      const response = await apiClient.get(`${API_URL}/campanas/${campanaId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener campaña por ID:", error);
      // Para desarrollo, retornar el primero de los mock como ejemplo
      const campaña = CAMPANAS_MOCK.find((c) => c.id === campanaId);
      if (!campaña) {
        throw new Error("Campaña no encontrada");
      }
      // Cast estatus to the correct type
      return { ...campaña, estatus: campaña.estatus as Campana["estatus"] };
    }
  },

  /**
   * Crea una nueva campaña
   */
  crearCampana: async (campanaData: CrearCampanaParams): Promise<Campana> => {
    try {
      const response = await apiClient.post(`${API_URL}/campanas`, campanaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear campaña:", error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        );
      }
      throw new Error("Error al crear la campaña");
    }
  },

  /**
   * Actualiza una campaña existente
   */
  actualizarCampana: async (
    campanaData: ActualizarCampanaParams
  ): Promise<Campana> => {
    try {
      const response = await apiClient.put(
        `${API_URL}/campanas/${campanaData.id}`,
        campanaData
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar campaña:", error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        );
      }
      throw new Error("Error al actualizar la campaña");
    }
  },

  /**
   * Cambia el estado de una campaña
   */
  cambiarEstadoCampana: async (
    campanaId: number,
    estatus: string
  ): Promise<Campana> => {
    try {
      const response = await apiClient.patch(
        `${API_URL}/campanas/${campanaId}/estatus`,
        { estatus }
      );
      return response.data;
    } catch (error) {
      console.error("Error al cambiar estado de campaña:", error);
      throw new Error("Error al cambiar el estado de la campaña");
    }
  },

  /**
   * Obtiene los servicios médicos disponibles
   */
  obtenerServiciosMedicos: async (): Promise<ServicioMedico[] | undefined> => {
    let response;
    await httpGet("/servicios-medicos")
      .then((res) => {
        if (res !== undefined) {
          response = res;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return response;
  },

  /**
   * Obtiene los factores de riesgo disponibles
   */
  obtenerFactoresRiesgo: async (): Promise<FactorRiesgo[] | undefined> => {
    let response = undefined;
    await httpGet("/factor-riesgo")
      .then((res) => {
        if (res !== undefined) {
          response = res;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return response;
  },
};

export default campanasService;
