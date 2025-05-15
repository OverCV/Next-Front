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
import apiClient from "@/src/services/api"
import { localizacionesService } from "@/src/services/domain/localizaciones.service"
import { Localizacion } from "@/src/types"

// Esquema de validación
const completarPerfilSchema = z.object({
    fechaNacimiento: z.date({
        required_error: "La fecha de nacimiento es requerida",
    }),
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

type CompletarPerfilFormValues = z.infer<typeof completarPerfilSchema>

export default function CompletarPerfilForm() {
    const router = useRouter()
    const { usuario, setNecesitaCompletarPerfil } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState<boolean>(false)
    const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([])

    useEffect(() => {
        const cargarLocalizaciones = async () => {
            console.log("🔍 Estado del usuario:", {
                id: usuario?.id,
                token: usuario?.token ? `${usuario.token.substring(0, 15)}...` : null,
                roles: usuario?.rolId
            })

            // if (!usuario?.token) {
            //     console.warn("⚠️ No hay token disponible")
            //     return
            // }

            try {
                console.log("📡 Intentando cargar localizaciones...")
                const data = await localizacionesService.obtenerLocalizaciones(usuario.token)
                console.log("✅ Localizaciones cargadas:", data)
                setLocalizaciones(data)
            } catch (err: any) {
                console.error("❌ Error al cargar localizaciones:", {
                    mensaje: err.message,
                    status: err.response?.status,
                    data: err.response?.data
                })
                setError("Error al cargar las localizaciones")
            }
        }

        cargarLocalizaciones()
    }, [usuario?.token, usuario?.id, usuario?.rolId])

    const form = useForm<CompletarPerfilFormValues>({
        resolver: zodResolver(completarPerfilSchema),
        defaultValues: {
            fechaNacimiento: undefined,
            genero: undefined,
            direccion: "",
            localizacion_id: undefined,
        },
    })

    const onSubmit = async (datos: CompletarPerfilFormValues) => {
        if (!form.formState.isValid || !usuario?.token) return

        try {
            setCargando(true)
            setError(null)

            console.log("Enviando datos:", {
                ...datos,
                usuarioId: usuario.id,
                localizacion_id: datos.localizacion_id
            })

            // Crear el perfil del paciente
            const response = await apiClient.post("/pacientes", {
                ...datos,
                usuarioId: usuario.id,
            }, {
                headers: {
                    "Authorization": `Bearer ${usuario.token}`
                }
            })

            console.log("Respuesta:", response.data)
            setNecesitaCompletarPerfil(false)
            router.push("/dashboard/paciente/triaje-inicial")
        } catch (err: any) {
            console.error("Error al guardar perfil:", err)
            setError(err.response?.data?.message || "Error al guardar el perfil. Por favor intenta nuevamente.")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Completa tu Perfil</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Para continuar, necesitamos algunos datos adicionales
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!form.formState.isValid) {
                            setError("Por favor completa todos los campos correctamente")
                            return
                        }
                        form.handleSubmit(onSubmit)(e)
                    }}
                    className="space-y-6"
                    noValidate
                >
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="fechaNacimiento"
                        label="Fecha de Nacimiento"
                        placeholder="Seleccione fecha"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
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
                        control={form.control}
                        name="direccion"
                        label="Dirección"
                        placeholder="Ingresa tu dirección completa"
                        iconSrc="/assets/icons/map-pin.svg"
                        iconAlt="Dirección"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
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