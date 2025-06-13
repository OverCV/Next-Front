"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { X, Save, Loader2 } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { usuariosService } from "@/src/services/domain/usuarios.service"
import { entidadSaludService } from "@/src/services/domain/entidad-salud.service"
import { UsuarioAccedido, EntidadSalud } from "@/src/types"

// Schema de validación simplificado y unificado
const esquemaEditarEntidad = z.object({
    // Datos unificados de la entidad
    tipoIdentificacion: z.enum(["CC", "TI", "NIT", "RCN", "CE", "PEP"]),
    identificacion: z.string().min(1, "La identificación es requerida"),
    nombreCompleto: z.string().min(1, "El nombre es requerido"),
    correo: z.string().email("Debe ser un correo válido"),
    celular: z.string().min(1, "El celular es requerido"),
    direccion: z.string().min(1, "La dirección es requerida"),
    estado: z.enum(["ACTIVO", "INACTIVO", "SUSPENDIDO", "PENDIENTE"])
})

type FormularioEditarEntidad = z.infer<typeof esquemaEditarEntidad>

interface ModalEditarEntidadProps {
    abierto: boolean
    onCerrar: () => void
    usuario: UsuarioAccedido
    entidadSalud?: EntidadSalud
    onActualizar: (usuarioActualizado: UsuarioAccedido) => void
}

export function ModalEditarEntidad({ 
    abierto, 
    onCerrar, 
    usuario, 
    entidadSalud, 
    onActualizar 
}: ModalEditarEntidadProps) {
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<FormularioEditarEntidad>({
        resolver: zodResolver(esquemaEditarEntidad),
        defaultValues: {
            tipoIdentificacion: usuario.tipoIdentificacion as any,
            identificacion: usuario.identificacion,
            nombreCompleto: `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim(),
            correo: usuario.correo,
            celular: usuario.celular,
            direccion: entidadSalud?.direccion || "",
            estado: usuario.estado as any
        }
    })

    // Efecto para resetear el formulario cuando cambie la entidad seleccionada
    useEffect(() => {
        if (abierto && usuario) {
            reset({
                tipoIdentificacion: usuario.tipoIdentificacion as any,
                identificacion: usuario.identificacion,
                nombreCompleto: `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim(),
                correo: usuario.correo,
                celular: usuario.celular,
                direccion: entidadSalud?.direccion || "",
                estado: usuario.estado as any
            })
            setError(null)
        }
    }, [abierto, usuario, entidadSalud, reset])

    const onSubmit = async (datos: FormularioEditarEntidad) => {
        setCargando(true)
        setError(null)
        
        try {
            // Separar nombre completo en nombres y apellidos
            const nombreParts = datos.nombreCompleto.trim().split(' ')
            const nombres = nombreParts.slice(0, -1).join(' ') || nombreParts[0] || ''
            const apellidos = nombreParts.length > 1 ? nombreParts[nombreParts.length - 1] : ''

            // Actualizar datos del usuario - MANTENER CAMPOS CRÍTICOS
            const datosUsuario = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: nombres,
                apellidos: apellidos,
                correo: datos.correo,
                celular: datos.celular,
                estado: datos.estado,
                // CAMPOS CRÍTICOS QUE NO DEBEN CAMBIAR
                rolId: usuario.rolId,
                creadoPorId: usuario.creadoPorId,
                // NO enviar clave para evitar que se vuelva null
            }

            const usuarioActualizado = await usuariosService.actualizarPerfilUsuario(usuario.id, datosUsuario)

            // Actualizar datos de la entidad si existe
            if (entidadSalud && entidadSalud.id) {
                const datosEntidad = {
                    razonSocial: datos.nombreCompleto,
                    direccion: datos.direccion,
                    telefono: datos.celular,
                    correo: datos.correo,
                    usuarioId: usuario.id
                }

                await entidadSaludService.actualizarEntidadSalud(entidadSalud.id, datosEntidad)
            }

            // Llamar al callback de actualización
            onActualizar(usuarioActualizado)
            
            // Cerrar modal
            handleCerrar()
        } catch (err: any) {
            console.error("Error al actualizar entidad:", err)
            setError(err.response?.data?.message || "Error al actualizar los datos de la entidad")
        } finally {
            setCargando(false)
        }
    }

    const handleCerrar = () => {
        if (!cargando) {
            reset()
            setError(null)
            setCargando(false)
            onCerrar()
        }
    }

    // Manejar click en el overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCerrar()
        }
    }

    if (!abierto) return null

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Editar Entidad de Salud</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCerrar}
                        disabled={cargando}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Datos de la Entidad */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Datos de la Entidad</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipo de Identificación</label>
                                    <select 
                                        {...register("tipoIdentificacion")}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="NIT">NIT</option>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="RCN">Registro Civil de Nacimiento</option>
                                    </select>
                                    {errors.tipoIdentificacion && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tipoIdentificacion.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Identificación</label>
                                    <Input 
                                        {...register("identificacion")}
                                        placeholder="Número de identificación" 
                                    />
                                    {errors.identificacion && (
                                        <p className="text-red-500 text-sm mt-1">{errors.identificacion.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                                    <Input 
                                        {...register("nombreCompleto")}
                                        placeholder="Nombre completo" 
                                    />
                                    {errors.nombreCompleto && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nombreCompleto.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                                    <Input 
                                        {...register("correo")}
                                        type="email"
                                        placeholder="correo@ejemplo.com" 
                                    />
                                    {errors.correo && (
                                        <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Celular</label>
                                    <Input 
                                        {...register("celular")}
                                        placeholder="Número de celular" 
                                    />
                                    {errors.celular && (
                                        <p className="text-red-500 text-sm mt-1">{errors.celular.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Estado</label>
                                    <select 
                                        {...register("estado")}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="INACTIVO">Inactivo</option>
                                        <option value="SUSPENDIDO">Suspendido</option>
                                        <option value="PENDIENTE">Pendiente</option>
                                    </select>
                                    {errors.estado && (
                                        <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Dirección</label>
                                <Input 
                                    {...register("direccion")}
                                    placeholder="Dirección completa" 
                                />
                                {errors.direccion && (
                                    <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCerrar}
                                disabled={cargando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 