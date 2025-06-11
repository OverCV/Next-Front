import { AxiosError } from "axios";

import { httpGet, httpPost } from "../request/Requests";
import { Embajador } from "../types";

export const EmbajadorService = {
  obtenerEmbajadores: async (): Promise<Embajador[]> => {
    const response = await httpGet("/embajadores");
    return response.data;
  },

  crearEmbajador: async (embajador: Embajador): Promise<Embajador> => {
    try {
      const response = await httpPost("/embajadores", embajador);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
        );
      }
      throw new Error("Error al crear la campaña");
    }
  },

  obtenerEmbajadoresPorIds: async (ids: number[]): Promise<Embajador[]> => {
    const response = await httpGet(`/embajadores/ids?ids=${ids.join(",")}`);
    return response.data;
  },
};

export default EmbajadorService;
