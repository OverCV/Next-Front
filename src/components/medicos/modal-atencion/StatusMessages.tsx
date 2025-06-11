"use client"

import { AlertCircle, CheckCircle } from 'lucide-react'

import { Alert, AlertDescription } from '@/src/components/ui/alert'

interface StatusMessagesProps {
    error: string | null
    exito: boolean
}

export function StatusMessages({ error, exito }: StatusMessagesProps) {
    if (!error && !exito) return null

    return (
        <div className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exito && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="size-4" />
                    <AlertDescription>
                        Citación marcada como atendida exitosamente
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
} 