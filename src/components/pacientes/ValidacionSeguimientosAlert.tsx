"use client"

import { AlertCircle, CheckCircle, Loader2, Activity, Heart } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'

interface ValidacionSeguimientosAlertProps {
    validandoSeguimientos: boolean
    usuarioId: number | null
    error?: string | null
}

export function ValidacionSeguimientosAlert({ 
    validandoSeguimientos, 
    usuarioId, 
    error 
}: ValidacionSeguimientosAlertProps) {
    
    // No mostrar nada si no hay usuario
    if (!usuarioId) {
        return null
    }

    // Mostrar error si existe
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error en seguimientos</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    // Mostrar estado de validación
    if (validandoSeguimientos) {
        return (
            <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <AlertTitle className="text-blue-800 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Activando Seguimientos Automáticos
                </AlertTitle>
                <AlertDescription className="text-blue-700">
                    Verificando si tienes citaciones médicas completadas que requieren seguimiento cardiovascular...
                </AlertDescription>
            </Alert>
        )
    }

    // Mostrar confirmación de que el sistema está activo
    return (
        <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Sistema de Seguimientos Activo
            </AlertTitle>
            <AlertDescription className="text-green-700">
                Tu sistema de seguimientos cardiovasculares está funcionando correctamente. 
                Recibirás cuestionarios personalizados según tus necesidades médicas.
            </AlertDescription>
        </Alert>
    )
} 