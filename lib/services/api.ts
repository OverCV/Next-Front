// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar tokens de autenticación
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejo de errores comunes
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            if (error.response.status === 401) {
                // Token expirado o no válido
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                // Opcional: redirigir a login
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;