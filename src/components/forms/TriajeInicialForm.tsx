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

// Esquema de validación
const triajeSchema = z.object({
    edad: z.number()
        .min(1, "La edad debe ser mayor a 0")
        .max(120, "La edad no puede ser mayor a 120"),
    peso: z.number()
        .min(1, "El peso debe ser mayor a 0")
        .max(500, "El peso no puede ser mayor a 500"),
    estatura: z.number()
        .min(0.1, "La estatura debe ser mayor a 0")
        .max(3, "La estatura no puede ser mayor a 3"),
    actividadFisica: z.boolean(),
    tabaquismo: z.boolean(),
    alcoholismo: z.boolean(),
    diabetes: z.boolean(),
    dolorPecho: z.boolean(),
    dolorIrradiado: z.boolean(),
    sudoracion: z.boolean(),
    nauseas: z.boolean(),
    antecedentesCardiacos: z.boolean(),
    hipertension: z.boolean(),
    descripcion: z.string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional(),
});

type TriajeFormValues = z.infer<typeof triajeSchema>;

export default function TriajeInicialForm() {
    const router = useRouter();
    const { usuario, setNecesitaTriajeInicial } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);
    const [pacienteId, setPacienteId] = useState<number | null>(null);

    useEffect(() => {
        const obtenerPaciente = async () => {
            if (!usuario) return;

            try {
                const response = await fetch(`/api/pacientes/usuario/${usuario.id}`);
                if (!response.ok) throw new Error("Error al obtener datos del paciente");

                const paciente = await response.json();
                setPacienteId(paciente.id);
            } catch (err) {
                console.error("Error al obtener paciente:", err);
                setError("Error al obtener datos del paciente");
            }
        };

        obtenerPaciente();
    }, [usuario]);

    const form = useForm<TriajeFormValues>({
        resolver: zodResolver(triajeSchema),
        defaultValues: {
            edad: undefined,
            peso: undefined,
            estatura: undefined,
            actividadFisica: false,
            tabaquismo: false,
            alcoholismo: false,
            diabetes: false,
            dolorPecho: false,
            dolorIrradiado: false,
            sudoracion: false,
            nauseas: false,
            antecedentesCardiacos: false,
            hipertension: false,
            descripcion: "",
        },
    });

    const onSubmit = async (datos: TriajeFormValues) => {
        if (!form.formState.isValid || !pacienteId) return;

        try {
            setCargando(true);
            setError(null);

            // Crear el triaje inicial
            const response = await fetch("/api/triaje", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...datos,
                    pacienteId,
                    fechaTriaje: new Date(),
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el triaje");
            }

            setNecesitaTriajeInicial(false);
            router.push("/dashboard/paciente");
        } catch (err: any) {
            console.error("Error al guardar triaje:", err);
            setError("Error al guardar el triaje. Por favor intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    if (!pacienteId) {
        return <div>Cargando datos del paciente...</div>;
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Evaluación Inicial de Salud</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Por favor, completa esta evaluación inicial para que podamos brindarte una mejor atención
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
                        e.preventDefault();
                        if (!form.formState.isValid) {
                            setError("Por favor completa todos los campos correctamente");
                            return;
                        }
                        form.handleSubmit(onSubmit)(e);
                    }}
                    className="space-y-6"
                    noValidate
                >
                    {/* Medidas básicas */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="edad"
                            label="Edad"
                            type="number"
                            placeholder="Años"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="peso"
                            label="Peso"
                            type="number"
                            placeholder="Kg"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="estatura"
                            label="Estatura"
                            type="number"
                            placeholder="Metros"
                        />
                    </div>

                    {/* Hábitos */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="actividadFisica"
                            label="¿Realiza actividad física?"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="tabaquismo"
                            label="¿Fuma?"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="alcoholismo"
                            label="¿Consume alcohol?"
                        />
                    </div>

                    {/* Condiciones médicas */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="diabetes"
                            label="¿Tiene diabetes?"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="hipertension"
                            label="¿Tiene hipertensión?"
                        />
                    </div>

                    {/* Síntomas */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="dolorPecho"
                            label="¿Ha sentido dolor en el pecho?"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="dolorIrradiado"
                            label="¿El dolor se irradia a otras partes?"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="sudoracion"
                            label="¿Ha tenido sudoración excesiva?"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="nauseas"
                            label="¿Ha tenido náuseas?"
                        />
                    </div>

                    {/* Antecedentes */}
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="antecedentesCardiacos"
                        label="¿Tiene antecedentes de problemas cardíacos?"
                    />

                    {/* Descripción adicional */}
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="descripcion"
                        label="Descripción adicional (opcional)"
                        placeholder="Agregue cualquier información adicional relevante"
                    />

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
    );
} 