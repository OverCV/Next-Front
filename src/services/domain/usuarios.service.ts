import { Usuario, UsuarioAccedido } from '@/src/types';

import apiSpringClient from '../api';
import { ENDPOINTS } from '../auth/endpoints';


// Servicios para manejo de usuarios
export const usuariosService = {
    /**
     * Crea un nuevo usuario (requiere autenticación como embajador/admin)
     */
    crearUsuario: async (token: string, datosUsuario: Usuario): Promise<UsuarioAccedido> => {
        try {
            const response = await apiSpringClient.post(ENDPOINTS.AUTH.REGISTRO, datosUsuario, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log("✅ Usuario creado exitosamente:", response.data.usuario)

            return response.data.usuario
        } catch (error: any) {
            console.error('❌ Error al crear usuario:', error)
            console.error('❌ Respuesta del servidor:', error.response?.data)
            throw error
        }
    },

    /**
     * Obtiene todos los usuarios
     */
    obtenerUsuarios: async (): Promise<UsuarioAccedido[]> => {
        try {
            const response = await apiSpringClient.get(ENDPOINTS.USUARIOS.BASE);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    /**
     * Obtiene usuarios creados por un usuario específico usando creadoPorId
     */
    obtenerUsuariosPorCreador: async (creadoPorId: number): Promise<UsuarioAccedido[]> => {
        try {
            const response = await apiSpringClient.get(ENDPOINTS.USUARIOS.BASE);
            // Filtrar por creadoPorId usando el nuevo campo de la DB
            const usuariosFiltrados = response.data.filter((usuario: UsuarioAccedido & { creadoPorId?: number }) =>
                usuario.creadoPorId === creadoPorId
            );
            return usuariosFiltrados;
        } catch (error) {
            console.error(`Error al obtener usuarios creados por ${creadoPorId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene usuarios filtrados por rol
     */
    obtenerUsuariosPorRol: async (rolId: number): Promise<UsuarioAccedido[]> => {
        try {
            const response = await apiSpringClient.get(ENDPOINTS.USUARIOS.BASE);
            // Filtrar por rol
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
            const response = await apiSpringClient.get(ENDPOINTS.USUARIOS.PERFIL(id));
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
            const response = await apiSpringClient.put(ENDPOINTS.USUARIOS.PERFIL(id), datos);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Cambia estado de un usuario (ACTIVO, INACTIVO, SUSPENDIDO, PENDIENTE)
     */
    cambiarEstadoUsuario: async (id: number, nuevoEstado: string): Promise<UsuarioAccedido> => {
        try {
            const response = await apiSpringClient.patch(`${ENDPOINTS.USUARIOS.BASE}/${id}/estado`, { 
                estado: nuevoEstado 
            });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado de usuario con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Desactiva/activa un usuario (método legacy mantenido por compatibilidad)
     */
    toggleUsuarioActivo: async (id: number, estaActivo: boolean): Promise<UsuarioAccedido> => {
        try {
            const response = await apiSpringClient.patch(`${ENDPOINTS.USUARIOS.BASE}/${id}/estado`, { estaActivo });
            return response.data;
        } catch (error) {
            console.error(`Error al cambiar estado activo de usuario con ID ${id}:`, error);
            throw error;
        }
    }
};