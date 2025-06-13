"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/src/components/ui/button"
import { Form } from "@/src/components/ui/form"
import { SelectItem } from "@/src/components/ui/select"
import { ROLES, TIPOS_IDENTIFICACION_USUARIO, TiposIdentificacionEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { notificacionesService } from "@/src/services/notificaciones"
import { Usuario, UsuarioAccedido } from "@/src/types"

import CustomFormField, { FormFieldType } from "../CustomFormField"

// Esquema de validación
const registroAuxiliarSchema = z.object({
    tipoIdentificacion: z.nativeEnum(TiposIdentificacionEnum),
    identificacion: z.string().min(8, "Identificación debe tener al menos 8 caracteres"),
    nombres: z.string().min(2, "Nombres son requeridos"),
    apellidos: z.string().min(2, "Apellidos son requeridos"),
    telefono: z.string().min(10, "Teléfono debe tener al menos 10 dígitos"),
    correo: z.string().email("Correo inválido").optional().or(z.literal("")),
    clave: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
    confirmarClave: z.string()
}).refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"]
})

type RegistroAuxiliarFormValues = z.infer<typeof registroAuxiliarSchema>

export default function RegistroAuxiliarForm() {
    const router = useRouter()
    const { usuario } = useAuth() as { usuario: UsuarioAccedido | null }
    const { registroUsuario } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [exitoso, setExitoso] = useState<boolean>(false)
    const [enviandoSMS, setEnviandoSMS] = useState<boolean>(false)

    const form = useForm<RegistroAuxiliarFormValues>({
        resolver: zodResolver(registroAuxiliarSchema),
        defaultValues: {
            tipoIdentificacion: TiposIdentificacionEnum.CC,
            identificacion: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            correo: "",
            clave: "",
            confirmarClave: ""
        }
    })

    // Función para enviar SMS de bienvenida
    const enviarSMSBienvenida = async (telefono: string, nombres: string, identificacion: string): Promise<void> => {
        try {
            setEnviandoSMS(true)
            const mensaje = `¡Hola ${nombres}! 🏥 Bienvenido al equipo auxiliar de HealInk. Tu cuenta ha sido creada. Usuario: ${identificacion} | Accede con la contraseña que definiste en healink.com`

            await notificacionesService.enviarSMS(telefono, mensaje)
            console.log("✅ SMS de bienvenida auxiliar enviado exitosamente")
        } catch (err) {
            console.error("⚠️ Error al enviar SMS de bienvenida auxiliar:", err)
        } finally {
            setEnviandoSMS(false)
        }
    }

    const onSubmit = async (datos: RegistroAuxiliarFormValues): Promise<void> => {
        setCargando(true)
        setError(null)
        setExitoso(false)

        try {
            // Validación simple: verificar que existe usuario
            if (!usuario?.id) {
                setError('No hay una sesión activa. Inicie sesión nuevamente')
                return
            }

            // Preparar datos para enviar al endpoint de registro
            const datosRegistro: Usuario = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                correo: datos.correo ?? `${datos.identificacion}@healink.com`,
                clave: datos.clave,
                celular: datos.telefono,
                estaActivo: true,
                rolId: ROLES.AUXILIAR
            }

            console.log('📝 Registrando auxiliar...')
            await registroUsuario(datosRegistro)

            setExitoso(true)

            // Enviar SMS de bienvenida de forma asíncrona
            enviarSMSBienvenida(datos.telefono, datos.nombres, datos.identificacion)

            form.reset()

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push('/dashboard/entidad')
            }, 2000)

        } catch (err: any) {
            console.error('Error al registrar auxiliar:', err)
            setError(err.message ?? 'Error al registrar el auxiliar')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Registrar Auxiliar</h1>
                <p className="text-slate-600 mt-2">
                    Complete los datos para registrar un nuevo auxiliar médico
                </p>
            </div>

            {exitoso ? (
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-green-800 font-medium">
                        ✅ Auxiliar registrado exitosamente
                        {enviandoSMS && " | Enviando SMS de bienvenida..."}
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                        Redirigiendo al dashboard...
                    </p>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Mensaje de error */}
                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Información personal */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Información Personal</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="tipoIdentificacion"
                                    label="Tipo de Identificación"
                                    placeholder="Seleccione el tipo"
                                >
                                    {TIPOS_IDENTIFICACION_USUARIO.map((tipo) => (
                                        <SelectItem key={tipo.valor} value={tipo.valor}>
                                            {tipo.etiqueta}
                                        </SelectItem>
                                    ))}
                                </CustomFormField>

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="identificacion"
                                    label="Número de Identificación"
                                    placeholder="Ej: 1234567890"
                                    iconSrc="/assets/icons/id-card.svg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="nombres"
                                    label="Nombres"
                                    placeholder="Ej: Juan Carlos"
                                    iconSrc="/assets/icons/user.svg"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="apellidos"
                                    label="Apellidos"
                                    placeholder="Ej: Pérez González"
                                    iconSrc="/assets/icons/user.svg"
                                />
                            </div>
                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Información de Contacto</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="telefono"
                                    label="Teléfono"
                                    placeholder="Ej: 3001234567"
                                    iconSrc="/assets/icons/celu.svg"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="correo"
                                    label="Correo Electrónico (Opcional)"
                                    placeholder="auxiliar@ejemplo.com"
                                    iconSrc="/assets/icons/email.svg"
                                />
                            </div>
                        </div>

                        {/* Credenciales de acceso */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Credenciales de Acceso</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="clave"
                                    label="Contraseña"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    iconSrc="/assets/icons/lock.svg"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="confirmarClave"
                                    label="Confirmar Contraseña"
                                    type="password"
                                    placeholder="Confirme la contraseña"
                                    iconSrc="/assets/icons/lock.svg"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={cargando}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={cargando}
                                className="flex-1"
                            >
                                {cargando ? 'Registrando...' : 'Registrar Auxiliar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
} 