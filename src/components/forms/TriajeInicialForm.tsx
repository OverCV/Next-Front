"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { useAuth } from "@/src/providers/auth-provider";
import { pacientesService } from "@/src/services/domain/pacientes.service";
import { checkTokenStatus } from "@/src/utils/debug";

// Esquema de validación para el triaje
const triajeSchema = z.object({
    // Datos básicos
    edad: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La edad es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(1, "La edad debe ser mayor a 0").max(120, "La edad debe ser menor a 120")
    ),

    // Presión arterial
    presionSistolica: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La presión sistólica es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(60, "Valor muy bajo").max(250, "Valor muy alto")
    ),
    presionDiastolica: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La presión diastólica es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(40, "Valor muy bajo").max(150, "Valor muy alto")
    ),

    // Colesterol
    colesterolTotal: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "El colesterol total es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(50, "Valor muy bajo").max(500, "Valor muy alto")
    ),
    hdl: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "El HDL es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(10, "Valor muy bajo").max(120, "Valor muy alto")
    ),

    // Factores de riesgo (checkboxes)
    tabaquismo: z.boolean().default(false),
    alcoholismo: z.boolean().default(false),
    diabetes: z.boolean().default(false),

    // Medidas corporales
    peso: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "El peso es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(20, "Valor muy bajo").max(300, "Valor muy alto")
    ),
    talla: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La talla es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(50, "Valor muy bajo").max(250, "Valor muy alto")
    ),

    // Síntomas (checkboxes)
    dolorPecho: z.boolean().default(false),
    dolorIrradiado: z.boolean().default(false),
    sudoracion: z.boolean().default(false),
    nauseas: z.boolean().default(false),
    antecedentesCardiacos: z.boolean().default(false),

    // Campo para observaciones adicionales
    descripcion: z.string().optional(),
});

type TriajeFormValues = z.infer<typeof triajeSchema>;

export default function TriajeInicialForm() {
    const router = useRouter();
    const { usuario, setNecesitaTriajeInicial } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [pacienteId, setPacienteId] = useState<number | null>(null);

    const form = useForm<TriajeFormValues>({
        resolver: zodResolver(triajeSchema),
        defaultValues: {
            edad: undefined,
            presionSistolica: undefined,
            presionDiastolica: undefined,
            colesterolTotal: undefined,
            hdl: undefined,
            tabaquismo: false,
            alcoholismo: false,
            diabetes: false,
            peso: undefined,
            talla: undefined,
            dolorPecho: false,
            dolorIrradiado: false,
            sudoracion: false,
            nauseas: false,
            antecedentesCardiacos: false,
            descripcion: "",
        },
    });

    useEffect(() => {
        const obtenerPaciente = async () => {
            try {
                if (!usuario?.id) {
                    console.warn("⚠️ No hay usuario para obtener paciente");
                    return;
                }

                // Obtener el perfil del paciente para conocer su ID
                const perfilResponse = await fetch(`/api/pacientes/perfil?usuarioId=${usuario.id}`);
                const perfilData = await perfilResponse.json();

                if (!perfilData.existe || !perfilData.id) {
                    console.error("❌ No se encontró el perfil del paciente");
                    setError("No se pudo obtener tu perfil. Por favor, completa tu perfil primero.");
                    return;
                }

                console.log("✅ Perfil del paciente obtenido:", perfilData);
                setPacienteId(perfilData.id);
            } catch (err) {
                console.error("❌ Error al obtener paciente:", err);
                setError("Error al obtener datos del paciente");
            }
        };

        obtenerPaciente();
    }, [usuario?.id]);

    const onSubmit = async (datos: TriajeFormValues) => {
        setFormErrors([]);

        // Obtener token de cualquier lugar disponible
        const token = usuario?.token || localStorage.getItem('token') || document.cookie.match(/token=([^;]+)/)?.[1] || "";

        if (!token) {
            setError("No hay sesión activa. Por favor, inicia sesión nuevamente.");
            return;
        }

        if (!pacienteId) {
            setError("No se pudo obtener tu ID de paciente. Por favor, intenta nuevamente.");
            return;
        }

        if (!form.formState.isValid) {
            const errors = Object.entries(form.formState.errors).map(([_, error]) => {
                return `${error.message}`;
            });
            setFormErrors(errors);
            return;
        }

        try {
            setCargando(true);
            setError(null);

            console.log("📝 Datos del triaje a enviar:", {
                ...datos,
                pacienteId
            });

            // Crear el triaje usando el servicio
            await pacientesService.crearTriaje(
                token,
                {
                    ...datos,
                    pacienteId
                }
            );

            console.log("✅ Triaje creado correctamente");
            setNecesitaTriajeInicial(false);

            // Redirigir al usuario después de un breve retraso
            setTimeout(() => {
                router.push("/dashboard/paciente");
            }, 500);
        } catch (err: any) {
            console.error("❌ Error al guardar triaje:", err);
            setError(err.response?.data?.message || "Error al guardar el triaje. Por favor intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Triaje Inicial</h2>
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
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="edad"
                                    label="Edad"
                                    placeholder="Ingresa tu edad"
                                    inputType="number"
                                />
                                <div className="sm:col-span-1"></div> {/* Espacio vacío para alinear */}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Presión Arterial</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="presionSistolica"
                                    label="Presión Sistólica (mmHg)"
                                    placeholder="Ej: 120"
                                    inputType="number"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="presionDiastolica"
                                    label="Presión Diastólica (mmHg)"
                                    placeholder="Ej: 80"
                                    inputType="number"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Colesterol</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="colesterolTotal"
                                    label="Colesterol Total (mg/dL)"
                                    placeholder="Ej: 200"
                                    inputType="number"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="hdl"
                                    label="HDL (mg/dL)"
                                    placeholder="Ej: 60"
                                    inputType="number"
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
                                    inputType="number"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="talla"
                                    label="Estatura (cm)"
                                    placeholder="Ej: 170"
                                    inputType="number"
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
    );
} 