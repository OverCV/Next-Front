import { httpGet } from "../request/Requests";
import { ServicioMedicoModel } from "../types";
import { SERVICIO_MEDICO_RUTA } from "./RutasApi";

export const ServicioMedico = {
  /**
   * Obtiene los servicios médicos disponibles
   */
  obtenerServiciosMedicos: async (): Promise<
    ServicioMedicoModel[] | undefined
  > => {
    let response = undefined;
    await httpGet(SERVICIO_MEDICO_RUTA)
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
