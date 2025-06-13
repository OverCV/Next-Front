"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Form } from "@/src/components/ui/form"
import { SelectItem } from "@/src/components/ui/select"
import { ROLES, TIPOS_IDENTIFICACION, TiposIdentificacionEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import EmbajadorService from "@/src/services/domain/embajador.service"
import { localizacionesService } from "@/src/services/domain/localizaciones.service"
import { notificacionesService } from "@/src/services/notificaciones"
import { Embajador, Localizacion, Usuario, UsuarioAccedido } from "@/src/types"

// Esquema de validación
const registroEmbajadorSchema = z.object({
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
    telefono: z.string()
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\d+$/, "El teléfono debe contener solo números"),
    correo: z.string()
        .email("Ingresa un correo electrónico válido"),
    clave: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarClave: z.string()
        .min(6, "La confirmación de contraseña es requerida"),
    localidad: z.string()
        .min(2, "La localidad debe tener al menos 2 caracteres")
        .max(100, "La localidad no puede exceder 100 caracteres"),
}).refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
})

type RegistroEmbajadorFormValues = z.infer<typeof registroEmbajadorSchema>

export default function RegistroEmbajadorForm() {
    const router = useRouter()
    const { usuario } = useAuth() as { usuario: UsuarioAccedido | null }
    const { registroUsuario } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [exitoso, setExitoso] = useState<boolean>(false)
    const [enviandoSMS, setEnviandoSMS] = useState<boolean>(false)
    const [localidades, setLocalidades] = useState<Localizacion[]>([])

    const form = useForm<RegistroEmbajadorFormValues>({
        resolver: zodResolver(registroEmbajadorSchema),
        defaultValues: {
            tipoIdentificacion: TiposIdentificacionEnum.CC,
            identificacion: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            correo: "",
            clave: "",
            confirmarClave: "",
            localidad: "",
        },
    })

    useEffect(() => {
        const cargarLocalidades = async () => {
            try {
                const data = await localizacionesService.obtenerLocalizaciones()
                setLocalidades(data)
            } catch (err) {
                console.error("Error al cargar localidades:", err)
            }
        }

        cargarLocalidades()
    }, [])

    // Función para enviar SMS de bienvenida
    const enviarSMSBienvenida = async (telefono: string, nombres: string, identificacion: string): Promise<void> => {
        try {
            setEnviandoSMS(true)
            const mensaje = `¡Hola ${nombres}! 🏥 Bienvenido como embajador de HealInk. Tu cuenta ha sido creada. Usuario: ${identificacion} | Accede con tu contraseña en healink.com para empezar a ayudar a tu comunidad.`

            await notificacionesService.enviarSMS(telefono, mensaje)
            console.log("✅ SMS de bienvenida embajador enviado exitosamente")
        } catch (err) {
            console.error("⚠️ Error al enviar SMS de bienvenida embajador:", err)
        } finally {
            setEnviandoSMS(false)
        }
    }

    const onSubmit = async (datos: RegistroEmbajadorFormValues): Promise<void> => {
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
                correo: datos.correo,
                clave: datos.clave,
                celular: datos.telefono,
                estado: "ACTIVO",
                rolId: ROLES.EMBAJADOR,
            }

            // Llamar al mismo endpoint de registro que usamos para las entidades y pacientes
            const respuesta = await registroUsuario(datosRegistro)

            const datosEmbajador: Embajador = {
                usuarioId: respuesta.id,
                nombreCompleto: `${datos.nombres} ${datos.apellidos}`,
                telefono: datos.telefono,
                localidad: datos.localidad,
                identificacion: "",
                correo: "",
            }

            const respuestaEmbajador = await EmbajadorService.crearEmbajador(datosEmbajador)

            if (!respuestaEmbajador) {
                setError("Error al registrar el embajador. Por favor, verifica los datos e intenta nuevamente.")
                setCargando(false)
                return
            }

            setExitoso(true)

            // Enviar SMS de bienvenida de forma asíncrona
            enviarSMSBienvenida(datos.telefono, datos.nombres, datos.identificacion)

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push('/dashboard/entidad')
            }, 2000)

        } catch (err: any) {
            console.error("Error al registrar embajador:", err)
            setError(
                err.response?.data?.mensaje ??
                "Error al registrar el embajador. Por favor, verifica los datos e intenta nuevamente."
            )
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Formulario de Registro de Embajador</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Complete los datos del embajador para registrarlo en el sistema
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exitoso && (
                <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                    <AlertDescription>
                        Embajador registrado exitosamente. Serás redirigido al listado...
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
                            {TIPOS_IDENTIFICACION.filter(tipo => tipo.valor !== "NIT").map((tipo) => (
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
                            placeholder="Ej. Juan Carlos"
                            iconSrc="/assets/icons/user.svg"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="apellidos"
                            label="Apellidos"
                            placeholder="Ej. Pérez González"
                            iconSrc="/assets/icons/user.svg"
                        />
                    </div>

                    {/* Información de contacto */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="telefono"
                            label="Teléfono"
                            placeholder="Ej. 3001234567"
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

                    {/* Localidad */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="localidad"
                        label="Localidad Asignada"
                        placeholder="Selecciona una localidad"
                    >
                        {localidades.map((localidad) => (
                            <SelectItem key={localidad.id} value={localidad.departamento + ", " + localidad.municipio + ", " + localidad.localidad}>
                                {localidad.departamento + ", " + localidad.municipio + ", " + localidad.localidad}
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    {/* Seguridad */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="clave"
                            label="Contraseña"
                            placeholder="••••••••"
                            type="password"
                            iconSrc="/assets/icons/lock.svg"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="confirmarClave"
                            label="Confirmar Contraseña"
                            placeholder="••••••••"
                            type="password"
                            iconSrc="/assets/icons/lock.svg"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                        <Button
                            type="submit"
                            disabled={cargando || exitoso}
                        >
                            {cargando ? "Registrando..." : exitoso ? "Embajador Registrado ✓" : "Registrar Embajador"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}