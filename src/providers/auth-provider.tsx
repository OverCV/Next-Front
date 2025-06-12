// src/providers/auth-provider.tsx
"use client"

import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'

import { ROLES } from '../constants'
import { authService } from '../services/auth/auth.service'
import { pacientesService } from '../services/domain/pacientes.service'
import { DatosAcceso, Usuario, UsuarioAccedido } from '../types'


// Interfaz para el contexto de autenticación
interface AuthContextType {
    usuario: UsuarioAccedido | null
    cargando: boolean
    estaAutenticado: boolean
    registroUsuario: (datos: Usuario) => Promise<UsuarioAccedido>
    iniciarSesion: (credenciales: DatosAcceso) => Promise<UsuarioAccedido>
    cerrarSesion: () => Promise<void>
    tieneRol: (rolId: number) => boolean
    necesitaTriajeInicial: boolean
    setNecesitaTriajeInicial: (valor: boolean) => void
}

// Creación del contexto con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props para el provider
interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [usuario, setUsuario] = useState<UsuarioAccedido | null>(null)
    const [cargando, setCargando] = useState<boolean>(true)
    const [inicializado, setInicializado] = useState<boolean>(false)

    const [necesitaTriajeInicial, setNecesitaTriajeInicial] = useState<boolean>(false)
    const router = useRouter()

    // Verificar autenticación al iniciar - SOLO SE EJECUTA EN EL CLIENTE
    useEffect(() => {
        if (typeof window !== 'undefined' && !inicializado) {
            const verificarAuth = () => {
                try {
                    // Intentar obtener el usuario y el token
                    const usuarioActual = authService.obtenerUsuarioActual()
                    const token = authService.obtenerToken()

                    console.log('token actual:', token ? token.substring(0, 15) + "..." : "no disponible")

                    if (usuarioActual && !token) {
                        console.warn("⚠️ Usuario encontrado pero sin token, cerrando sesión...")
                        authService.limpiarSesion()
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

                        // Solo verificar estado si es paciente Y es la primera carga
                        if (usuarioActual.rolId === ROLES.PACIENTE) {
                            verificarTriajePaciente(usuarioActual.id, token)
                        }
                    }
                } catch (error) {
                    console.error("❌ Error al verificar autenticación:", error)
                    authService.limpiarSesion()
                    setUsuario(null)
                } finally {
                    setCargando(false)
                    setInicializado(true)
                }
            }

            verificarAuth()
        }
    }, [inicializado])

    // Verificar solo el triaje del paciente (el paciente siempre existe)
    const verificarTriajePaciente = async (usuarioId: number, token: string) => {
        try {
            console.log("🔍 Verificando triaje del paciente, usuarioId:", usuarioId)

            // 1. Primero obtener los datos del paciente para conseguir su ID
            const pacienteData = await pacientesService.obtenerPacientePorUsuarioId(usuarioId)

            if (pacienteData.existe === false || !pacienteData.id) {
                console.error("❌ Error crítico: Usuario sin paciente (esto no debería pasar)")
                setNecesitaTriajeInicial(true)
                return { tieneTriaje: false }
            }

            const pacienteId = pacienteData.id
            console.log("✅ Paciente encontrado, pacienteId:", pacienteId)

            // 2. Ahora verificar triaje usando el PACIENTE_ID correcto
            try {
                const triajeData = await pacientesService.verificarTriaje(pacienteId)

                const tieneTriaje = triajeData.existe === true
                console.log("✅ Verificación de triaje completada:", { pacienteId, tieneTriaje })

                setNecesitaTriajeInicial(!tieneTriaje)
                return { tieneTriaje }
            } catch (triajeError) {
                console.warn("⚠️ Error al verificar triaje, asumiendo que no tiene:", triajeError)
                setNecesitaTriajeInicial(true)
                return { tieneTriaje: false }
            }

        } catch (error) {
            console.error("❌ Error al verificar estado del paciente:", error)
            setNecesitaTriajeInicial(true)
            return { tieneTriaje: false }
        }
    }

    // Registrar un nuevo usuario
    const registroUsuario = useCallback(async (datos: Usuario): Promise<UsuarioAccedido> => {
        console.log("🚨 AUTH-PROVIDER: Iniciando registro de usuario")
        try {
            const respuesta = await authService.registro(datos)

            // Guardar usuario en el estado del contexto SIN verificaciones automáticas
            // console.log("🚨 AUTH-PROVIDER: Usuario registrado, guardando en contexto:", respuesta.usuario.id)
            // setUsuario(respuesta.usuario)
            // console.log("🚨 AUTH-PROVIDER: Usuario guardado en contexto (sin verificaciones automáticas)")

            return respuesta.usuario
        } catch (error) {
            console.error('🚨 AUTH-PROVIDER: Error al registrar usuario:', error)
            throw error
        }
    }, [])

    // Iniciar sesión
    const iniciarSesion = useCallback(async (credenciales: DatosAcceso): Promise<UsuarioAccedido> => {
        setCargando(true)
        try {
            const respuesta = await authService.acceso(credenciales)
            setUsuario(respuesta.usuario)

            if (respuesta.usuario.rolId === ROLES.PACIENTE) {
                const token = respuesta.usuario.token || ""
                const { tieneTriaje } = await verificarTriajePaciente(
                    respuesta.usuario.id,
                    token
                )

                // Usar setTimeout para asegurar que la redirección ocurra después de que se actualice el estado
                setTimeout(() => {
                    if (!tieneTriaje) {
                        console.log("🔄 Redirigiendo a triaje inicial")
                        router.push('/dashboard/paciente/triaje-inicial')
                    } else {
                        console.log("✅ Usuario con paciente y triaje completos")
                        router.push('/dashboard/paciente')
                    }
                }, 100)
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
        necesitaTriajeInicial,
        setNecesitaTriajeInicial
    }), [
        usuario,
        cargando,
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