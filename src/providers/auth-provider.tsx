// src/providers/auth-provider.tsx
"use client"

import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'

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
                    // Intentar obtener el usuario y el token
                    const usuarioActual = authService.getUsuarioActual()
                    const token = authService.getToken()

                    console.log('token actual:', token ? token.substring(0, 15) + "..." : "no disponible")

                    if (usuarioActual && !token) {
                        console.warn("⚠️ Usuario encontrado pero sin token, cerrando sesión...")
                        authService.salir()
                        setUsuario(null)
                    } else if (usuarioActual && token) {
                        console.log("✅ Sesión restaurada:", {
                            id: usuarioActual.id,
                            token: token.substring(0, 15) + "..."
                        })
                        setUsuario({
                            ...usuarioActual,
                            token
                        })

                        // Si es paciente, verificar su estado
                        if (usuarioActual.rolId === ROLES.PACIENTE) {
                            verificarEstadoPaciente(usuarioActual.id, token)
                        }
                    }
                } catch (error) {
                    console.error("❌ Error al verificar autenticación:", error)
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
    const verificarEstadoPaciente = async (usuarioId: number, token: string) => {
        try {
            console.log("🔍 Verificando estado del paciente:", usuarioId)

            // Verificar si tiene perfil
            const perfilResponse = await fetch(`/api/pacientes/perfil?usuarioId=${usuarioId}&token=${token}`);
            const perfilData = await perfilResponse.json();

            const tienePerfil = perfilData.existe === true;
            console.log("✅ Tiene perfil:", tienePerfil, perfilData);

            setNecesitaCompletarPerfil(!tienePerfil);

            // Si no tiene perfil, no necesitamos verificar el triaje
            if (!tienePerfil) {
                setNecesitaTriajeInicial(false);
                return { tienePerfil, tieneTriaje: false, perfilData };
            }

            // Verificar si tiene triaje (usando el ID del paciente del perfil)
            const pacienteId = perfilData.id;
            console.log("🔍 ID del paciente para verificar triaje:", pacienteId);

            if (!pacienteId) {
                console.warn("⚠️ No se encontró ID de paciente en los datos del perfil");
                setNecesitaTriajeInicial(true);
                return { tienePerfil, tieneTriaje: false, perfilData };
            }

            const triajeResponse = await fetch(`/api/pacientes/triaje?pacienteId=${pacienteId}&token=${token}`);
            const triajeData = await triajeResponse.json();

            const tieneTriaje = triajeData.existe === true;
            console.log("✅ Tiene triaje:", tieneTriaje, triajeData);

            setNecesitaTriajeInicial(!tieneTriaje);

            return { tienePerfil, tieneTriaje, perfilData, triajeData };
        } catch (error) {
            console.error("❌ Error al verificar estado del paciente:", error);
            // Por defecto, asumimos que necesita completar perfil y triaje
            setNecesitaCompletarPerfil(true);
            setNecesitaTriajeInicial(true);
            return { tienePerfil: false, tieneTriaje: false };
        }
    }

    // Registrar un nuevo usuario
    const registroUsuario = useCallback(async (datos: DatosRegistro): Promise<Usuario> => {
        setCargando(true)
        try {
            const respuesta = await authService.registro(datos)
            return respuesta.usuario
        } catch (error) {
            console.error('Error al registrar usuario:', error)
            throw error
        } finally {
            setCargando(false)
        }
    }, [])

    // Iniciar sesión
    const iniciarSesion = useCallback(async (credenciales: DatosAcceso): Promise<Usuario> => {
        setCargando(true)
        try {
            const respuesta = await authService.acceso(credenciales)
            setUsuario(respuesta.usuario)

            if (respuesta.usuario.rolId === ROLES.PACIENTE) {
                const token = respuesta.usuario.token || ""
                const { tienePerfil, tieneTriaje } = await verificarEstadoPaciente(
                    respuesta.usuario.id,
                    token
                )

                // Usar setTimeout para asegurar que la redirección ocurra después de que se actualice el estado
                setTimeout(() => {
                    if (!tienePerfil) {
                        console.log("🔄 Redirigiendo a completar perfil")
                        router.push('/dashboard/paciente/completar-perfil')
                    } else if (!tieneTriaje) {
                        console.log("🔄 Redirigiendo a triaje inicial")
                        router.push('/dashboard/paciente/triaje-inicial')
                    } else {
                        console.log("✅ Usuario con perfil y triaje completos")
                        router.push('/dashboard/paciente')
                    }
                }, 300)
            }

            return respuesta.usuario
        } catch (error) {
            console.error('❌ Error al iniciar sesión:', error)
            throw error
        } finally {
            setCargando(false)
        }
    }, [router])

    // Cerrar sesión
    const cerrarSesion = useCallback(async (): Promise<void> => {
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
    }, [router])

    // Verificar si el usuario tiene un rol específico
    const tieneRol = useCallback((rolId: number): boolean => {
        return usuario?.rolId === rolId
    }, [usuario?.rolId])

    // Valor del contexto
    const contextValue = useMemo(() => ({
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
    }), [
        usuario,
        cargando,
        necesitaCompletarPerfil,
        necesitaTriajeInicial,
        registroUsuario,
        iniciarSesion,
        cerrarSesion,
        tieneRol
    ])

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