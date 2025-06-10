import { httpPost } from "../request/Requests";
import { FactoresRiesgoCampana } from "../types";
import { CAMPANA_FACTORES_RUTA } from "./RutasApi";

export const FactorCampanaService = {
  /**
   * Asocia factores de riesgo a una campaña
   */
  asociarFactoresRiesgo: async (
    campanaId: number,
    factoresIds: number[]
  ): Promise<FactoresRiesgoCampana | undefined> => {
    let response = undefined;
    httpPost(
      `${CAMPANA_FACTORES_RUTA}/campana/${campanaId}/factores`,
      factoresIds
    )
      .then((res) => {
        if (res !== undefined) {
          response = res;
        }
      })
      .catch((err) => {
        console.log("error asociando factores de riesgo campana", err);
      });

    return response;
  },
};
