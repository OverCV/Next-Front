import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

import { API_SPRINGBOOT_URL } from '@/src/config/env'

console.log("🔵 apiClient.ts: Script cargado. Definiendo apiClient...")

const apiSpringClient: AxiosInstance = axios.create({
    baseURL: API_SPRINGBOOT_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

console.log("🔵 apiClient.ts: Instancia de Axios creada. BaseURL:", apiSpringClient.defaults.baseURL)

// Interceptor para añadir el token a todas las peticiones
apiSpringClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const metodo = config.method?.toUpperCase()
        const ruta = config.url

        let token: string | undefined = Cookies.get('authToken')

        if (!token && typeof window !== 'undefined') {
            token = localStorage.getItem('authToken') || undefined
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Log simplificado sin exponer información sensible
        console.log(`📡 ${metodo} ${ruta} - Token: ${token ? '✅' : '❌'}`)

        return config
    },
    (error: AxiosError): Promise<never> => {
        console.error("❌ Error en configuración de petición:", error.message)
        return Promise.reject(error)
    }
)

console.log("🔵 apiClient.ts: Interceptor de REQUEST configurado.")

// Interceptor para manejar errores comunes
apiSpringClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        const metodo = response.config.method?.toUpperCase()
        const ruta = response.config.url
        const status = response.status

        console.log(`✅ ${metodo} ${ruta} - ${status}`)
        return response
    },
    (error: AxiosError): Promise<AxiosError> => {
        const metodo = error.config?.method?.toUpperCase()
        const ruta = error.config?.url
        const status = error.response?.status

        console.error(`❌ ${metodo} ${ruta} - ${status}`)

        if (status === 401) {
            console.warn("🚫 Sesión expirada - Limpiando tokens...")
            Cookies.remove('authToken')

            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken')
                localStorage.removeItem('usuario')
            }
        }

        return Promise.reject(error)
    }
)

console.log("🔵 apiClient.ts: Interceptor de RESPONSE configurado.")

export default apiSpringClient