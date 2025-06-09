"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Form } from "@/src/components/ui/form"
import { SelectItem } from "@/src/components/ui/select"
import { TIPOS_IDENTIFICACION_PACIENTE, TiposIdentificacionEnum, OPCIONES_GENERO, TIPOS_SANGRE, GeneroBiologicoEnum, TipoSangreEnum } from "@/src/constants"
import { useAuth } from "@/src/providers/auth-provider"
import { localizacionesService } from "@/src/services/domain/localizaciones.service"
import { useRegistroPaciente, DatosRegistroCompleto } from "@/src/lib/hooks/useRegistroPaciente"
import { Localizacion } from "@/src/types"

// Esquema completo - Usuario + Paciente + Campaña (opcional)
const registroCompletoSchema = z.object({
    // Datos del Usuario
    tipoIdentificacion: z.nativeEnum(TiposIdentificacionEnum, {
        required_error: "Selecciona un tipo de identificación",
    }),
    identificacion: z.string()
        .min(5, "La identificación debe tener al menos 5 caracteres")
        .max(15, "La identificación no puede exceder 15 caracteres"),
    nombres: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres"),
    apellidos: z.string()
        .min(2, "Los apellidos deben tener al menos 2 caracteres")
        .max(50, "Los apellidos no pueden exceder 50 caracteres"),
    celular: z.string()
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\d+$/, "El teléfono debe contener solo números"),
    correo: z.string()
        .email("Ingresa un correo electrónico válido")
        .optional()
        .or(z.literal('')),

    // Datos del Paciente
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

    // Datos de Campaña (opcional)
    campanaId: z.string()
        .optional()
        .transform((val) => {
            if (!val || val === "sin_campana") return undefined
            return parseInt(val, 10)
        })
})

type RegistroCompletoFormValues = z.infer<typeof registroCompletoSchema>

