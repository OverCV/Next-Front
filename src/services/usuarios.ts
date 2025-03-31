import { Usuario } from '../types';
import apiClient from './api';

export const usuariosService = {
    /**
     * Obtiene todos los usuarios
     */
    obtenerUsuarios: async (): Promise<Usuario[]> => {
        try {
            const response = await apiClient.get('/usuarios');
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    /**
     * Filtra usuarios por rol
     */
    obtenerUsuariosPorRol: async (rolId: number): Promise<Usuario[]> => {
        try {
            // Obtenemos todos y filtramos por rol en el cliente
            // En una API más completa, esto sería un parámetro en el endpoint
            const usuarios = await usuariosService.obtenerUsuarios();
            return usuarios.filter(usuario => usuario.rolId === rolId);
        } catch (error) {
            console.error(`Error al obtener usuarios con rol ${rolId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene un usuario por su ID
     */
    obtenerUsuarioPorId: async (id: number): Promise<Usuario> => {
        try {
            const response = await apiClient.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }
};