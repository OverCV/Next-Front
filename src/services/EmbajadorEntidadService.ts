import { httpDelete, httpGet, httpPost } from "../request/Requests";
import { EmbajadorEntidad } from "../types";

export const EmbajadorEntidadService = {
  obtenerEmbajadoresPorEntidadId: async (entidadId: number) : Promise<EmbajadorEntidad[]> => {
    const response = await httpGet(`/embajadores-entidades/entidad/${entidadId}`);
    return response;
  },
  obtenerEmbajadorEntidadPorEmbajadorId: async (embajadorId: number) : Promise<EmbajadorEntidad> => {
    const response = await httpGet(`/embajadores-entidades/embajador/${embajadorId}`);
    return response;
  },
  crearEmbajadorEntidad: async (embajadorEntidad: EmbajadorEntidad) => {
    const response = await httpPost("/embajadores-entidades", embajadorEntidad);
    return response;
  },
  eliminarEmbajadorEntidad: async (id: number) => {
    const response = await httpDelete(`/embajadores-entidades/${id}`);
    return response;
  },
};

export default EmbajadorEntidadService;
