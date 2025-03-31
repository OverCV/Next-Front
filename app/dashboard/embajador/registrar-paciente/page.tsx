// src/app/dashboard/embajador/registrar-paciente/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField";
import { Form } from "@/src/components/ui/form";
import { SelectItem } from "@/src/components/ui/select";
import { ROLES, TIPOS_IDENTIFICACION, OPCIONES_GENERO, TIPOS_IDENTIFICACION_PACIENTE } from "@/src/constants";
import { useAuth } from "@/src/providers/auth-provider";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

// Esquema de validación 
const registroPacienteSchema = z.object({
    tipoIdentificacion: z.string({
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
    fechaNacimiento: z.date({
        required_error: "La fecha de nacimiento es requerida",
    }),
    genero: z.string({
        required_error: "Selecciona un género",
    }),
    telefono: z.string()
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\d+$/, "El teléfono debe contener solo números"),
    correo: z.string()
        .email("Ingresa un correo electrónico válido")
        .optional()
        .or(z.literal('')),
    direccion: z.string()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .max(100, "La dirección no puede exceder 100 caracteres"),
});

type RegistroPacienteFormValues = z.infer<typeof registroPacienteSchema>;

export default function RegistrarPacientePage() {
    const router = useRouter();
    const { registroUsuario } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);
    const [exitoso, setExitoso] = useState<boolean>(false);

    const form = useForm<RegistroPacienteFormValues>({
        resolver: zodResolver(registroPacienteSchema),
        defaultValues: {
            tipoIdentificacion: "",
            identificacion: "",
            nombres: "",
            apellidos: "",
            fechaNacimiento: undefined,
            genero: "",
            telefono: "",
            correo: "",
            direccion: "",
        },
    });

    const onSubmit = async (datos: RegistroPacienteFormValues): Promise<void> => {
        setCargando(true);
        setError(null);
        setExitoso(false);

        try {
            // En un caso real, llamaríamos a la API para registrar al paciente
            // Simulamos un registro exitoso
            console.log("Datos de registro:", datos);

            // Simulamos tiempo de procesamiento
            setTimeout(() => {
                setExitoso(true);

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    router.push('/dashboard/embajador');
                }, 2000);
            }, 1000);

        } catch (err: any) {
            console.error("Error al registrar paciente:", err);
            setError(
                err.response?.data?.mensaje ||
                "Error al registrar el paciente. Por favor, verifica los datos e intenta nuevamente."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/dashboard/embajador')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Registrar Nuevo Paciente</h1>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Formulario de Registro</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Complete los datos del paciente para registrarlo en el sistema
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {exitoso && (
                    <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                        <AlertDescription>
                            Paciente registrado exitosamente. Serás redirigido al listado...
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Identificación */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                        {/* Datos personales */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                        {/* Fecha y Género */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                label="Género"
                                placeholder="Selecciona género"
                            >
                                {OPCIONES_GENERO.map((opcion) => (
                                    <SelectItem key={opcion.valor} value={opcion.valor}>
                                        {opcion.etiqueta}
                                    </SelectItem>
                                ))}
                            </CustomFormField>
                        </div>

                        {/* Contacto */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="telefono"
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

                        {/* Dirección */}
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="direccion"
                            label="Dirección"
                            placeholder="Dirección completa del paciente"
                            iconSrc="/assets/icons/map-pin.svg"
                            iconAlt="Dirección"
                        />

                        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/dashboard/embajador')}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={cargando}
                            >
                                {cargando ? "Registrando..." : "Registrar Paciente"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}