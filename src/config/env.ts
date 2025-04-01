// src\config\env.ts
/**
 * Configuración de entorno - Detecta automáticamente desarrollo vs producción
 */

// URLs base de API según entorno
export const API_URL = process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://spring-logic.onrender.com/api'
        : 'http://localhost:8090/api');

// Determine si estamos en producción
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Configuración AppWrite
export const APPWRITE_CONFIG = {
    endpoint: process.env.NEXT_PUBLIC_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.PROJECT_ID,
    apiKey: process.env.API_KEY,
    bucketId: process.env.NEXT_PUBLIC_BUCKET_ID,
};

// Configuración de seguridad
export const ADMIN_PASSKEY = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || '111111';

// Configuración de Sentry
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

// URLs base de backend - para endpoints específicos
export const API_ENDPOINTS = {
    // Autenticación
    AUTH: `${API_URL}/auth`,
    USUARIOS: `${API_URL}/usuarios`,
    CAMPANAS: `${API_URL}/campanas`,
    EMBAJADORES: `${API_URL}/embajadores`,
    NOTIFICACIONES: `${API_URL}/notificaciones`,
};