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
import { SelectItem } from "@/src/components/ui/select"
import { OPCIONES_GENERO, TIPOS_SANGRE, GeneroBiologicoEnum, TipoSangreEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { localizacionesService } from "@/src/services/domain/localizaciones.service"
import { pacientesService } from "@/src/services/domain/pacientes.service"
import { Localizacion } from "@/src/types"

// Esquema de validación para datos del PACIENTE
const registrarPacienteSchema = z.object({
    fechaNacimiento: z.date({
        required_error: "La fecha de nacimiento es requerida",
    }),
    genero: z.nativeEnum(GeneroBiologicoEnum, {
        required_error: "Selecciona un género",
    }),
    direccion: z.string()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .max(100, "La dirección no puede exceder 100 caracteres"),
    tipoSangre: z.nativeEnum(TipoSangreEnum, {
        required_error: "Selecciona un tipo de sangre",
    }),
    localizacion_id: z.string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z.number()
                .min(1, "Selecciona una localización")
        ),
})

type RegistrarPacienteFormValues = z.infer<typeof registrarPacienteSchema>

interface RegistrarPacienteFormProps {
    usuarioId?: number
    onPacienteCreado?: () => void
    mostrarTitulo?: boolean
}

export default function RegistrarPacienteForm({
    usuarioId,
    onPacienteCreado,
    mostrarTitulo = true
}: RegistrarPacienteFormProps
) {
    const router = useRouter()
    const { usuario, setNecesitaCompletarPerfil } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([])
    const [exitoso, setExitoso] = useState<boolean>(false)

    // Usar el usuarioId de props o del usuario autenticado
    const idUsuario = usuarioId || usuario?.id

    const formPaciente = useForm<RegistrarPacienteFormValues>({
        resolver: zodResolver(registrarPacienteSchema),
        defaultValues: {
            fechaNacimiento: undefined,
            genero: undefined,
            direccion: "",
            tipoSangre: undefined,
            localizacion_id: undefined,
        },
    })

    useEffect(() => {
        const cargarLocalizaciones = async () => {
            // Simplificar: usar token de cualquier lugar disponible
            const token = usuario?.token || localStorage.getItem('token') || ""

            if (!token) {
                console.warn("⚠️ No hay token disponible, cargando datos sin autenticación...")
                // Intentar cargar localizaciones sin token (para desarrollo)
                try {
                    const response = await fetch('/api/localizaciones')
                    if (response.ok) {
                        const data = await response.json()
                        setLocalizaciones(data)
                        return
                    }
                } catch (err) {
                    console.warn("No se pudieron cargar localizaciones sin token")
                }
                setError("No se pudieron cargar las localizaciones. Continúa sin seleccionar.")
                return
            }

            try {
                console.log("🔍 Cargando localizaciones con token...")
                const data = await localizacionesService.obtenerLocalizaciones(token)
                setLocalizaciones(data)
                console.log("✅ Localizaciones cargadas:", data.length)
            } catch (err: any) {
                console.error("❌ Error al cargar localizaciones:", err)
                setError("Error al cargar las localizaciones. Puedes continuar sin seleccionar.")
            }
        }

        cargarLocalizaciones()
    }, [usuario?.token])

    const onSubmit = async (datos: RegistrarPacienteFormValues) => {
        // Obtener token de cualquier lugar disponible
        const token = usuario?.token || localStorage.getItem('token') || ""

        if (!token) {
            setError("No hay sesión activa. Por favor, inicia sesión nuevamente.")
            return
        }

        if (!idUsuario) {
            setError("No se pudo obtener el ID del usuario.")
            return
        }

        try {
            setCargando(true)
            setError(null)

            console.log("📝 Datos del formulario de paciente:", {
                ...datos,
                usuarioId: idUsuario
            })

            // Preparar datos para el endpoint de paciente (usando los tipos correctos)
            const datosPaciente = {
                fechaNacimiento: datos.fechaNacimiento, // El servicio espera Date
                genero: datos.genero,
                direccion: datos.direccion,
                tipoSangre: datos.tipoSangre,
                localizacion_id: datos.localizacion_id, // El servicio espera localizacion_id
                usuarioId: idUsuario
            }

            // Crear el perfil del paciente usando el servicio
            const response = await pacientesService.crearPerfil(token, datosPaciente)

            console.log("✅ Paciente creado:", response)
            setExitoso(true)

            if (setNecesitaCompletarPerfil) {
                setNecesitaCompletarPerfil(false)
            }

            // Notificar al componente padre
            if (onPacienteCreado) {
                onPacienteCreado()
            } else {
                // Si no hay callback, redirigir por defecto
                setTimeout(() => {
                    router.push("/dashboard/paciente/triaje-inicial")
                }, 1500)
            }

        } catch (err: any) {
            console.error("❌ Error al crear paciente:", err)
            setError(err.response?.data?.message || "Error al crear el paciente. Por favor intenta nuevamente.")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            {mostrarTitulo && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Paso 2: Datos del Paciente</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Información específica del paciente para completar el perfil
                    </p>
                </div>
            )}

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exitoso && (
                <Alert className="mb-6">
                    <AlertDescription>
                        Paciente registrado exitosamente en el sistema.
                    </AlertDescription>
                </Alert>
            )}

            <Form {...formPaciente}>
                <form
                    onSubmit={formPaciente.handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                >
                    {/* Fecha de nacimiento */}
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={formPaciente.control}
                        name="fechaNacimiento"
                        label="Fecha de Nacimiento"
                        placeholder="Seleccione fecha"
                    />

                    {/* Género y Tipo de Sangre */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={formPaciente.control}
                            name="genero"
                            label="Género Biológico"
                            placeholder="Selecciona género"
                        >
                            {OPCIONES_GENERO.map((opcion) => (
                                <SelectItem key={opcion.valor} value={opcion.valor}>
                                    {opcion.etiqueta}
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={formPaciente.control}
                            name="tipoSangre"
                            label="Tipo de Sangre"
                            placeholder="Selecciona tipo de sangre"
                        >
                            {TIPOS_SANGRE.map((tipo) => (
                                <SelectItem key={tipo.valor} value={tipo.valor}>
                                    {tipo.etiqueta}
                                </SelectItem>
                            ))}
                        </CustomFormField>
                    </div>

                    {/* Dirección */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={formPaciente.control}
                        name="direccion"
                        label="Dirección"
                        placeholder="Ingresa tu dirección completa"
                        iconSrc="/assets/icons/map-pin.svg"
                        iconAlt="Dirección"
                    />

                    {/* Localización */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={formPaciente.control}
                        name="localizacion_id"
                        label="Localización"
                        placeholder="Selecciona tu localización"
                    >
                        {localizaciones.map((loc) => (
                            <SelectItem
                                key={loc.id}
                                value={loc.id.toString()}>
                                {`${loc.municipio}, ${loc.vereda || loc.localidad || 'Centro'} - ${loc.departamento}`}
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={cargando || exitoso}
                    >
                        {cargando ? "Guardando..." : exitoso ? "Paciente Registrado ✓" : "Registrar Paciente"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}