// src/providers/auth-provider.tsx
"use client";

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { authService } from '../services/auth';
import { DatosAcceso, DatosRegistro, Usuario } from '../types';


// Interfaz para el contexto de autenticación
interface AuthContextType {
    usuario: Usuario | null;
    cargando: boolean;
    estaAutenticado: boolean;
    registroUsuario: (datos: DatosRegistro) => Promise<Usuario>;
    iniciarSesion: (credenciales: DatosAcceso) => Promise<Usuario>;
    cerrarSesion: () => Promise<void>;
    tieneRol: (rolId: number) => boolean;
}

// Creación del contexto con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el provider
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);
    const [inicializado, setInicializado] = useState<boolean>(false);
    const router = useRouter();

    // Verificar autenticación al iniciar - SOLO SE EJECUTA EN EL CLIENTE
    useEffect(() => {
        if (typeof window !== 'undefined' && !inicializado) {
            const verificarAuth = () => {
                try {
                    // Intentar obtener el usuario del localStorage
                    const usuarioActual = authService.getUsuarioActual();
                    setUsuario(usuarioActual);
                } catch (error) {
                    console.error("Error al verificar autenticación:", error);
                    // En caso de error, limpiar datos
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                } finally {
                    setCargando(false);
                    setInicializado(true);
                }
            };

            verificarAuth();
        }
    }, [inicializado]);

    // Registrar un nuevo usuario
    const registroUsuario = async (datos: DatosRegistro): Promise<Usuario> => {
        setCargando(true);
        try {
            const respuesta = await authService.registro(datos);
            // setUsuario(respuesta.usuario);
            return respuesta.usuario;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        } finally {
            setCargando(false);
        }
    };

    // Iniciar sesión
    const iniciarSesion = async (credenciales: DatosAcceso): Promise<Usuario> => {
        setCargando(true);
        try {
            const respuesta = await authService.acceso(credenciales);
            setUsuario(respuesta.usuario);
            return respuesta.usuario;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        } finally {
            setCargando(false);
        }
    };

    // Cerrar sesión
    const cerrarSesion = async (): Promise<void> => {
        setCargando(true);
        try {
            await authService.salir();
            setUsuario(null);
            router.push('/acceso');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setCargando(false);
        }
    };

    // Verificar si el usuario tiene un rol específico
    const tieneRol = (rolId: number): boolean => {
        return usuario?.rolId === rolId;
    };

    // Valor del contexto
    const contextValue: AuthContextType = {
        usuario,
        cargando,
        estaAutenticado: !!usuario,
        registroUsuario,
        iniciarSesion,
        cerrarSesion,
        tieneRol
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto
// Hook para usar el contexto
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}