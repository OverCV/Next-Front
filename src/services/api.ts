import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<never> => Promise.reject(error)
);

// Interceptor para manejar errores comunes
apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.status === 401) {
            // Si hay error de autenticación, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            // Redirigir a login si estamos en el cliente
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;