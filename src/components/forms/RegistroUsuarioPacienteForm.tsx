"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Form } from "@/src/components/ui/form"
import { SelectItem } from "@/src/components/ui/select"
import { ROLES, TIPOS_IDENTIFICACION_USUARIO, TiposIdentificacionEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { notificacionesService } from "@/src/services/notificaciones"
import { usuariosService } from "@/src/services/domain/usuarios.service"
import { Usuario, UsuarioAccedido } from "@/src/types"

// Esquema de validación SOLO para datos de Usuario
const registroUsuarioSchema = z.object({
    tipoIdentificacion: z.nativeEnum(TiposIdentificacionEnum, {
        required_error: "Selecciona un tipo de identificación",
    }),
    identificacion: z.string()
        .min(5, "La identificación debe tener al menos 5 caracteres")
        .max(15, "La identificación no puede exceder 15 caracteres"),
    nombres: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres"),
    apellidos: z.string()
        .min(2, "Los apellidos deben tener al menos 2 caracteres")
        .max(50, "Los apellidos no pueden exceder 50 caracteres"),
    celular: z.string()
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\d+$/, "El teléfono debe contener solo números"),
    correo: z.string()
        .email("Ingresa un correo electrónico válido")
        .optional()
        .or(z.literal('')),
})

type RegistroUsuarioFormValues = z.infer<typeof registroUsuarioSchema>

interface RegistroUsuarioPacienteFormProps {
    onUsuarioCreado?: (usuarioId: number, rolUsuario: number) => void
}

export default function RegistroUsuarioPacienteForm({ onUsuarioCreado }: RegistroUsuarioPacienteFormProps) {
    const { usuario } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [exitoso, setExitoso] = useState<boolean>(false)
    const [usuarioCreado, setUsuarioCreado] = useState<UsuarioAccedido | null>(null)
    const [enviandoSMS, setEnviandoSMS] = useState<boolean>(false)

    const form = useForm<RegistroUsuarioFormValues>({
        resolver: zodResolver(registroUsuarioSchema),
        defaultValues: {
            tipoIdentificacion: TiposIdentificacionEnum.CC,
            identificacion: "",
            nombres: "",
            apellidos: "",
            celular: "",
            correo: "",
        },
    })

    // Función para enviar SMS de bienvenida
    const enviarSMSBienvenida = async (celular: string, nombres: string, identificacion: string): Promise<void> => {
        try {
            setEnviandoSMS(true)
            const mensaje = `¡Hola ${nombres}! 🏥 Tu cuenta en HealInk ha sido creada exitosamente. Usuario: ${identificacion} | Contraseña: ${identificacion} | Ingresa en healink.com para acceder al sistema.`

            await notificacionesService.enviarSMS(celular, mensaje)
            console.log("✅ SMS de bienvenida enviado exitosamente")
        } catch (err) {
            console.error("⚠️ Error al enviar SMS de bienvenida:", err)
            // No mostramos error al usuario por SMS, pero registramos en consola
        } finally {
            setEnviandoSMS(false)
        }
    }

    const onSubmit = async (datos: RegistroUsuarioFormValues): Promise<void> => {
        // Obtener token del usuario actual (embajador)
        const token = usuario?.token || localStorage.getItem('token')

        if (!token) {
            setError("No hay sesión activa. Por favor, inicia sesión nuevamente.")
            return
        }

        setCargando(true)
        setError(null)
        setExitoso(false)

        try {
            console.log("📝 Datos de registro de usuario:", datos)

            // Preparar datos para enviar al endpoint de usuarios
            const datosRegistroUsuario: Usuario = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                correo: datos.correo ?? `${datos.identificacion}@healink.com`,
                // Contraseña por defecto para los pacientes
                clave: datos.identificacion,
                celular: datos.celular,
                estaActivo: true,
                rolId: ROLES.PACIENTE,
            }

            // Usar usuarios.service con token de autenticación
            const respuesta = await usuariosService.crearUsuario(token, datosRegistroUsuario)
            console.log("✅ Usuario registrado exitosamente:", respuesta)

            setUsuarioCreado(respuesta)
            setExitoso(true)

            // Enviar SMS de bienvenida de forma asíncrona
            enviarSMSBienvenida(datos.celular, datos.nombres, datos.identificacion)

            // Notificar al componente padre que el usuario fue creado
            if (onUsuarioCreado && respuesta.id) {
                console.log("🔄 Notificando usuario creado con ID:", respuesta.id)
                onUsuarioCreado(respuesta.id, respuesta.rolId)
            }

        } catch (err: any) {
            console.error("❌ Error al registrar usuario:", err)
            let mensajeError = "Error al registrar el usuario. Por favor, verifica los datos e intenta nuevamente."

            if (err.response?.status === 403) {
                mensajeError = "No tienes permisos para registrar usuarios. Verifica tu sesión."
            } else if (err.response?.status === 400) {
                mensajeError = err.response?.data?.mensaje || "Datos inválidos. Verifica la información ingresada."
            } else if (err.response?.status === 409) {
                mensajeError = "Ya existe un usuario con esa identificación."
            }

            setError(mensajeError)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Registrar Usuario Paciente</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Datos básicos para crear el usuario en el sistema
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    La contraseña inicial será el número de identificación.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exitoso && (
                <Alert className="mb-6">
                    <AlertDescription>
                        Usuario registrado exitosamente. ID: {usuarioCreado?.id}
                        {enviandoSMS && " | Enviando SMS de bienvenida..."}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Identificación */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="tipoIdentificacion"
                            label="Tipo de Identificación"
                            placeholder="Selecciona tipo"
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
                            placeholder="Ej. 1023456789"
                            iconSrc="/assets/icons/id-card.svg"
                            iconAlt="Identificación"
                        />
                    </div>

                    {/* Datos personales */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="nombres"
                            label="Nombres"
                            placeholder="Nombres del paciente"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="Nombres"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="apellidos"
                            label="Apellidos"
                            placeholder="Apellidos del paciente"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="Apellidos"
                        />
                    </div>

                    {/* Contacto */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="celular"
                            label="Teléfono"
                            placeholder="Ej. 3101234567"
                            iconSrc="/assets/icons/celu.svg"
                            iconAlt="Teléfono"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="correo"
                            label="Correo Electrónico (Opcional)"
                            placeholder="correo@ejemplo.com"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="Correo"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                        <Button
                            type="submit"
                            disabled={cargando || exitoso}
                        >
                            {cargando ? "Registrando..." : exitoso ? "Usuario Registrado ✓" : "Registrar Usuario"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}