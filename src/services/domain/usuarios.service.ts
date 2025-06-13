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
     * Actualiza solo los datos de perfil del usuario evitando campos problemáticos
     */
    actualizarPerfilUsuario: async (id: number, datosNuevos: Partial<UsuarioAccedido>): Promise<UsuarioAccedido> => {
        try {
            // Obtener usuario actual completo
            const usuarioActual = await usuariosService.obtenerUsuarioPorId(id);
            
            console.log("🔍 Usuario actual:", usuarioActual);
            console.log("📊 Campos de auditoría actuales:", {
                creadoPor: usuarioActual.creadoPor,
                creadoPorId: usuarioActual.creadoPorId,
                fechaCreacion: usuarioActual.fechaCreacion,
                fechaActualizacion: usuarioActual.fechaActualizacion,
                actualizadoPor: usuarioActual.actualizadoPor
            });
            
            // Crear un DTO que incluya solo los campos que el backend espera para PUT
            // Incluir TODOS los campos que el backend necesita, pero con la clave existente
            const datosCompletos = {
                // Campos actualizables
                tipoIdentificacion: datosNuevos.tipoIdentificacion || usuarioActual.tipoIdentificacion,
                identificacion: datosNuevos.identificacion || usuarioActual.identificacion, 
                nombres: datosNuevos.nombres || usuarioActual.nombres,
                apellidos: datosNuevos.apellidos || usuarioActual.apellidos,
                correo: datosNuevos.correo || usuarioActual.correo,
                celular: datosNuevos.celular || usuarioActual.celular,
                estado: datosNuevos.estado || usuarioActual.estado,
                
                // Campos que DEBEN mantenerse iguales
                rolId: usuarioActual.rolId,
                creadoPorId: usuarioActual.creadoPorId,
                
                // Campos de auditoría - mantener los existentes
                fechaCreacion: usuarioActual.fechaCreacion,
                creadoPor: usuarioActual.creadoPor,
                
                // IMPORTANTE: Usar la clave original si existe, o una clave dummy si no
                clave: usuarioActual.clave || "temp_password_placeholder"
            };
            
            console.log("📤 Enviando datos completos:", datosCompletos);
            
            const response = await apiSpringClient.put(ENDPOINTS.USUARIOS.PERFIL(id), datosCompletos);
            
            console.log("✅ Usuario actualizado:", response.data);
            console.log("📊 Campos de auditoría después de actualización:", {
                creadoPor: response.data.creadoPor,
                creadoPorId: response.data.creadoPorId,
                fechaCreacion: response.data.fechaCreacion,
                fechaActualizacion: response.data.fechaActualizacion,
                actualizadoPor: response.data.actualizadoPor
            });
            
            return response.data;
        } catch (error) {
            console.error(`❌ Error al actualizar perfil:`, error);
            console.error(`❌ Response data:`, error.response?.data);
            throw error;
        }
    },

    /**
     * Cambia estado de un usuario (ACTIVO, INACTIVO, SUSPENDIDO, PENDIENTE)
     * NOTA: Este endpoint no existe en el backend, usar actualizarPerfilUsuario en su lugar
     */
    cambiarEstadoUsuario: async (id: number, nuevoEstado: string): Promise<UsuarioAccedido> => {
        console.warn("⚠️ Endpoint /estado no disponible, usando actualización de perfil");
        return await usuariosService.actualizarPerfilUsuario(id, { estado: nuevoEstado });
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