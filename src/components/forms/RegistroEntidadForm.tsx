// src/components/forms/RegistroEntidadForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Form } from "@/src/components/ui/form"
import { ROLES, TiposIdentificacionEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { entidadSaludService } from "@/src/services/EntidadSaludService"
import { EntidadSalud, Usuario } from "@/src/types"

// Esquema de validación
const registroEntidadSchema = z.object({
    identificacion: z.string()
        .min(9, "El NIT debe tener al menos 9 dígitos")
        .max(14, "El NIT no puede exceder los 14 dígitos")
        .regex(/^\d{9,14}(-\d)?$/, "Formato de NIT inválido (ej: 901234567-8)"),
    razonSocial: z.string()
        .min(3, "La razón social debe tener al menos 3 caracteres")
        .max(100, "La razón social no puede exceder 100 caracteres"),
    direccion: z.string()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .max(100, "La dirección no puede exceder 100 caracteres"),
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
}).refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
})

type RegistroEntidadFormValues = z.infer<typeof registroEntidadSchema>

export default function RegistroEntidadForm(): JSX.Element {
    const router = useRouter()
    const { registroUsuario } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [exitoso, setExitoso] = useState<boolean>(false)

    const form = useForm<RegistroEntidadFormValues>({
        resolver: zodResolver(registroEntidadSchema),
        defaultValues: {
            identificacion: "",
            razonSocial: "",
            direccion: "",
            telefono: "",
            correo: "",
            clave: "",
            confirmarClave: "",
        },
    })

    const onSubmit = async (datos: RegistroEntidadFormValues): Promise<void> => {
        setCargando(true)
        setError(null)
        setExitoso(false)

        try {
            // Preparar datos para enviar
            

            // Llamar a la API para registrar
            

            const datosEntidad: EntidadSalud = {
                id: 0,
                //usuarioId: respuesta.id,
                razonSocial: datos.razonSocial,
                direccion: datos.direccion,
                telefono: datos.telefono,
                correo: datos.correo,
            };

            const respuestaEntidad = await entidadSaludService.crearEntidadSalud(datosEntidad);
            console.log("Registro entidad exitoso:", respuestaEntidad);

            const datosRegistro: Usuario = {
                tipoIdentificacion: TiposIdentificacionEnum.NIT,  // Fijo para entidades de salud
                identificacion: datos.identificacion,
                nombres: datos.razonSocial, // Usamos razonSocial como nombres
                apellidos: "-", // Campo requerido por la API, pero no aplicable para entidades
                correo: datos.correo,
                clave: datos.clave,
                celular: datos.telefono,
                estaActivo: true,
                rolId: ROLES.ENTIDAD_SALUD,
                entidadSaludId: respuestaEntidad.id,
                entidadSalud: null
            };

            const respuesta = await registroUsuario(datosRegistro);
            console.log("Registro exitoso:", respuesta);

            // Marcar como exitoso
            setExitoso(true)

            // Esperar 2 segundos antes de redirigir al dashboard de administración
            setTimeout(() => {
                router.push("/admin")
            }, 2000)

        } catch (err: any) {
            console.error("Error al registrar entidad:", err)
            setError(
                err.response?.data?.mensaje ||
                "Error al registrar la entidad. Por favor, verifica los datos e intenta nuevamente."
            )
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-6 flex flex-col items-center space-y-2">
                    <h1 className="text-2xl font-bold">Registro de Entidad de Salud</h1>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Complete el formulario para registrar su entidad de salud en el sistema
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
                            Registro exitoso. Serás redirigido a la página de inicio de sesión...
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="identificacion"
                                label="NIT"
                                placeholder="901234567-8"
                                iconSrc="/assets/icons/id-card.svg"
                                iconAlt="NIT"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="razonSocial"
                                label="Razón Social"
                                placeholder="Nombre de la entidad"
                                iconSrc="/assets/icons/building.svg"
                                iconAlt="Entidad"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="direccion"
                                label="Dirección"
                                placeholder="Dirección de la entidad"
                                iconSrc="/assets/icons/map-pin.svg"
                                iconAlt="Dirección"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="telefono"
                                label="Teléfono"
                                placeholder="Teléfono de contacto"
                                iconSrc="/assets/icons/celu.svg"
                                iconAlt="Teléfono"
                            />
                        </div>

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="correo"
                            label="Correo Electrónico"
                            placeholder="entidad@correo.com"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="Correo"
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="clave"
                                label="Contraseña"
                                placeholder="••••••••"
                                type="password"
                                iconSrc="/assets/icons/lock.svg"
                                iconAlt="Contraseña"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="confirmarClave"
                                label="Confirmar Contraseña"
                                placeholder="••••••••"
                                type="password"
                                iconSrc="/assets/icons/lock.svg"
                                iconAlt="Confirmar Contraseña"
                            />
                        </div>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/acceso")}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                className="w-full sm:w-auto"
                                disabled={cargando}
                            >
                                {cargando ? "Registrando..." : "Registrar Entidad"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}