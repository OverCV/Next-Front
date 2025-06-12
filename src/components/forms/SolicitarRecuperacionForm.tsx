"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Form } from "@/src/components/ui/form"
import { authService } from "@/src/services/auth/auth.service"

import { Alert, AlertDescription } from "../ui/alert"
import { Button } from "../ui/button"

// Esquema de validación para solicitar recuperación
const recuperacionSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es requerido")
        .email("Ingresa un correo electrónico válido")
})

type SolicitarRecuperacionValues = z.infer<typeof recuperacionSchema>

export default function SolicitarRecuperacionForm() {
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<SolicitarRecuperacionValues>({
        resolver: zodResolver(recuperacionSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (datos: SolicitarRecuperacionValues) => {
        try {
            setEnviando(true)
            setError(null)

            await authService.solicitarRecuperacionContraseña(datos.email)

            setEnviado(true)
            console.log('✅ Solicitud de recuperación enviada')

        } catch (err: any) {
            console.error('❌ Error al solicitar recuperación:', err)

            if (err.response?.status === 404) {
                setError("No se encontró una cuenta asociada a este correo electrónico")
            } else {
                setError("Error al enviar la solicitud. Intenta nuevamente.")
            }
        } finally {
            setEnviando(false)
        }
    }

    // Estado de éxito - email enviado
    if (enviado) {
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
                                Correo Enviado
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Hemos enviado un enlace de recuperación a tu correo electrónico.
                            </p>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <div className="flex items-start gap-3">
                                <Mail className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                                        Revisa tu bandeja de entrada
                                    </p>
                                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                        El enlace será válido por 24 horas. Si no ves el correo, revisa tu carpeta de spam.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setEnviado(false)
                                    setError(null)
                                    form.reset()
                                }}
                            >
                                Enviar Otro Correo
                            </Button>

                            <Link
                                href="/acceso"
                                className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Volver al Inicio de Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Formulario para solicitar recuperación
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
                        <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
                    </div>
                </div>

                <p className="my-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
                            name="email"
                            label="Correo Electrónico"
                            placeholder="ejemplo@correo.com"
                            type="email"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="Email"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={enviando}
                        >
                            {enviando ? "Enviando..." : "Enviar Enlace de Recuperación"}
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