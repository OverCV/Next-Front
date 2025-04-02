"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField";
import { Form } from "@/src/components/ui/form";
import { SelectItem } from "@/src/components/ui/select";
import { NIVELES_PRIORIDAD } from "@/src/constants";

import { Button } from "../ui/button";

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

    // Factores de riesgo
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

    // Síntomas
    dolorPecho: z.boolean().default(false),
    dolorIrradiado: z.boolean().default(false),
    sudoracion: z.boolean().default(false),
    nauseas: z.boolean().default(false),
    antecedentesCardiacos: z.boolean().default(false),

    // Campo para observaciones adicionales
    descripcion: z.string().optional(),

    // Campo para prioridad (generalmente lo asigna el sistema automáticamente)
    nivelPrioridad: z.string().optional(),

    // Campo para IMC (generalmente lo asigna el sistema automáticamente)
    imc: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "El IMC es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(10, "Valor muy bajo").max(100, "Valor muy alto")
    ),
    // Campo para resultado de riesgo cardiovascular (generalmente lo asigna el sistema automáticamente)
    resultadoRiesgoCv: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({
            required_error: "El resultado de riesgo cardiovascular es requerido",
            invalid_type_error: "Debe ser un número"
        }).min(0, "Valor muy bajo").max(1, "Valor muy alto")
    ),
});

type TriajeFormValues = z.infer<typeof triajeSchema>;

interface TriajeFormProps {
    onSubmit: (data: TriajeFormValues) => void;
    initialData?: Partial<TriajeFormValues>;
}

export default function TriajeForm({ onSubmit, initialData }: TriajeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Inicializar el formulario con react-hook-form
    const form = useForm<TriajeFormValues>({
        resolver: zodResolver(triajeSchema),
        defaultValues: {
            edad: initialData?.edad || undefined,
            presionSistolica: initialData?.presionSistolica || undefined,
            presionDiastolica: initialData?.presionDiastolica || undefined,
            colesterolTotal: initialData?.colesterolTotal || undefined,
            hdl: initialData?.hdl || undefined,
            tabaquismo: initialData?.tabaquismo || false,
            alcoholismo: initialData?.alcoholismo || false,
            diabetes: initialData?.diabetes || false,
            peso: initialData?.peso || undefined,
            talla: initialData?.talla || undefined,
            dolorPecho: initialData?.dolorPecho || false,
            dolorIrradiado: initialData?.dolorIrradiado || false,
            sudoracion: initialData?.sudoracion || false,
            nauseas: initialData?.nauseas || false,
            antecedentesCardiacos: initialData?.antecedentesCardiacos || false,
            descripcion: initialData?.descripcion || "",
            nivelPrioridad: initialData?.nivelPrioridad || "MEDIA",
        },
    });

    const handleSubmit = async (values: TriajeFormValues) => {
        setIsSubmitting(true);
        try {
            // Calcular IMC automáticamente
            const tallaMt = (values.talla || 0) / 100; // Convertir cm a metros
            const imc = (values.peso || 0) / (tallaMt * tallaMt);

            // Calcular riesgo cardiovascular simulado (esto normalmente sería un algoritmo más complejo)
            // Valor simulado de 0 a 1 donde 1 es riesgo máximo
            const factoresRiesgo = [
                values.tabaquismo,
                values.alcoholismo,
                values.diabetes,
                values.dolorPecho,
                values.antecedentesCardiacos,
                values.presionSistolica > 140,
                values.presionDiastolica > 90,
                values.colesterolTotal > 240,
                values.hdl < 40,
                imc > 30
            ].filter(Boolean).length;

            const resultadoRiesgoCv = Math.min(factoresRiesgo / 10, 1);

            // Determinar nivel de prioridad basado en factores de riesgo
            let nivelPrioridad = "BAJA";
            if (factoresRiesgo >= 7) {
                nivelPrioridad = "ALTA";
            } else if (factoresRiesgo >= 4) {
                nivelPrioridad = "MEDIA";
            }

            // Enviar datos completos al componente padre
            onSubmit({
                ...values,
                imc: parseFloat(imc.toFixed(2)),
                resultadoRiesgoCv,
                nivelPrioridad,
            });
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {/* Sección de datos básicos */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-4 text-lg font-medium">Datos Básicos</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="edad"
                            label="Edad"
                            placeholder="Ingrese su edad"
                            type="number"
                        />

                        <div className="sm:col-span-2">
                            <h4 className="mb-2 text-sm font-medium">Presión Arterial</h4>
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

                        <div className="sm:col-span-2">
                            <h4 className="mb-2 text-sm font-medium">Colesterol</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="colesterolTotal"
                                    label="Colesterol Total (mg/dL)"
                                    placeholder="200"
                                    type="number"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="hdl"
                                    label="HDL (mg/dL)"
                                    placeholder="50"
                                    type="number"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de factores de riesgo */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-4 text-lg font-medium">Factores de Riesgo</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
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

                {/* Sección de medidas corporales */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-4 text-lg font-medium">Medidas Corporales</h3>
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

                {/* Sección de síntomas */}
                <div className="rounded-md border p-4">
                    <h3 className="mb-4 text-lg font-medium">Síntomas</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
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
                            label="Sudoración"
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
                            label="Antecedentes cardíacos"
                        />
                    </div>
                </div>

                {/* Descripción adicional */}
                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="descripcion"
                    label="Observaciones o síntomas adicionales"
                    placeholder="Describa cualquier otro síntoma o información relevante sobre su salud..."
                />

                {/* Solo para actualización: nivel de prioridad asignado */}
                {initialData && (
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="nivelPrioridad"
                        label="Nivel de Prioridad"
                        placeholder="Seleccionar nivel de prioridad"
                    >
                        {NIVELES_PRIORIDAD.map((nivel) => (
                            <SelectItem key={nivel.valor} value={nivel.valor}>
                                {nivel.etiqueta}
                            </SelectItem>
                        ))}
                    </CustomFormField>
                )}

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                    >
                        {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Guardar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}