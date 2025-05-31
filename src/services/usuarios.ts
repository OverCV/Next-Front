// src\services\usuarios.ts
import { UsuarioAccedido } from '../types';

import apiClient from './api';


// Servicios para manejo de usuarios
export const usuariosService = {
    /**
     * Obtiene todos los usuarios
     */
    obtenerUsuarios: async (): Promise<UsuarioAccedido[]> => {
        try {
            const response = await apiClient.get('/usuarios');
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    /**
     * Obtiene usuarios filtrados por rol
     */
    obtenerUsuariosPorRol: async (rolId: number): Promise<UsuarioAccedido[]> => {
        try {
            const response = await apiClient.get(`/usuarios`);

            // Filtrar por rol:npm run d
            const usuariosFiltrados = response.data.filter((usuario: UsuarioAccedido) => usuario.rolId === rolId);
            return usuariosFiltrados;

        } catch (error) {
            console.error(`Error al obtener usuarios con rol ${rolId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene un usuario por su ID
     */
    obtenerUsuarioPorId: async (id: number): Promise<UsuarioAccedido> => {
        try {
            const response = await apiClient.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza datos de un usuario
     */
    actualizarUsuario: async (id: number, datos: Partial<UsuarioAccedido>): Promise<UsuarioAccedido> => {
        try {
            const response = await apiClient.put(`/usuarios/${id}`, datos);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Cambia estado de un usuario (activar/desactivar)
     */
    cambiarEstadoUsuario: async (id: number, estaActivo: boolean): Promise<UsuarioAccedido> => {
        try {
            const response = await apiClient.patch(`/usuarios/${id}/estado`, { estaActivo });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado de usuario con ID ${id}:`, error);
            throw error;
        }
    }
};