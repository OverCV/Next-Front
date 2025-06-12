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
import { entidadSaludService } from "@/src/services/domain/entidad-salud.service"
import MedicoService, { CrearMedicoPayload } from "@/src/services/domain/medico.service"
import { Usuario, UsuarioAccedido } from "@/src/types"

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

export function RegistroMedicoForm() {
    const router = useRouter()
    const { usuario: usuarioAutenticado } = useAuth() as { usuario: UsuarioAccedido | null }
    const { registroUsuario } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [exitoso, setExitoso] = useState<boolean>(false)

    const form = useForm<RegistroMedicoFormValues>({
        resolver: zodResolver(registroMedicoSchema),
        defaultValues: {
            tipoIdentificacion: TiposIdentificacionEnum.CC,
            especialidad: "",
        },
    })

    const onSubmit = async (datos: RegistroMedicoFormValues): Promise<void> => {
        setCargando(true)
        setError(null)

        try {
            if (!usuarioAutenticado?.id) {
                throw new Error('No hay una sesión de entidad activa.')
            }

            const entidad = await entidadSaludService.obtenerEntidadPorUsuarioId(usuarioAutenticado.id);
            if (!entidad.id) {
                throw new Error('No se pudo encontrar la entidad de salud para el usuario actual.');
            }

            const datosUsuario: Usuario = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                correo: datos.correo,
                clave: datos.clave,
                celular: datos.telefono,
                estaActivo: true,
                rolId: ROLES.MEDICO,
            }
            const nuevoUsuario = await registroUsuario(datosUsuario)

            const datosMedico: CrearMedicoPayload = {
                usuarioId: nuevoUsuario.id,
                entidadId: entidad.id,
                especialidad: datos.especialidad,
            }
            await MedicoService.crearMedico(datosMedico)

            setExitoso(true)
            setTimeout(() => router.push('/dashboard/entidad'), 2000)

        } catch (err: any) {
            setError(err.response?.data?.mensaje ?? err.message ?? "Error desconocido al registrar el médico.")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border bg-white p-6 shadow-md">
            <FormHeader />

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {exitoso && (
                <Alert className="mb-6 bg-green-50 text-green-800">
                    <AlertDescription>
                        ✅ Médico registrado exitosamente. Serás redirigido...
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