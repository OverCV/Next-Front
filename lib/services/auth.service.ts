// src/services/auth.service.ts
import apiClient from './api';

// Tipos
export interface DatosAcceso {
    tipoIdentificacion: string;
    identificacion: string;
    clave: string;
}

export interface DatosRegistro {
    tipoIdentificacion: string;
    identificacion: string;
    nombres: string;
    apellidos: string;
    correo: string;
    clave: string;
    celular: string;
    estaActivo: boolean;
    rolId: number;
}

export interface Usuario {
    id: number;
    tipoIdentificacion: string;
    identificacion: string;
    nombres: string;
    apellidos: string;
    correo: string;
    celular: string;
    estaActivo: boolean;
    rolId: number;
}

export interface RespuestaAuth {
    usuario: Usuario;
    token: string;
}

export const authService = {
    /**
     * Inicia sesión con credenciales
     */
    login: async (credenciales: DatosAcceso): Promise<RespuestaAuth> => {
        const response = await apiClient.post('/auth/acceso', credenciales);
        const data = response.data;

        // Guardar datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        return data;
    },

    /**
     * Registra un nuevo usuario
     */
    registro: async (datosUsuario: DatosRegistro): Promise<RespuestaAuth> => {
        const response = await apiClient.post('/auth/registro', datosUsuario);
        return response.data;
    },

    /**
     * Cierra la sesión actual
     */
    logout: async (): Promise<void> => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    },

    /**
     * Obtiene el usuario actual desde localStorage
     */
    getUsuarioActual: (): Usuario | null => {
        const usuarioStr = localStorage.getItem('usuario');
        if (!usuarioStr) return null;

        try {
            return JSON.parse(usuarioStr);
        } catch (error) {
            localStorage.removeItem('usuario');
            return null;
        }
    },

    /**
     * Verifica si hay un usuario autenticado
     */
    estaAutenticado: (): boolean => {
        return !!localStorage.getItem('token');
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
        return localStorage.getItem('token');
    }
};