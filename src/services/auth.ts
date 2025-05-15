// src/services/auth.ts
import { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

import { DatosAcceso, DatosRegistro, RespuestaAuth, Usuario } from '../types'

import apiClient from './api'

// Servicios de autenticación
export const authService = {

    /**
     * Registra un nuevo usuario
     */
    registro: async (datosUsuario: DatosRegistro): Promise<RespuestaAuth> => {
        try {
            const response: AxiosResponse<RespuestaAuth> =
                await apiClient.post('/auth/registro', datosUsuario)
            return response.data
        } catch (error) {
            console.error('Error en el registro:', error)
            throw error
        }
    },

    /**
     * Inicia sesión con credenciales
     */
    acceso: async (credenciales: DatosAcceso): Promise<RespuestaAuth> => {
        try {
            console.log("Petición:", apiClient.defaults.baseURL)

            const response = await apiClient.post('/auth/acceso', credenciales)

            // Guardar token en cookie
            Cookies.set('token', response.data.token, {
                expires: 1, // 1 día
                path: '/',
                sameSite: 'strict'
            })

            // Usuario puede seguir en localStorage
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario))

            return response.data
        } catch (error) {
            console.error('Error en el login:', error)
            throw error
        }
    },

    /**
     * Cierra la sesión actual
     */
    salir: async (): Promise<void> => {
        try {
            const token = authService.getToken()
            if (token) {
                await apiClient.post('/auth/salir', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            }
        } catch (error) {
            console.error('Error en el logout:', error)
            // Continuamos con la limpieza local aunque falle el backend
        } finally {
            // Eliminar tanto de cookies como de localStorage
            Cookies.remove('token')
            localStorage.removeItem('usuario')
        }
    },

    /**
     * Obtiene el usuario actual desde localStorage
     */
    getUsuarioActual: (): Usuario | null => {
        if (typeof window === 'undefined') {
            // Retorna null durante SSR
            return null
        }

        const usuarioStr = localStorage.getItem('usuario')
        const token = Cookies.get('token')

        if (!usuarioStr) return null

        try {
            const usuario = JSON.parse(usuarioStr) as Usuario
            // Añadir el token al objeto usuario
            return {
                ...usuario,
                token
            }
        } catch (error) {
            console.error('Error al parsear el usuario:', error)
            localStorage.removeItem('usuario')
            return null
        }
    },

    /**
     * Verifica si hay un usuario autenticado
     */
    estaAutenticado: (): boolean => {
        // Verificar tanto en cookies como en localStorage para compatibilidad
        return !!Cookies.get('token')
    },

    /**
     * Verifica si el usuario actual tiene un rol específico
     */
    tieneRol: (rolId: number): boolean => {
        const usuario = authService.getUsuarioActual()
        return usuario?.rolId === rolId
    },

    /**
     * Obtiene el token JWT actual
     */
    getToken: (): string | null => {
        return Cookies.get('token') || null
    },

    /**
     * Verifica si existe el perfil del paciente
     */
    verificarPerfilPaciente: async (usuarioId: number): Promise<boolean> => {
        try {
            const token = authService.getToken()
            const response = await apiClient.get(`/pacientes/usuario/${usuarioId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return !!response.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return false
            }
            console.error('Error al verificar perfil del paciente:', error)
            throw error
        }
    },

    /**
     * Verifica si el paciente tiene triaje inicial
     */
    verificarTriajePaciente: async (usuarioId: number): Promise<boolean> => {
        try {
            const token = authService.getToken()
            // Primero obtenemos el pacienteId
            const perfilResponse = await apiClient.get(`/pacientes/usuario/${usuarioId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const pacienteId = perfilResponse.data.id

            // Luego verificamos si tiene triaje
            const triajeResponse = await apiClient.get(`/triaje/paciente/${pacienteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return triajeResponse.data.length > 0
        } catch (error) {
            console.error('Error al verificar triaje del paciente:', error)
            return false
        }
    },
}