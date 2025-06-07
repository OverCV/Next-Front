// src/services/auth/index.ts

// Servicios principales
export { authService } from './auth.service'
export { pacientesAuthService } from './pacientes.service'

// Configuración
export { ENDPOINTS } from './endpoints'

// Re-exportamos para mantener compatibilidad
export { authService as default } from './auth.service' 