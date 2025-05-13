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
            console.log("Petición:", apiClient.defaults.baseURL);

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

    /**
     * Verifica si existe el perfil del paciente
     */
    verificarPerfilPaciente: async (usuarioId: number): Promise<boolean> => {
        try {
            const response = await apiClient.get(`/pacientes/usuario/${usuarioId}`);
            return !!response.data; // Si hay datos, existe el perfil
        } catch (error: any) {
            if (error.response?.status === 404) {
                return false; // No existe el perfil
            }
            console.error('Error al verificar perfil del paciente:', error);
            throw error;
        }
    },

    /**
     * Verifica si el paciente tiene triaje inicial
     */
    verificarTriajePaciente: async (usuarioId: number): Promise<boolean> => {
        try {
            // Primero obtenemos el pacienteId
            const perfilResponse = await apiClient.get(`/pacientes/usuario/${usuarioId}`);
            const pacienteId = perfilResponse.data.id;

            // Luego verificamos si tiene triaje
            const triajeResponse = await apiClient.get(`/triaje`);
            const triajes = triajeResponse.data;

            // Verificar si existe algún triaje para este paciente
            return triajes.some((triaje: any) => triaje.pacienteId === pacienteId);
        } catch (error) {
            console.error('Error al verificar triaje del paciente:', error);
            return false;
        }
    },
};