export default function RegistrarPacientePage() {
    const router = useRouter()
    const { usuario } = useAuth()
    const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([])

    // Usar el hook personalizado
    const {
        registrarPacienteCompleto,
        cargarCampanasDisponibles,
        campanasDisponibles,
        cargandoCampanas,
        cargando,
        error,
        exitoso,
        limpiarEstado
    } = useRegistroPaciente()

    const form = useForm<RegistroCompletoFormValues>({
        resolver: zodResolver(registroCompletoSchema),
        defaultValues: {
            tipoIdentificacion: TiposIdentificacionEnum.CC,
            identificacion: "",
            nombres: "",
            apellidos: "",
            celular: "",
            correo: "",
            fechaNacimiento: undefined,
            genero: undefined,
            direccion: "",
            tipoSangre: undefined,
            localizacion_id: undefined,
            campanaId: undefined,
        },
    })

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                console.log("🌍 Cargando localizaciones...")
                const dataLocalizaciones = await localizacionesService.obtenerLocalizaciones()
                setLocalizaciones(dataLocalizaciones || [])

                console.log("📋 Cargando campañas disponibles...")
                await cargarCampanasDisponibles()

            } catch (err) {
                console.error("❌ Error al cargar datos:", err)
                setLocalizaciones([])
            }
        }
        cargarDatos()
    }, [cargarCampanasDisponibles]) // Solo depende de la función memoizada

    const onSubmit = async (datos: RegistroCompletoFormValues): Promise<void> => {
        const token = usuario?.token || localStorage.getItem('authToken')

        if (!token) {
            console.error("No hay token disponible")
            return
        }

        limpiarEstado()

        try {
            const datosCompletos: DatosRegistroCompleto = {
                // Datos del Usuario
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                celular: datos.celular,
                correo: datos.correo,

                // Datos del Paciente
                fechaNacimiento: datos.fechaNacimiento,
                genero: datos.genero,
                direccion: datos.direccion,
                tipoSangre: datos.tipoSangre,
                localizacion_id: datos.localizacion_id,

                // Datos de Campaña (opcional)
                campanaId: datos.campanaId
            }

            await registrarPacienteCompleto(datosCompletos, token)

            // Redirigir después de éxito
            setTimeout(() => {
                router.push('/dashboard/embajador')
            }, 2000)

        } catch (err: any) {
            console.error("❌ Error en el registro:", err)
            // El error ya se maneja en el hook
        }
    }

    return (
        <div>
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

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {exitoso && (
                    <Alert className="mb-6">
                        <AlertDescription>
                            ¡Paciente registrado exitosamente! Redirigiendo...
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>

                        {/* SECCIÓN USUARIO */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Datos como Usuario</h3>

                            {/* Identificación */}
                            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="tipoIdentificacion"
                                    label="Tipo de Identificación"
                                    placeholder="Selecciona tipo"
                                >
                                    {TIPOS_IDENTIFICACION_PACIENTE.map((tipo) => (
                                        <SelectItem key={tipo.valor} value={tipo.valor}>
                                            {tipo.etiqueta}
                                        </SelectItem>
                                    ))}
                                </CustomFormField>

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="identificacion"
                                    label="Número de Identificación"
                                    placeholder="Ej. 1023456789"
                                    iconSrc="/assets/icons/id-card.svg"
                                    iconAlt="Identificación"
                                />
                            </div>

                            {/* Nombres y Apellidos */}
                            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="nombres"
                                    label="Nombres"
                                    placeholder="Nombres del paciente"
                                    iconSrc="/assets/icons/user.svg"
                                    iconAlt="Nombres"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="apellidos"
                                    label="Apellidos"
                                    placeholder="Apellidos del paciente"
                                    iconSrc="/assets/icons/user.svg"
                                    iconAlt="Apellidos"
                                />
                            </div>

                            {/* Contacto */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="celular"
                                    label="Teléfono"
                                    placeholder="Ej. 3101234567"
                                    iconSrc="/assets/icons/celu.svg"
                                    iconAlt="Teléfono"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="correo"
                                    label="Correo Electrónico (Opcional)"
                                    placeholder="correo@ejemplo.com"
                                    iconSrc="/assets/icons/email.svg"
                                    iconAlt="Correo"
                                />
                            </div>
                        </div>

                        {/* SEPARADOR */}
                        <div className="border-t border-slate-200"></div>

                        {/* SECCIÓN PACIENTE */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Datos del Paciente</h3>

                            {/* Fecha de nacimiento */}
                            <div className="mb-6">
                                <CustomFormField
                                    fieldType={FormFieldType.DATE_PICKER}
                                    control={form.control}
                                    name="fechaNacimiento"
                                    label="Fecha de Nacimiento"
                                    placeholder="Seleccione fecha"
                                />
                            </div>

                            {/* Género y Tipo de Sangre */}
                            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
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
                                    control={form.control}
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
                            <div className="mb-6">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="direccion"
                                    label="Dirección"
                                    placeholder="Ingresa la dirección completa"
                                    iconSrc="/assets/icons/map-pin.svg"
                                    iconAlt="Dirección"
                                />
                            </div>

                            {/* Localización */}
                            <div className="mb-6">
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="localizacion_id"
                                    label="Localización"
                                    placeholder="Selecciona localización"
                                >
                                    {localizaciones.map((loc) => (
                                        <SelectItem
                                            key={loc.id}
                                            value={loc.id.toString()}>
                                            {`${loc.municipio}, ${loc.vereda || loc.localidad || 'Centro'} - ${loc.departamento}`}
                                        </SelectItem>
                                    ))}
                                </CustomFormField>
                            </div>
                        </div>

                        {/* SEPARADOR */}
                        <div className="border-t border-slate-200"></div>

                        {/* SECCIÓN CAMPAÑA */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Inscripción a Campaña</h3>
                            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                                Puedes inscribir al paciente directamente a una campaña de salud disponible.
                            </p>

                            <div className="mb-6">
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="campanaId"
                                    label="Campaña de Salud"
                                    placeholder={cargandoCampanas ? "Cargando campañas..." : "Selecciona una campaña"}
                                    disabled={cargandoCampanas}
                                >
                                    {campanasDisponibles.map((campana) => (
                                        <SelectItem
                                            key={campana.id}
                                            value={campana.id.toString()}>
                                            {`${campana.nombre} - ${campana.estado} (${campana.minParticipantes}-${campana.maxParticipantes} participantes)`}
                                        </SelectItem>
                                    ))}
                                </CustomFormField>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={cargando || exitoso}
                        >
                            {cargando ? "Registrando Paciente..." : exitoso ? "Paciente Registrado ✓" : "Registrar Paciente Completo"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}