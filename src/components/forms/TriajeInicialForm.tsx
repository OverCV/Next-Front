"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Form } from "@/src/components/ui/form"
import { useAuth } from "@/src/providers/auth-provider"
import { pacientesService } from "@/src/services/domain/pacientes.service"
import { prediccionesService } from "@/src/services/domain/predicciones.service"

// Esquema de validación para el triaje - ACTUALIZADO según backend
const triajeSchema = z.object({
    // Datos básicos
    edad: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number({
            required_error: "La edad es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(1, "La edad debe ser mayor a 0").max(120, "La edad debe ser menor a 120")
    ),

    // Medidas corporales
    peso: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number({
            required_error: "El peso es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(20, "Valor muy bajo").max(500, "Valor muy alto")
    ),
    estatura: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number({
            required_error: "La estatura es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(50, "Valor muy bajo").max(250, "Valor muy alto")
    ),

    // Factores de riesgo (checkboxes)
    tabaquismo: z.boolean().default(false),
    alcoholismo: z.boolean().default(false),
    diabetes: z.boolean().default(false),
    actividadFisica: z.boolean().default(false),
    hipertension: z.boolean().default(false),

    // Síntomas (checkboxes)
    dolorPecho: z.boolean().default(false),
    dolorIrradiado: z.boolean().default(false),
    sudoracion: z.boolean().default(false),
    nauseas: z.boolean().default(false),
    antecedentesCardiacos: z.boolean().default(false),

    // Campo para observaciones adicionales
    descripcion: z.string().optional(),
})

// Tipo intermedio para el formulario (acepta strings)
type TriajeFormValues = {
    edad: string | number
    peso: string | number
    estatura: string | number
    tabaquismo: boolean
    alcoholismo: boolean
    diabetes: boolean
    actividadFisica: boolean
    hipertension: boolean
    dolorPecho: boolean
    dolorIrradiado: boolean
    sudoracion: boolean
    nauseas: boolean
    antecedentesCardiacos: boolean
    descripcion?: string
}

export default function TriajeInicialForm() {
    const router = useRouter()
    const { usuario, setNecesitaTriajeInicial } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [pacienteId, setPacienteId] = useState<number | null>(null)

    const form = useForm<TriajeFormValues>({
        resolver: zodResolver(triajeSchema),
        defaultValues: {
            edad: "",
            peso: "",
            estatura: "",
            tabaquismo: false,
            alcoholismo: false,
            diabetes: false,
            actividadFisica: false,
            hipertension: false,
            dolorPecho: false,
            dolorIrradiado: false,
            sudoracion: false,
            nauseas: false,
            antecedentesCardiacos: false,
            descripcion: "",
        },
    })

    useEffect(() => {
        const obtenerPaciente = async () => {
            try {
                if (!usuario?.id) {
                    console.warn("⚠️ No hay usuario para obtener paciente")
                    return
                }

                // Obtener los datos del paciente para conocer su ID
                const pacienteResponse = await fetch(`/api/pacientes/paciente?usuarioId=${usuario.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                })
                const pacienteData = await pacienteResponse.json()

                if (!pacienteData.existe || !pacienteData.id) {
                    console.error("❌ No se encontró el paciente")
                    setError("Por favor completa la siguiente información para continuar")
                    return
                }

                console.log("✅ Datos del paciente obtenidos:", pacienteData)
                setPacienteId(pacienteData.id)
            } catch (err) {
                console.error("❌ Error al obtener paciente:", err)
                setError("Error al obtener datos del paciente")
            }
        }

        obtenerPaciente()
    }, [usuario?.id])

    const onSubmit = async (datos: TriajeFormValues) => {
        setFormErrors([])

        if (!pacienteId) {
            setError("No se pudo obtener tu ID de paciente. Por favor, intenta nuevamente.")
            return
        }

        try {
            setCargando(true)
            setError(null)

            // Mapear los datos al formato que espera el backend
            const datosTriaje = {
                pacienteId,
                edad: typeof datos.edad === 'string' ? parseInt(datos.edad) : datos.edad,
                peso: typeof datos.peso === 'string' ? parseFloat(datos.peso) : datos.peso,
                estatura: typeof datos.estatura === 'string' ? parseFloat(datos.estatura) : datos.estatura,
                tabaquismo: datos.tabaquismo,
                alcoholismo: datos.alcoholismo,
                diabetes: datos.diabetes,
                actividadFisica: datos.actividadFisica,
                hipertension: datos.hipertension,
                dolorPecho: datos.dolorPecho,
                dolorIrradiado: datos.dolorIrradiado,
                sudoracion: datos.sudoracion,
                nauseas: datos.nauseas,
                antecedentesCardiacos: datos.antecedentesCardiacos,
                fechaTriaje: new Date().toISOString().split('T')[0],
                descripcion: datos.descripcion || ""
            }

            console.log("📝 Datos del triaje a enviar:", datosTriaje)

            // Crear el triaje usando el servicio
            await pacientesService.crearTriaje(datosTriaje)

            console.log("✅ Triaje creado correctamente")

            // **NUEVO: Actualizar priorización automáticamente después del triaje**
            try {
                console.log("🔄 Actualizando priorización después del triaje...")
                const resultadoPriorizacion = await prediccionesService.actualizarPriorizacionPorTriaje(pacienteId)
                
                if (resultadoPriorizacion) {
                    console.log("✅ Priorización actualizada exitosamente:", resultadoPriorizacion)
                    if (resultadoPriorizacion.campanasActualizadas?.length > 0) {
                        console.log(`📊 Se actualizó la priorización en ${resultadoPriorizacion.campanasActualizadas.length} campaña(s)`)
                    }
                }
            } catch (errorPriorizacion) {
                // No falla el flujo principal si hay error en la priorización
                console.warn("⚠️ No se pudo actualizar la priorización automáticamente:", errorPriorizacion)
            }

            setNecesitaTriajeInicial(false)

            // Redirigir al usuario después de un breve retraso
            setTimeout(() => {
                router.push("/dashboard/paciente")
            }, 500)
        } catch (err: any) {
            console.error("❌ Error al guardar triaje:", err)
            console.error("❌ Respuesta del servidor:", err.response?.data)
            console.error("❌ Status:", err.response?.status)

            const mensajeError = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Error al guardar el triaje. Por favor intenta nuevamente."

            setError(mensajeError)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Formulario de Triaje Inicial</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Estos datos nos ayudarán a evaluar tu estado de salud cardiovascular
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {formErrors.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {formErrors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {!pacienteId && !error ? (
                <div className="flex justify-center py-8">
                    <p>Cargando datos del paciente...</p>
                </div>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        noValidate
                    >
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Datos Básicos</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="edad"
                                    label="Edad"
                                    placeholder="Ingresa tu edad"
                                    type="number"
                                />
                                <div className="sm:col-span-1"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Medidas Corporales</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="peso"
                                    label="Peso (kg)"
                                    placeholder="Ej: 70"
                                    type="number"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="estatura"
                                    label="Estatura (cm)"
                                    placeholder="Ej: 170"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Factores de Riesgo</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="tabaquismo"
                                    label="Tabaquismo"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="alcoholismo"
                                    label="Alcoholismo"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="diabetes"
                                    label="Diabetes"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="actividadFisica"
                                    label="Actividad Física Regular"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="hipertension"
                                    label="Hipertensión"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Síntomas</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="dolorPecho"
                                    label="Dolor en el pecho"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="dolorIrradiado"
                                    label="Dolor irradiado"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="sudoracion"
                                    label="Sudoración excesiva"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="nauseas"
                                    label="Náuseas"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name="antecedentesCardiacos"
                                    label="Antecedentes cardiacos"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Observaciones Adicionales</h3>
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="descripcion"
                                label="Descripción"
                                placeholder="Ingresa cualquier otra información relevante sobre tu salud"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={cargando}
                        >
                            {cargando ? "Guardando..." : "Guardar y Continuar"}
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    )
} 