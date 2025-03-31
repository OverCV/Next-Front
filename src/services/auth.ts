// src\services\auth.ts
import { AxiosResponse } from 'axios';

import { DatosAcceso, DatosRegistro, RespuestaAuth, Usuario } from '../types';

import apiClient from './api';


// Servicios de autenticación
export const authService = {

    /**
     * Registra un nuevo usuario
     */
    registro: async (datosUsuario: DatosRegistro): Promise<RespuestaAuth> => {
        try {
            const response: AxiosResponse<RespuestaAuth> =
                await apiClient.post('/auth/registro', datosUsuario);
            return response.data;
        } catch (error) {
            console.error('Error en el registro:', error);
            throw error;
        }
    },


    /**
     * Inicia sesión con credenciales
     */
    acceso: async (credenciales: DatosAcceso): Promise<RespuestaAuth> => {
        try {
            const response = await apiClient.post('/auth/acceso', credenciales);

            // Guardar en cookie (más seguro y accesible por middleware)
            document.cookie = `token=${response.data.token}; path=/; max-age=86400; samesite=strict`;

            // Usuario puede seguir en localStorage
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

            return response.data;
        } catch (error) {
            console.error('Error en el login:', error);
            throw error;
        }
        // Opción sin cookies (menos seguro, pero más fácil de implementar en SSR). Guarda en localStorage
        // try {
        //     const response: AxiosResponse<RespuestaAuth> = await apiClient.post('/auth/acceso', credenciales);

        //     // Guardar datos en localStorage
        //     if (response.data.token) {
        //         localStorage.setItem('token', response.data.token);
        //         localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        //     }

        //     return response.data;
        // } catch (error) {
        //     console.error('Error en el login:', error);
        //     throw error;
        // }
    },

    /**
     * Cierra la sesión actual
     */
    salir: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/salir');
        } catch (error) {
            console.error('Error en el logout:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
        }
    },

    /**
     * Obtiene el usuario actual desde localStorage
     */
    getUsuarioActual: (): Usuario | null => {
        if (typeof window === 'undefined') {
            return null; // Retorna null durante SSR
        }

        const usuarioStr = localStorage.getItem('usuario');
        if (!usuarioStr) return null;

        try {
            return JSON.parse(usuarioStr) as Usuario;
        } catch (error) {
            console.error('Error al parsear el usuario:', error);
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
    },
};