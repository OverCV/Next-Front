// src/components/PasskeyModal.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"
import { useAuth } from "@/src/providers/auth-provider"
import {
    getPasskey,
    createPasskey,
} from "@/src/services/auth/passkey.service"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"

export default function PasskeyModal() {
    const { usuario } = useAuth()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(searchParams.has("admin"))
    const [error, setError] = useState("")

    const createNewPasskey = async () => {
        if (usuario) {
            try {
                const newKey = await createPasskey(usuario.id)
                console.log("Nueva passkey creada:", newKey)
            } catch (err: any) {
                setError(err.message)
            }
        }
    }

    const validatePasskey = async () => {
        try {
            const key = await getPasskey()
            console.log("Passkey obtenida:", key)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const onClose = () => {
        setIsOpen(false)
        setError("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        Acceso de administrador verificado
                        <Button
                            type="button"
                            className="text-dark-400"
                            onClick={onClose}
                        >
                            <Image
                                src="/assets/icons/close.svg"
                                height={20}
                                width={20}
                                alt="close"
                            />
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Para acceder a la página de administración, por favor, verifique su identidad.
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-2">
                        <Image
                            src="/assets/icons/hand.png"
                            height={96}
                            width={96}
                            alt="hand"
                            className="rounded-lg"
                        />
                        <p className="text-dark-700">
                            Verificación de Passkey requerida para continuar
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="shad-primary-btn w-full"
                        onClick={validatePasskey}
                    >
                        Verificar Passkey
                    </Button>
                    <Button
                        type="button"
                        className="shad-primary-btn w-full"
                        onClick={createNewPasskey}
                    >
                        Crear Nueva Passkey
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}