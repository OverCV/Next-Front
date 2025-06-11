// src\config\env.ts
/**
 * Configuración de entorno - Detecta automáticamente desarrollo vs producción
 */

// URLs base de API según entorno
export const API_SPRINGBOOT_URL = process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://spring-logic.onrender.com/api'
        : 'http://localhost:8090/api')

// URL para la API de predicciones de riesgo cardiovascular (FastAPI)
export const API_FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://fastapi-back-ps1z.onrender.com'
        : 'http://127.0.0.1:8000')

// Determine si estamos en producción
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Configuración AppWrite
export const APPWRITE_CONFIG = {
    endpoint: process.env.NEXT_PUBLIC_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.PROJECT_ID,
    apiKey: process.env.API_KEY,
    bucketId: process.env.NEXT_PUBLIC_BUCKET_ID,
}

// Configuración de seguridad
export const ADMIN_PASSKEY = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || '111111'

// Configuración de Sentry
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || ''