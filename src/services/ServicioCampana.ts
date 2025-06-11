import { httpPost } from "../request/Requests";
import { ServicioMedicoModel } from "../types";
import { CAMPANA_SERVICIOS_RUTA } from "./RutasApi";

export const ServicioCampanaService = {
  /**
   * Asocia servicios médicos a una campaña
   */
  asociarServiciosMedicos: async (
    campanaId: number,
    serviciosIds: number[]
  ): Promise<ServicioMedicoModel | undefined> => {
    let response = undefined;
    await httpPost(
      `${CAMPANA_SERVICIOS_RUTA}/campana/${campanaId}/servicios`,
      serviciosIds
    )
      .then((res) => {
        if (res !== undefined) {
          response = res;
        }
      })
      .catch((err) => {
        console.log("error asociando servicios campana", err);
      });
    return response;
  },
};
