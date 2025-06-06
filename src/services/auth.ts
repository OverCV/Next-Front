// src/services/auth.ts
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

import { DatosAcceso, DatosRegistro, RespuestaAuth, Usuario } from "../types";

import apiClient from "./api";

// Servicios de autenticación
export const authService = {
  /**
   * Registra un nuevo usuario
   */
  registro: async (datosUsuario: DatosRegistro): Promise<RespuestaAuth> => {
    try {
      const response: AxiosResponse<RespuestaAuth> = await apiClient.post(
        "/auth/registro",
        datosUsuario
      );
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  },

  /**
   * Inicia sesión con credenciales
   */
  acceso: async (credenciales: DatosAcceso): Promise<RespuestaAuth> => {
    try {
      console.log("Petición:", apiClient.defaults.baseURL);

      const response = await apiClient.post("/auth/acceso", credenciales);

      // Guardar token en cookie y también en localStorage para mayor seguridad
      Cookies.set("authToken", response.data.token, {
        expires: 1, // 1 día
        path: "/",
        sameSite: "strict",
      });

      // También guardamos el token en localStorage como respaldo
      localStorage.setItem("authToken", response.data.token);

      // Usuario puede seguir en localStorage
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          ...response.data.usuario,
          token: response.data.token, // Incluir el token en el objeto usuario
        })
      );

      return response.data;
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  },

  /**
   * Cierra la sesión actual
   */
  salir: async (): Promise<void> => {
    try {
      const token = authService.getToken();
      if (token) {
        await apiClient.post(
          "/auth/salir",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Error en el logout:", error);
      // Continuamos con la limpieza local aunque falle el backend
    } finally {
      // Eliminar tanto de cookies como de localStorage
      Cookies.remove("authToken");
      localStorage.removeItem("authToken");
      localStorage.removeItem("usuario");
    }
  },

  /**
   * Obtiene el usuario actual desde localStorage
   */
  getUsuarioActual: (): Usuario | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const usuarioStr = localStorage.getItem("authToken");
    let token = Cookies.get("authToken");

    // Si no hay token en cookies, intentar obtenerlo de localStorage
    if (!token) {
      token = localStorage.getItem("authToken");

      // Si encontramos el token en localStorage pero no en cookies, restaurarlo en cookies
      if (token) {
        Cookies.set("authToken", token, {
          expires: 1, // 1 día
          path: "/",
          sameSite: "strict",
        });
        console.log("🔄 Token restaurado desde localStorage a cookies");
      }
    }

    console.log("🔍 Obteniendo usuario actual:", {
      usuarioStr: usuarioStr ? "exists" : "null",
      token: token ? `${token.substring(0, 15)}...` : "null",
    });

    if (!usuarioStr) return null;

    try {
      const usuario = JSON.parse(usuarioStr) as Usuario;

      // Si el usuario tiene token almacenado pero no lo tenemos en la variable, usarlo
      if (!token && usuario.token) {
        token = usuario.token as string;
        // Restaurar token en cookies
        Cookies.set("authToken", token, {
          expires: 1, // 1 día
          path: "/",
          sameSite: "strict",
        });
        // Restaurar token en localStorage
        localStorage.setItem("authToken", token);
        console.log("🔄 Token restaurado desde objeto usuario");
      }

      return {
        ...usuario,
        token,
      };
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      localStorage.removeItem("usuario");
      return null;
    }
  },

  /**
   * Verifica si hay un usuario autenticado
   */
  estaAutenticado: (): boolean => {
    const token = Cookies.get("authToken");
    console.log("🔑 Verificando autenticación:", {
      token: token ? "exists" : "null",
    });
    return !!token;
  },

  /**
   * Verifica si el usuario actual tiene un rol específico
   */
  tieneRol: (rolId: number): boolean => {
    const usuario = authService.getUsuarioActual();
    return usuario?.rolId === rolId;
  },

  /**
   * Obtiene el token JWT actual
   */
  getToken: (): string | null => {
    // Intentar obtener el token de cookies
    let token = Cookies.get("authToken");

    // Si no hay token en cookies, intentar obtenerlo de localStorage
    if (!token) {
      token = localStorage.getItem("authToken");

      // Si encontramos el token en localStorage pero no en cookies, restaurarlo en cookies
      if (token) {
        Cookies.set("authToken", token, {
          expires: 1, // 1 día
          path: "/",
          sameSite: "strict",
        });
        console.log("🔄 Token restaurado desde localStorage a cookies");
      }
    }

    // Si todavía no hay token, intentar obtenerlo del usuario en localStorage
    if (!token) {
      const usuarioStr = localStorage.getItem("usuario");
      if (usuarioStr) {
        try {
          const usuario = JSON.parse(usuarioStr) as Usuario;
          if (usuario.token) {
            token = usuario.token as string;
            // Restaurar token en cookies y localStorage
            Cookies.set("authToken", token, {
              expires: 1, // 1 día
              path: "/",
              sameSite: "strict",
            });
            localStorage.setItem("authToken", token);
            console.log("🔄 Token restaurado desde objeto usuario");
          }
        } catch (error) {
          console.error(
            "Error al parsear el usuario para obtener token:",
            error
          );
        }
      }
    }

    console.log("🎫 Obteniendo token:", {
      token: token ? `${token.substring(0, 15)}...` : "null",
    });
    return token || null;
  },

  /**
   * Verifica si existe el perfil del paciente
   */
  verificarPerfilPaciente: async (usuarioId: number): Promise<boolean> => {
    try {
      // Usar el endpoint local para evitar problemas con el token
      const response = await fetch(
        `/api/pacientes/perfil?usuarioId=${usuarioId}`
      );
      const data = await response.json();

      console.log("🔍 Respuesta verificarPerfilPaciente:", data);

      // Si existe es true, significa que existe el perfil
      return data.existe === true;
    } catch (error: any) {
      console.error("Error al verificar perfil del paciente:", error);
      return false;
    }
  },

  /**
   * Verifica si el paciente tiene triaje inicial
   */
  verificarTriajePaciente: async (usuarioId: number): Promise<boolean> => {
    try {
      // Primero obtenemos el perfil del paciente
      const perfilResponse = await fetch(
        `/api/pacientes/perfil?usuarioId=${usuarioId}`
      );
      const perfilData = await perfilResponse.json();

      console.log("🔍 Respuesta verificarTriajePaciente (perfil):", perfilData);

      // Si no existe el perfil, no puede tener triaje
      if (perfilData.existe !== true) {
        return false;
      }

      const pacienteId = perfilData.id;

      // Luego verificamos si tiene triaje
      const triajeResponse = await fetch(
        `/api/pacientes/triaje?pacienteId=${pacienteId}`
      );
      const triajeData = await triajeResponse.json();

      console.log("🔍 Respuesta verificarTriajePaciente (triaje):", triajeData);

      // Si existe es true, significa que existe el triaje
      return triajeData.existe === true;
    } catch (error) {
      console.error("Error al verificar triaje del paciente:", error);
      return false;
    }
  },
};
