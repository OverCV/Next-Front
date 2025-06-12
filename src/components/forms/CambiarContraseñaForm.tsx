"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Form } from "@/src/components/ui/form"
import { authService } from "@/src/services/auth/auth.service"

import { Alert, AlertDescription } from "../ui/alert"
import { Button } from "../ui/button"

// Esquema de validación para cambiar contraseña
const cambiarContraseñaSchema = z.object({
    nuevaContraseña: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
        .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmarContraseña: z.string()
}).refine((data) => data.nuevaContraseña === data.confirmarContraseña, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContraseña"]
})

type CambiarContraseñaValues = z.infer<typeof cambiarContraseñaSchema>

interface CambiarContraseñaFormProps {
    token: string
}

export default function CambiarContraseñaForm({ token }: CambiarContraseñaFormProps) {
    const router = useRouter()
    const [cambiando, setCambiando] = useState(false)
    const [cambiado, setCambiado] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mostrarContraseña, setMostrarContraseña] = useState(false)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)

    const form = useForm<CambiarContraseñaValues>({
        resolver: zodResolver(cambiarContraseñaSchema),
        defaultValues: {
            nuevaContraseña: "",
            confirmarContraseña: ""
        }
    })

    const onSubmit = async (datos: CambiarContraseñaValues) => {
        try {
            setCambiando(true)
            setError(null)

            await authService.cambiarContraseñaConToken({
                token,
                nuevaContraseña: datos.nuevaContraseña
            })

            setCambiado(true)
            console.log('✅ Contraseña cambiada exitosamente')

            // Redireccionar al login después de 3 segundos
            setTimeout(() => {
                router.push('/acceso?mensaje=contraseña-actualizada')
            }, 3000)

        } catch (err: any) {
            console.error('❌ Error al cambiar contraseña:', err)

            if (err.response?.status === 400) {
                setError("El enlace de recuperación ha expirado o no es válido")
            } else if (err.response?.status === 404) {
                setError("El enlace de recuperación no es válido")
            } else {
                setError("Error al cambiar la contraseña. Intenta nuevamente.")
            }
        } finally {
            setCambiando(false)
        }
    }

    // Estado de éxito - contraseña cambiada
    if (cambiado) {
        return (
            <div className="flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                                <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                ¡Contraseña Actualizada!
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Tu contraseña ha sido cambiada exitosamente.
                            </p>
                        </div>

                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                            <div className="flex items-start gap-3">
                                <Lock className="size-5 text-green-600 dark:text-green-400 mt-0.5" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                                        Tu cuenta está segura
                                    </p>
                                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                        Serás redirigido al inicio de sesión en unos segundos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={() => router.push('/acceso')}
                        >
                            Ir al Inicio de Sesión
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Formulario para cambiar contraseña
    return (
        <div className="flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="items-center space-y-2 text-center">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/assets/images/logo.png"
                            width={100}
                            height={100}
                            alt="Logo"
                            className="mr-4 h-auto w-16"
                        />
                        <h1 className="text-2xl font-bold">Nueva Contraseña</h1>
                    </div>
                </div>

                <p className="my-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Ingresa tu nueva contraseña. Debe ser segura y fácil de recordar.
                </p>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        noValidate
                    >
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="nuevaContraseña"
                            label="Nueva Contraseña"
                            placeholder="••••••••"
                            type="password"
                            iconSrc="/assets/icons/lock.svg"
                            iconAlt="Contraseña"
                            showPassword={mostrarContraseña}
                            onTogglePassword={() => setMostrarContraseña(!mostrarContraseña)}
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="confirmarContraseña"
                            label="Confirmar Nueva Contraseña"
                            placeholder="••••••••"
                            type="password"
                            iconSrc="/assets/icons/lock.svg"
                            iconAlt="Confirmar Contraseña"
                            showPassword={mostrarConfirmacion}
                            onTogglePassword={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                        />

                        {/* Indicadores de seguridad */}
                        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                                La contraseña debe contener:
                            </p>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Al menos 8 caracteres</li>
                                <li>• Una letra minúscula</li>
                                <li>• Una letra mayúscula</li>
                                <li>• Un número</li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={cambiando}
                        >
                            {cambiando ? "Cambiando..." : "Cambiar Contraseña"}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/acceso"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                ← Volver al Inicio de Sesión
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
} 