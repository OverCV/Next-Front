"use client"

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import DatosPaciente from '@/src/components/embajador/registrar-paciente/DatosPaciente'
import DatosUsuario from '@/src/components/embajador/registrar-paciente/DatosUsuario'
import InscripcionCampana from '@/src/components/embajador/registrar-paciente/InscripcionCampana'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Form } from '@/src/components/ui/form'
import { FormSkeleton } from '@/src/components/ui/skeletons'
import { useRegistroPacienteEmbajador } from '@/src/lib/hooks/useRegistroPacienteEmbajador'

export default function RegistrarPacientePage() {
    const router = useRouter()

    const {
        // Form
        form,
        onSubmit,

        // Estados de datos
        localizaciones,
        campanasDisponibles,

        // Estados de carga
        cargandoLocalizaciones,
        cargandoCampanas,
        cargando,

        // Estados del proceso
        error,
        exitoso,

        // Constantes
        constantesFormulario
    } = useRegistroPacienteEmbajador()

    // Redireccionar después del éxito
    React.useEffect(() => {
        if (exitoso) {
            const timer = setTimeout(() => {
                router.push('/dashboard/embajador')
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [exitoso, router])

    // Mostrar skeleton mientras cargan los datos iniciales
    if (cargandoLocalizaciones && cargandoCampanas) {
        return (
            <div>
                {/* Header con navegación */}
                <div className="mb-6 flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push('/dashboard/embajador')}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Registrar Nuevo Paciente</h1>
                </div>

                {/* Skeleton del formulario */}
                <FormSkeleton
                    sections={3}
                    fieldsPerSection={4}
                    showHeader={false}
                />
            </div>
        )
    }

    return (
        <div>
            {/* Header con navegación */}
            <div className="mb-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/dashboard/embajador')}
                >
                    <ArrowLeft className="size-4" />
                </Button>
                <h1 className="text-2xl font-bold">Registrar Nuevo Paciente</h1>
            </div>

            {/* Contenedor principal */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
                {/* Mensajes de estado */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {exitoso && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>
                            ¡Paciente registrado exitosamente! Redirigiendo al dashboard...
                        </AlertDescription>
                    </Alert>
                )}

                {/* Formulario principal */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>

                        {/* Sección: Datos del Usuario */}
                        <DatosUsuario
                            control={form.control}
                            constantesFormulario={constantesFormulario}
                        />

                        {/* Separador */}
                        <div className="border-t border-slate-200 dark:border-slate-700" />

                        {/* Sección: Datos del Paciente */}
                        <DatosPaciente
                            control={form.control}
                            constantesFormulario={constantesFormulario}
                            localizaciones={localizaciones}
                            cargandoLocalizaciones={cargandoLocalizaciones}
                        />

                        {/* Separador */}
                        <div className="border-t border-slate-200 dark:border-slate-700" />

                        {/* Sección: Inscripción a Campaña */}
                        <InscripcionCampana
                            control={form.control}
                            campanasDisponibles={campanasDisponibles}
                            cargandoCampanas={cargandoCampanas}
                        />

                        {/* Botón de envío */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={cargando || exitoso}
                        >
                            {cargando ? (
                                "Registrando Paciente..."
                            ) : exitoso ? (
                                "Paciente Registrado ✓"
                            ) : (
                                "Registrar Paciente Completo"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}