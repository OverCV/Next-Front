import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

import { API_URL } from '@/src/config/env'

console.log("🔵 apiClient.ts: Script cargado. Definiendo apiClient...")

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

console.log("🔵 apiClient.ts: Instancia de Axios creada. BaseURL:", apiClient.defaults.baseURL)

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        console.log(`🔵 apiClient InteREQ (${config.method?.toUpperCase()} ${config.url}): Ejecutando...`)
        let token: string | undefined = Cookies.get('authToken')

        if (token) {
            console.log(`🔵 apiClient InteREQ (${config.url}): Token encontrado en COOKIES.`)
        } else {
            console.log(`🔵 apiClient InteREQ (${config.url}): Token NO encontrado en cookies. Intentando localStorage...`)

            // Verificar si estamos en el cliente antes de usar localStorage
            if (typeof window !== 'undefined') {
                const localStorageToken = localStorage.getItem('authToken')
                if (localStorageToken) {
                    token = localStorageToken
                    console.log(`🔵 apiClient InteREQ (${config.url}): Token SÍ encontrado en localStorage.`)
                } else {
                    console.log(`🔵 apiClient InteREQ (${config.url}): Token NO encontrado en localStorage.`)
                }
            } else {
                console.log(`🔵 apiClient InteREQ (${config.url}): Ejecutándose en servidor, saltando localStorage.`)
            }
        }

        if (token && config.headers) {
            console.log(`🔵 apiClient InteREQ (${config.url}): Adjuntando 'Authorization: Bearer ${token.substring(0, 15)}...'`)
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.log(`🔵 apiClient InteREQ (${config.url}): NO se adjuntará token (token=${token}, config.headers=${!!config.headers}).`)
        }

        // Log para ver todos los headers que se van a enviar
        console.log(`🔵 apiClient InteREQ (${config.url}): Headers FINALES:`, JSON.stringify(config.headers, null, 2))
        return config
    },
    (error: AxiosError): Promise<never> => {
        console.error("🔴 apiClient InteREQ: Error en la configuración de la petición:", error)
        return Promise.reject(error)
    }
)

console.log("🔵 apiClient.ts: Interceptor de REQUEST configurado.")

// Interceptor para manejar errores comunes
apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        console.log(`🔵 apiClient InteRES (${response.config.method?.toUpperCase()} ${response.config.url}): Respuesta recibida, status ${response.status}`)
        return response
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error(`🔴 apiClient InteRES (Petición a ${error.config?.url}): Error en la respuesta. Status: ${error.response?.status}`, error)
        if (error.response?.status === 401) {
            console.warn("🚫 apiClient InteRES: Error 401. Limpiando sesión...")
            Cookies.remove('authToken')

            // Solo limpiar localStorage si estamos en el cliente
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken')
                localStorage.removeItem('usuario')
            }
        }
        return Promise.reject(error)
    }
)

console.log("🔵 apiClient.ts: Interceptor de RESPONSE configurado.")

export default apiClient