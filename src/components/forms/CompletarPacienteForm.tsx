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
import { OPCIONES_GENERO, GeneroBiologicoEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { localizacionesService } from "@/src/services/domain/localizaciones.service"
import { pacientesService } from "@/src/services/domain/pacientes.service"
import { Localizacion } from "@/src/types"
import { checkTokenStatus, runDebugTests } from "@/src/utils/debug"

// Esquema de validación
const completarUsuarioPacienteSchema = z.object({
    // fechaNacimiento: z.date({
    //     required_error: "La fecha de nacimiento es requerida",
    // }),
    genero: z.nativeEnum(GeneroBiologicoEnum, {
        required_error: "Selecciona un género",
    }),
    direccion: z.string()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .max(100, "La dirección no puede exceder 100 caracteres"),
    localizacion_id: z.string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z.number()
                .min(1, "Selecciona una localización")
        ),
})

type CompletarPacienteFormValues = z.infer<typeof completarUsuarioPacienteSchema>

export default function RegistrarPacienteForm() {
    const router = useRouter()
    const { usuario, setNecesitaCompletarPerfil } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([])
    const [formErrors, setFormErrors] = useState<string[]>([])

    const formPaciente = useForm<CompletarPacienteFormValues>({
        resolver: zodResolver(completarUsuarioPacienteSchema),
        defaultValues: {
            // fechaNacimiento: undefined,
            genero: undefined,
            direccion: "",
            localizacion_id: undefined,
        },
    })

    useEffect(() => {
        const verificarToken = () => {
            // Verificar si hay token disponible
            const tokenStatus = checkTokenStatus();

            if (!tokenStatus) {
                console.warn("⚠️ No se encontró token en verificarToken");
                setError("No hay sesión activa. Por favor, inicia sesión nuevamente.");
                return false;
            }

            return true;
        }

        const cargarLocalizaciones = async () => {
            const token = usuario?.token || localStorage.getItem('token') || document.cookie.match(/token=([^;]+)/)?.[1] || "";

            if (!token) {
                console.warn("⚠️ No hay token disponible en usuario ni en almacenamiento")

                // Intentar verificar si hay token en otro lugar
                if (!verificarToken()) {
                    // Ejecutar pruebas de depuración para intentar identificar el problema
                    runDebugTests()
                    return;
                }
            } else {
                console.log("✅ Token encontrado:", token.substring(0, 15) + "...");
            }

            try {
                const data = await localizacionesService.obtenerLocalizaciones(token)
                setLocalizaciones(data)
            } catch (err: any) {
                console.error("❌ Error al cargar localizaciones:", err)
                setError("Error al cargar las localizaciones")
            }
        }

        // Ejecutar la carga de localizaciones con un pequeño retraso
        // para asegurar que el token esté disponible
        const timer = setTimeout(() => {
            cargarLocalizaciones()
        }, 500)

        return () => clearTimeout(timer)
    }, [usuario?.token])

    const onSubmit = async (datos: CompletarPacienteFormValues) => {
        setFormErrors([])

        // Obtener token de cualquier lugar disponible
        const token = usuario?.token || localStorage.getItem('token') || document.cookie.match(/token=([^;]+)/)?.[1] || "";

        if (!token) {
            setError("No hay sesión activa. Por favor, inicia sesión nuevamente.")
            return
        }

        if (!formPaciente.formState.isValid) {
            const errors = Object.entries(formPaciente.formState.errors).map(([field, error]) => {
                return `${error.message}`
            })
            setFormErrors(errors)
            return
        }

        try {
            setCargando(true)
            setError(null)

            console.log("📝 Datos del formulario:", {
                ...datos,
                usuarioId: usuario?.id
            })

            if (!usuario?.id) {
                setError("No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.")
                return
            }

            // Crear el perfil del paciente usando el servicio
            const response = await pacientesService.crearPerfil(
                token,
                {
                    ...datos,
                    usuarioId: usuario.id
                }
            )

            console.log("✅ Perfil creado:", response)
            setNecesitaCompletarPerfil(false)

            // Redirigir al usuario después de un breve retraso para asegurar que los cambios se han aplicado
            setTimeout(() => {
                router.push("/dashboard/paciente/triaje-inicial")
            }, 500)

        } catch (err: any) {
            console.error("❌ Error al guardar perfil:", err)
            setError(err.response?.data?.message || "Error al guardar el perfil. Por favor intenta nuevamente.")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Datos específicos del Paciente</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Datos adicionales para el paciente
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

            <Form {...formPaciente}>
                <form
                    onSubmit={formPaciente.handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                >
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={formPaciente.control}
                        name="fechaNacimiento"
                        label="Fecha de Nacimiento"
                        placeholder="Seleccione fecha"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={formPaciente.control}
                        name="genero"
                        label="Género Biologico"
                        placeholder="Selecciona género"
                    >
                        {OPCIONES_GENERO.map((opcion) => (
                            <SelectItem key={opcion.valor} value={opcion.valor}>
                                {opcion.etiqueta}
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={formPaciente.control}
                        name="direccion"
                        label="Dirección"
                        placeholder="Ingresa tu dirección completa"
                        iconSrc="/assets/icons/map-pin.svg"
                        iconAlt="Dirección"
                    />

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
                        disabled={cargando}
                    >
                        {cargando ? "Guardando..." : "Guardar y Continuar"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}