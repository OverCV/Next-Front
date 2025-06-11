import { httpGet } from "../request/Requests";
import { FactorRiesgoModel } from "../types";
import { FACTOR_RIESGO_RUTA } from "./RutasApi";

export const FactorRiesgoServicio = {
  /**
   * Obtiene los factores de riesgo disponibles
   */
  obtenerFactoresRiesgo: async (): Promise<FactorRiesgoModel[] | undefined> => {
    let response = undefined;
    await httpGet(FACTOR_RIESGO_RUTA)
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
