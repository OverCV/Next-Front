import { AxiosError } from "axios";

import { API_URL } from "@/src/config/env";
import { CampanaModel } from "@/src/types";
import { CAMPANAS_MOCK } from "@/src/constants";
import { CAMPANA_RUTA } from "./RutasApi";

import { httpGet, httpPost } from "../request/Requests";
import apiClient from "./api";
import response from "twilio/lib/http/response";

// Interfaz para datos de creación de campaña
export interface CrearCampanaParams {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaLimite: string;
  fechaLimiteInscripcion: string;
  estado: string;
  minParticipantes: number;
  maxParticipantes: number;
  localizacionId?: number;
  serviciosIds?: number[];
  factoresIds?: number[];
  entidadId: number | undefined;
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
export const CampanaService = {
  /**
   * Obtiene todas las campañas de una entidad
   */
  obtenerCampanasPorEntidad: async (
    entidadId: number
  ): Promise<CampanaModel[] | undefined> => {
    let response = undefined;
    await httpGet(CAMPANA_RUTA + entidadId)
      .then((res) => {
        if (res !== undefined) {
          response = res;
        }
      })
      .then((err) => {
        console.log("error obteniendo una entidad", err);
      });
    return response;
  },

  /**
   * Obtiene una campaña específica por su ID
   */
  obtenerCampanaPorId: async (campanaId: number): Promise<CampanaModel> => {
    try {
      const response = await apiClient.get(`${API_URL}/campana/${campanaId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener campaña por ID:", error);
      // Para desarrollo, retornar el primero de los mock como ejemplo
      const campaña = CAMPANAS_MOCK.find((c) => c.id === campanaId);
      if (!campaña) {
        throw new Error("Campaña no encontrada");
      }
      // Cast estatus to the correct type and ensure fechaLimiteInscripcion is present
      return {
        ...campaña,
        estado: campaña.estado as CampanaModel["estado"],
        fechaLimiteInscripcion: campaña.fechaLimite,
      };
    }
  },

  /**
   * Crea una nueva campaña
   */
  crearCampana: async (
    campanaData: CrearCampanaParams
  ): Promise<CampanaModel | undefined> => {
    let response = undefined;
    await httpPost(CAMPANA_RUTA, campanaData)
      .then((res) => {
        if (res !== undefined) {
          response = res;
        }
      })
      .catch((err) => {
        console.log("error: ", err);
      });
    return response;
  },

  /**
   * Actualiza una campaña existente
   */
  actualizarCampana: async (
    campanaData: ActualizarCampanaParams
  ): Promise<CampanaModel> => {
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
  ): Promise<CampanaModel> => {
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
};
