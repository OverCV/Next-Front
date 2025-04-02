"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Triaje } from "@/src/types";

import CustomFormField, { FormFieldType } from "../CustomFormField";

// Esquema de validación para datos clínicos
const datosClinicosSchema = z.object({
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

    // Frecuencia cardíaca
    frecuenciaCardiacaMin: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La frecuencia cardíaca mínima es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(40, "Valor muy bajo").max(180, "Valor muy alto")
    ),
    frecuenciaCardiacaMax: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La frecuencia cardíaca máxima es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(40, "Valor muy bajo").max(220, "Valor muy alto")
    ),

    // Otros signos vitales
    saturacionOxigeno: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La saturación de oxígeno es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(70, "Valor muy bajo").max(100, "Valor muy alto")
    ),
    temperatura: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "La temperatura es requerida",
            invalid_type_error: "Debe ser un número"
        }).min(30, "Valor muy bajo").max(45, "Valor muy alto")
    ),

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

    // Observaciones
    observaciones: z.string().optional(),

    // IMC (Índice de Masa Corporal)
    imc: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "El IMC es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(10, "Valor muy bajo").max(50, "Valor muy alto")
    ),
});

type DatosClinicosFormValues = z.infer<typeof datosClinicosSchema>;

interface DatosClinicosFormProps {
    onSubmit: (data: DatosClinicosFormValues) => void;
    isSubmitting: boolean;
    initialData?: Partial<Triaje>;
}

export default function DatosClinicosForm({
    onSubmit,
    isSubmitting,
    initialData
}: DatosClinicosFormProps) {
    // Inicializar el formulario con react-hook-form
    const form = useForm<DatosClinicosFormValues>({
        resolver: zodResolver(datosClinicosSchema),
        defaultValues: {
            presionSistolica: initialData?.presionSistolica || undefined,
            presionDiastolica: initialData?.presionDiastolica || undefined,
            frecuenciaCardiacaMin: undefined,
            frecuenciaCardiacaMax: undefined,
            saturacionOxigeno: undefined,
            temperatura: undefined,
            peso: initialData?.peso || undefined,
            talla: initialData?.talla || undefined,
            observaciones: "",
        },
    });

    const handleSubmit = async (values: DatosClinicosFormValues) => {
        // Calcular IMC automáticamente
        const tallaMt = (values.talla || 0) / 100; // Convertir cm a metros
        const imc = (values.peso || 0) / (tallaMt * tallaMt);

        // Enviar datos completos al componente padre
        onSubmit({
            ...values,
            imc: parseFloat(imc.toFixed(2)),
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="mb-4">
                    <h2 className="text-lg font-medium">Datos Clínicos</h2>
                    <p className="text-sm text-slate-500">
                        Registre los signos vitales y medidas corporales del paciente.
                    </p>
                </div>

                {/* Presión arterial */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-3 text-sm font-medium">Presión Arterial</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="presionSistolica"
                            label="Presión Sistólica (mmHg)"
                            placeholder="120"
                            type="number"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="presionDiastolica"
                            label="Presión Diastólica (mmHg)"
                            placeholder="80"
                            type="number"
                        />
                    </div>
                </div>

                {/* Frecuencia cardíaca */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-3 text-sm font-medium">Frecuencia Cardíaca</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="frecuenciaCardiacaMin"
                            label="FC Mínima (lpm)"
                            placeholder="60"
                            type="number"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="frecuenciaCardiacaMax"
                            label="FC Máxima (lpm)"
                            placeholder="100"
                            type="number"
                        />
                    </div>
                </div>

                {/* Otros signos vitales */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-3 text-sm font-medium">Signos Vitales</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="saturacionOxigeno"
                            label="Saturación de Oxígeno (%)"
                            placeholder="98"
                            type="number"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="temperatura"
                            label="Temperatura (°C)"
                            placeholder="36.5"
                            type="number"
                        />
                    </div>
                </div>

                {/* Medidas corporales */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-3 text-sm font-medium">Medidas Corporales</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="peso"
                            label="Peso (kg)"
                            placeholder="70"
                            type="number"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="talla"
                            label="Talla (cm)"
                            placeholder="170"
                            type="number"
                        />
                    </div>
                </div>

                {/* Observaciones */}
                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="observaciones"
                    label="Observaciones"
                    placeholder="Notas adicionales sobre los signos vitales del paciente..."
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        Continuar a Diagnóstico
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </form>
        </Form>
    );
}