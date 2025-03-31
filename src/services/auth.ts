// src/services/auth.ts
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

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

            // Guardar token en cookie
            Cookies.set('token', response.data.token, {
                expires: 1, // 1 día
                path: '/',
                sameSite: 'strict'
            });

            // Usuario puede seguir en localStorage
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

            return response.data;
        } catch (error) {
            console.error('Error en el login:', error);
            throw error;
        }
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
            // Eliminar tanto de cookies como de localStorage
            Cookies.remove('token');
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
        // Verificar tanto en cookies como en localStorage para compatibilidad
        return !!Cookies.get('token');
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
        return Cookies.get('token') || null;
    },
};