"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Form } from "@/src/components/ui/form"
import { ROLES, TiposIdentificacionEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import entidadSaludService from "@/src/services/domain/entidad-salud.service"
import MedicoService from "@/src/services/domain/medico.service"
import { usuariosService } from "@/src/services/domain/usuarios.service"
import { notificacionesService } from "@/src/services/notificaciones"
import { Medico, Usuario } from "@/src/types"

import { ContactoFields } from "./registro-medico/ContactoFields"
import { DatosPersonalesFields } from "./registro-medico/DatosPersonalesFields"
import { EspecialidadFields } from "./registro-medico/EspecialidadFields"
import { FormActions } from "./registro-medico/FormActions"
import { FormHeader } from "./registro-medico/FormHeader"
import { IdentificacionFields } from "./registro-medico/IdentificacionFields"
import { SeguridadFields } from "./registro-medico/SeguridadFields"


// Esquema de validación con Zod
const registroMedicoSchema = z.object({
    tipoIdentificacion: z.nativeEnum(TiposIdentificacionEnum),
    identificacion: z.string().min(5, "Mínimo 5 caracteres"),
    nombres: z.string().min(2, "Mínimo 2 caracteres"),
    apellidos: z.string().min(2, "Mínimo 2 caracteres"),
    telefono: z.string().min(7, "Mínimo 7 dígitos"),
    correo: z.string().email("Correo inválido"),
    clave: z.string().min(6, "Mínimo 6 caracteres"),
    confirmarClave: z.string(),
    especialidad: z.string().min(1, "Selecciona una especialidad"),
    numeroLicencia: z.string().optional(),
}).refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
})

type RegistroMedicoFormValues = z.infer<typeof registroMedicoSchema>

export default function RegistroMedicoForm() {
    const router = useRouter()
    const { usuario } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [exitoso, setExitoso] = useState<boolean>(false)
    const [enviandoSMS, setEnviandoSMS] = useState<boolean>(false)

    const form = useForm<RegistroMedicoFormValues>({
        resolver: zodResolver(registroMedicoSchema),
        defaultValues: {
            tipoIdentificacion: TiposIdentificacionEnum.CC,
            identificacion: "",
            nombres: "",
            apellidos: "",
            especialidad: "",
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
            const mensaje = `¡Hola Dr(a). ${nombres}! 🏥 Su cuenta médica en HealInk ha sido creada exitosamente. Usuario: ${identificacion} | Acceda con su contraseña en healink.com para comenzar a atender pacientes.`

            await notificacionesService.enviarSMS(telefono, mensaje)
            console.log("✅ SMS de bienvenida médico enviado exitosamente")
        } catch (err) {
            console.error("⚠️ Error al enviar SMS de bienvenida médico:", err)
        } finally {
            setEnviandoSMS(false)
        }
    }

    const onSubmit = async (datos: RegistroMedicoFormValues): Promise<void> => {
        const token = usuario?.token || localStorage.getItem('token')

        if (!usuario?.id) {
            setError("No hay sesión activa. Por favor, inicia sesión nuevamente.")
            return
        }

        const entidad = await entidadSaludService.obtenerEntidadPorUsuarioId(usuario.id)
        const entidadId = entidad?.id

        setCargando(true)
        setError(null)
        setExitoso(false)

        try {
            console.log("📝 Registrando médico:", datos)

            // 1. Crear usuario
            const datosUsuario: Usuario = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                correo: datos.correo,
                clave: datos.clave,
                celular: datos.telefono,
                estado: "ACTIVO",
                rolId: ROLES.MEDICO,
            }

            const respuestaUsuario = await usuariosService.crearUsuario(token, datosUsuario)
            console.log("✅ Usuario médico creado:", respuestaUsuario)

            // 2. Crear médico vinculado
            const datosMedico: Medico = {
                usuarioId: respuestaUsuario.id,
                especialidad: datos.especialidad,
                entidadId: entidadId || 0,
            }

            await MedicoService.crearMedico(datosMedico)
            console.log("✅ Médico registrado exitosamente")

            setExitoso(true)

            // Enviar SMS de bienvenida de forma asíncrona
            enviarSMSBienvenida(datos.telefono, datos.nombres, datos.identificacion)

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push('/dashboard/entidad')
            }, 2000)

        } catch (err: any) {
            console.error("❌ Error al registrar médico:", err)
            let mensajeError = "Error al registrar el médico. Por favor, verifica los datos e intenta nuevamente."

            if (err.response?.status === 403) {
                mensajeError = "No tienes permisos para registrar médicos. Verifica tu sesión."
            } else if (err.response?.status === 400) {
                mensajeError = err.response?.data?.mensaje || "Datos inválidos. Verifica la información ingresada."
            } else if (err.response?.status === 409) {
                mensajeError = "Ya existe un médico con esa identificación."
            }

            setError(mensajeError)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <FormHeader />

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exitoso && (
                <Alert className="mb-6">
                    <AlertDescription>
                        Médico registrado exitosamente. Serás redirigido al dashboard...
                        {enviandoSMS && " | Enviando SMS de bienvenida..."}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <IdentificacionFields control={form.control} />
                    <DatosPersonalesFields control={form.control} />
                    <EspecialidadFields control={form.control} />
                    <ContactoFields control={form.control} />
                    <SeguridadFields control={form.control} />
                    <FormActions cargando={cargando} />
                </form>
            </Form>
        </div>
    )
} 