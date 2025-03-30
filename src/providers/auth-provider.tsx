// src/providers/auth-provider.tsx
"use client";

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { authService } from '../services/auth';
import { DatosAcceso, Usuario } from '../types';


// Interfaz para el contexto de autenticación
interface AuthContextType {
    usuario: Usuario | null;
    cargando: boolean;
    estaAutenticado: boolean;
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
    const router = useRouter();

    // Verificar autenticación al cargar
    useEffect(() => {
        const verificarAuth = (): void => {
            try {
                const usuarioActual = authService.getUsuarioActual();
                setUsuario(usuarioActual);
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
            } finally {
                setCargando(false);
            }
        };

        verificarAuth();
    }, []);

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
            router.push('/auth/login');
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
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
}