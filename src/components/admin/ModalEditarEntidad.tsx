"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { X, Save, Loader2 } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/src/components/ui/dialog"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/src/components/ui/select"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { usuariosService } from "@/src/services/domain/usuarios.service"
import { entidadSaludService } from "@/src/services/domain/entidad-salud.service"
import { UsuarioAccedido, EntidadSalud, TiposIdentificacionEnum } from "@/src/types"

// Schema de validación
const esquemaEditarEntidad = z.object({
    // Datos de usuario
    tipoIdentificacion: z.enum(["CC", "TI", "NIT", "RCN", "CE", "PEP"]),
    identificacion: z.string().min(1, "La identificación es requerida"),
    nombres: z.string().min(1, "El nombre es requerido"),
    apellidos: z.string().min(1, "Los apellidos son requeridos"),
    correo: z.string().email("Debe ser un correo válido"),
    celular: z.string().min(1, "El celular es requerido"),
    estado: z.enum(["ACTIVO", "INACTIVO", "SUSPENDIDO", "PENDIENTE"]),
    
    // Datos de entidad de salud
    razonSocial: z.string().min(1, "La razón social es requerida"),
    direccion: z.string().min(1, "La dirección es requerida"),
    telefono: z.string().min(1, "El teléfono es requerido"),
    correoEntidad: z.string().email("Debe ser un correo válido")
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

    const form = useForm<FormularioEditarEntidad>({
        resolver: zodResolver(esquemaEditarEntidad),
        defaultValues: {
            tipoIdentificacion: usuario.tipoIdentificacion as any,
            identificacion: usuario.identificacion,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            celular: usuario.celular,
            estado: usuario.estado as any,
            razonSocial: entidadSalud?.razonSocial || "",
            direccion: entidadSalud?.direccion || "",
            telefono: entidadSalud?.telefono || "",
            correoEntidad: entidadSalud?.correo || usuario.correo
        }
    })

    const onSubmit = async (datos: FormularioEditarEntidad) => {
        setCargando(true)
        setError(null)
        
        try {
            // Actualizar datos del usuario
            const datosUsuario = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                correo: datos.correo,
                celular: datos.celular,
                estado: datos.estado
            }

            const usuarioActualizado = await usuariosService.actualizarUsuario(usuario.id, datosUsuario)

            // Actualizar datos de la entidad si existe
            if (entidadSalud && entidadSalud.id) {
                const datosEntidad = {
                    razonSocial: datos.razonSocial,
                    direccion: datos.direccion,
                    telefono: datos.telefono,
                    correo: datos.correoEntidad
                }

                await entidadSaludService.actualizarEntidadSalud(entidadSalud.id, datosEntidad)
            }

            // Llamar al callback de actualización
            onActualizar(usuarioActualizado)
            
            // Cerrar modal
            onCerrar()
        } catch (err: any) {
            console.error("Error al actualizar entidad:", err)
            setError(err.response?.data?.message || "Error al actualizar los datos de la entidad")
        } finally {
            setCargando(false)
        }
    }

    const handleCerrar = () => {
        if (!cargando) {
            form.reset()
            setError(null)
            onCerrar()
        }
    }

    return (
        <Dialog open={abierto} onOpenChange={handleCerrar}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Editar Entidad de Salud</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCerrar}
                            disabled={cargando}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Datos del Usuario */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Datos del Usuario</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tipoIdentificacion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Identificación</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="NIT">NIT</SelectItem>
                                                    <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                                    <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                                                    <SelectItem value="RCN">Registro Civil de Nacimiento</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="identificacion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Identificación</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Número de identificación" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombres"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombres</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Nombres" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="apellidos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellidos</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Apellidos" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="correo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" placeholder="correo@ejemplo.com" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="celular"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Celular</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Número de celular" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ACTIVO">Activo</SelectItem>
                                                <SelectItem value="INACTIVO">Inactivo</SelectItem>
                                                <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                                                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Datos de la Entidad de Salud */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Datos de la Entidad de Salud</h3>
                            
                            <FormField
                                control={form.control}
                                name="razonSocial"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Razón Social</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nombre de la entidad" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Dirección completa" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="telefono"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Teléfono de contacto" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="correoEntidad"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo de la Entidad</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" placeholder="entidad@ejemplo.com" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4">
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
                </Form>
            </DialogContent>
        </Dialog>
    )
} 