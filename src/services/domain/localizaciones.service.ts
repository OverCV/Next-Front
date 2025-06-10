import { httpGet } from "@/src/request/Requests";
import { Localizacion } from "@/src/types";

export const localizacionesService = {
  obtenerLocalizaciones: async (): Promise<Localizacion[]> => {
    try {
      const response = await httpGet("/localizaciones");
      return response || [];
    } catch (err) {
      console.error("Error al obtener localizaciones:", err);
      return [];
    }
  },
};
