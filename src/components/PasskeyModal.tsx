// src/components/PasskeyModal.tsx
"use client";

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"

import { Button } from "./ui/button"

export default function PasskeyModal() {
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(searchParams.has("admin"))
    const [error, setError] = useState("")

    const onClose = () => {
        setIsOpen(false)
        setError("")
    }

    // Funciones placeholder para evitar errores (no implementadas)
    const validatePasskey = async () => {
        setError("Funcionalidad de Passkey no implementada")
    }

    const createNewPasskey = async () => {
        setError("Funcionalidad de Passkey no implementada")
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
                            ✕
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Para acceder a la página de administración, por favor, verifique su identidad.
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex size-24 items-center justify-center rounded-lg bg-slate-100 text-4xl">
                            🔐
                        </div>
                        <p className="text-dark-700">
                            Verificación de Passkey requerida para continuar
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="shad-primary-btn w-full"
                        onClick={validatePasskey}
                        disabled
                    >
                        Verificar Passkey (No implementado)
                    </Button>
                    <Button
                        type="button"
                        className="shad-primary-btn w-full"
                        onClick={createNewPasskey}
                        disabled
                    >
                        Crear Nueva Passkey (No implementado)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}