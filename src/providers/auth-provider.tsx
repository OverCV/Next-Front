// src/providers/auth-provider.tsx
"use client"

import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { ROLES } from '../constants'
import { authService } from '../services/auth'
import { DatosAcceso, DatosRegistro, Usuario } from '../types'


// Interfaz para el contexto de autenticación
interface AuthContextType {
    usuario: Usuario | null
    cargando: boolean
    estaAutenticado: boolean
    registroUsuario: (datos: DatosRegistro) => Promise<Usuario>
    iniciarSesion: (credenciales: DatosAcceso) => Promise<Usuario>
    cerrarSesion: () => Promise<void>
    tieneRol: (rolId: number) => boolean
    necesitaCompletarPerfil: boolean
    necesitaTriajeInicial: boolean
    setNecesitaCompletarPerfil: (valor: boolean) => void
    setNecesitaTriajeInicial: (valor: boolean) => void
}

// Creación del contexto con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props para el provider
interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [cargando, setCargando] = useState<boolean>(true)
    const [inicializado, setInicializado] = useState<boolean>(false)

    const [necesitaCompletarPerfil, setNecesitaCompletarPerfil] = useState<boolean>(false)
    const [necesitaTriajeInicial, setNecesitaTriajeInicial] = useState<boolean>(false)
    const router = useRouter()

    // Verificar autenticación al iniciar - SOLO SE EJECUTA EN EL CLIENTE
    useEffect(() => {
        if (typeof window !== 'undefined' && !inicializado) {
            const verificarAuth = () => {
                try {
                    // Intentar obtener el usuario del localStorage y el token de las cookies
                    const usuarioActual = authService.getUsuarioActual()
                    if (usuarioActual && !usuarioActual.token) {
                        // Si hay usuario pero no token, cerrar sesión
                        authService.salir()
                        setUsuario(null)
                    } else {
                        setUsuario(usuarioActual)
                    }
                } catch (error) {
                    console.error("Error al verificar autenticación:", error)
                    // En caso de error, limpiar datos
                    authService.salir()
                    setUsuario(null)
                } finally {
                    setCargando(false)
                    setInicializado(true)
                }
            }

            verificarAuth()
        }
    }, [inicializado])

    // Verificar si el usuario necesita completar su perfil o triaje inicial
    const verificarEstadoPaciente = async (usuarioId: number) => {
        try {
            // Aquí deberías hacer las llamadas a tu API para verificar:
            // 1. Si existe el registro en la tabla paciente
            // 2. Si tiene un triaje inicial
            const tienePerfil = await authService.verificarPerfilPaciente(usuarioId)
            const tieneTriaje = await authService.verificarTriajePaciente(usuarioId)

            setNecesitaCompletarPerfil(!tienePerfil)
            setNecesitaTriajeInicial(!tieneTriaje)

            return { tienePerfil, tieneTriaje }
        } catch (error) {
            console.error("Error al verificar estado del paciente:", error)
            return { tienePerfil: false, tieneTriaje: false }
        }
    }

    // Registrar un nuevo usuario
    const registroUsuario = async (datos: DatosRegistro): Promise<Usuario> => {
        setCargando(true)
        try {
            const respuesta = await authService.registro(datos)
            // setUsuario(respuesta.usuario)
            return respuesta.usuario
        } catch (error) {
            console.error('Error al registrar usuario:', error)
            throw error
        } finally {
            setCargando(false)
        }
    }

    // Iniciar sesión
    const iniciarSesion = async (credenciales: DatosAcceso): Promise<Usuario> => {
        setCargando(true)
        try {
            const respuesta = await authService.acceso(credenciales)
            setUsuario(respuesta.usuario)

            // Si es paciente, verificar su estado
            if (respuesta.usuario.rolId === ROLES.PACIENTE) {
                const { tienePerfil, tieneTriaje } = await verificarEstadoPaciente(respuesta.usuario.id)

                // Determinar la ruta de redirección basada en el estado
                if (!tienePerfil) {
                    router.push('/completar-perfil')
                } else if (!tieneTriaje) {
                    router.push('/triaje-inicial')
                }
            }

            return respuesta.usuario
        } catch (error) {
            console.error('Error al iniciar sesión:', error)
            throw error
        } finally {
            setCargando(false)
        }
    }

    // Cerrar sesión
    const cerrarSesion = async (): Promise<void> => {
        setCargando(true)
        try {
            await authService.salir()
            setUsuario(null)
            router.push('/acceso')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        } finally {
            setCargando(false)
        }
    }

    // Verificar si el usuario tiene un rol específico
    const tieneRol = (rolId: number): boolean => {
        return usuario?.rolId === rolId
    }

    // Valor del contexto
    const contextValue: AuthContextType = {
        usuario,
        cargando,
        estaAutenticado: !!usuario,
        registroUsuario,
        iniciarSesion,
        cerrarSesion,
        tieneRol,
        necesitaCompletarPerfil,
        necesitaTriajeInicial,
        setNecesitaCompletarPerfil,
        setNecesitaTriajeInicial
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook personalizado para usar el contexto
// Hook para usar el contexto
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}