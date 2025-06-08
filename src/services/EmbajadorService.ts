import { AxiosError } from "axios";

import { httpGet, httpPost } from "../request/Requests";
import { Embajador } from "../types";

export const EmbajadorService = {
  obtenerEmbajadores: async (): Promise<Embajador[]> => {
    const response = await httpGet("/embajadores");
    return response.data;
  },
  obtenerEmbajadoresPorEntidad: async (entidadId: number): Promise<Embajador[]> => {
    console.log("Entidad ID:", entidadId);
    console.log("API URL:", `/embajadores/entidad/${entidadId}`);
    const response = await httpGet(`/embajadores/entidad/${entidadId}`);
    console.log("Respuesta Embajadores:", response);
    return response;
  },
  crearEmbajador: async (embajador: Embajador): Promise<Embajador> => {
    try {
      const response = await httpPost("/embajadores", embajador);
      return response.data;
    } catch (error) {
      console.error("Error al crear embajador:", error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        );
      }
      throw new Error("Error al crear la campaña");
    }
  },
};

export default EmbajadorService;