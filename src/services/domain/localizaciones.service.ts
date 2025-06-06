import { httpGet } from "@/src/request/Requests";

export const localizacionesService = {
  obtenerLocalizaciones: async () => {
    let res;
    await httpGet("/localizaciones")
      .then((response) => {
        res = response;
      })
      .catch((err) => {
        console.log(err);
      });
    return res;
  },
};
