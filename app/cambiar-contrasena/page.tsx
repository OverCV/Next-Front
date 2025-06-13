"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import CambiarContrasenaForm from "@/src/components/forms/CambiarContrasenaForm"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CambiarContraseñaPage(): JSX.Element {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const tokenParam = searchParams.get('token')

        if (!tokenParam) {
            setError("Token de recuperación no válido. Solicita un nuevo enlace de recuperación.")
        } else {
            setToken(tokenParam)
        }
    }, [searchParams])

    // Si no hay token, mostrar error
    if (error) {
        return (
            <div className="flex h-screen max-h-screen">
                <section className="remove-scrollbar container relative my-auto">
                    <div className="sub-container">
                        <Image
                            src="/assets/brand/logo-white.ico"
                            height={180}
                            width={180}
                            alt="Logo"
                            className="mb-6 h-10 w-fit"
                        />

                        <div className="flex flex-col items-center justify-center p-4 md:p-8">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="size-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>

                                <div className="text-center">
                                    <button
                                        onClick={() => router.push('/recuperar-contrasena')}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Solicitar Nuevo Enlace
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Image
                    src="/assets/images/onboarding-img.png"
                    height={1000}
                    width={1000}
                    alt="Campaña de Salud"
                    className="side-img max-w-[50%]"
                    priority={true}
                />
            </div>
        )
    }

    // Si hay token, mostrar formulario
    if (!token) {
        return (
            <div className="flex h-screen max-h-screen items-center justify-center">
                <div className="animate-pulse text-slate-500">
                    Cargando...
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container relative my-auto">
                <div className="sub-container">
                    <Image
                        src="/assets/brand/logo-white.ico"
                        height={180}
                        width={180}
                        alt="Logo"
                        className="mb-6 h-10 w-fit"
                    />

                    <CambiarContrasenaForm token={token} />
                </div>
            </section>

            <Image
                src="/assets/images/onboarding-img.png"
                height={1000}
                width={1000}
                alt="Campaña de Salud"
                className="side-img max-w-[50%]"
                priority={true}
            />
        </div>
    )
} 