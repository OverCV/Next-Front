import axios from "axios";
import { API_URL } from "../config/env";

// Configuración base de Axios
const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      // Opcional: redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== MÉTODOS HTTP ==========

/**
 * Petición GET
 * @param {string} url - URL del endpoint
 * @param {object} params - Parámetros de consulta (opcional)
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise} - Respuesta de la petición
 */
export const httpGet = async (url: string, params = {}, config = {}) => {
  try {
    const response = await API.get(url, {
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error("Error en GET:", error);
    throw error;
  }
};

/**
 * Petición POST
 * @param {string} url - URL del endpoint
 * @param {object} data - Datos a enviar en el body
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise} - Respuesta de la petición
 */
export const httpPost = async (url: string, data = {}, config = {}) => {
  try {
    const response = await API.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error en POST:", error);
    throw error;
  }
};

/**
 * Petición PUT
 * @param {string} url - URL del endpoint
 * @param {object} data - Datos a enviar en el body
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise} - Respuesta de la petición
 */
export const httpPut = async (url: string, data = {}, config = {}) => {
  try {
    const response = await API.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
};

/**
 * Petición PATCH
 * @param {string} url - URL del endpoint
 * @param {object} data - Datos a enviar en el body
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise} - Respuesta de la petición
 */
export const httpPatch = async (url: string, data = {}, config = {}) => {
  try {
    const response = await API.patch(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error en PATCH:", error);
    throw error;
  }
};

/**
 * Petición DELETE
 * @param {string} url - URL del endpoint
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise} - Respuesta de la petición
 */
export const httpDelete = async (url: string, config = {}) => {
  try {
    const response = await API.delete(url, config);
    return response.data;
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
};
