"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Pill,
    ListChecks,
    Clock,
    Save,
    Dumbbell,
    Utensils,
    Plus,
    Repeat,
    Plus,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { SelectItem } from "@/src/components/ui/select";
import { NIVELES_PRIORIDAD } from "@/src/constants";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/src/components/ui/accordion";
import { Badge } from "@/src/components/ui/badge";
// import { Card, CardContent } from "@/src/components/ui/card";
import { atencionesService } from "@/src/services/atenciones";


// Esquema de validación para diagnóstico
const diagnosticoSchema = z.object({
    // Información básica del diagnóstico
    codigoCie10: z.string()
        .min(3, "El código CIE-10 debe tener al menos 3 caracteres"),
    descripcion: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres"),
    esPrincipal: z.boolean().default(true),
    severidad: z.string({
        required_error: "La severidad es requerida"
    }),

    // Notas médicas
    notasMedicas: z.string()
        .min(10, "Las notas médicas deben tener al menos 10 caracteres"),

    // Seguimiento
    requiereSeguimiento: z.boolean().default(false),
    fechaSeguimiento: z.date().optional(),
    prioridadSeguimiento: z.string().optional(),
});

// Esquema para prescripciones/recomendaciones
const prescripcionSchema = z.object({
    tipo: z.string(),
    descripcion: z.string().min(3, "La descripción es requerida"),
    dosis: z.string().optional(),
    frecuencia: z.string().optional(),
    duracion: z.string().optional(),
    indicacionesEspeciales: z.string().optional(),
});

type DiagnosticoFormValues = z.infer<typeof diagnosticoSchema>;
type PrescripcionFormValues = z.infer<typeof prescripcionSchema>;

interface DiagnosticoFormProps {
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    pacienteId: number;
}

export default function DiagnosticoForm({
    onSubmit,
    isSubmitting,
    pacienteId
}: DiagnosticoFormProps) {
    const [sugerencias, setSugerencias] = useState<any[]>([]);
    const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
    const [prescripciones, setPrescripciones] = useState<PrescripcionFormValues[]>([]);
    const [nuevaPrescripcion, setNuevaPrescripcion] = useState<Partial<PrescripcionFormValues>>({
        tipo: 'MEDICAMENTO',
        descripcion: '',
    });
    const [acordeonActivo, setAcordeonActivo] = useState<string | null>("diagnostico");

    // Inicializar el formulario con react-hook-form
    const form = useForm<DiagnosticoFormValues>({
        resolver: zodResolver(diagnosticoSchema),
        defaultValues: {
            codigoCie10: "",
            descripcion: "",
            esPrincipal: true,
            severidad: "MODERADA",
            notasMedicas: "",
            requiereSeguimiento: false,
            fechaSeguimiento: undefined,
            prioridadSeguimiento: "MEDIA"
        },
    });

    // Vigilar cambios en requiereSeguimiento para validación condicional
    const requiereSeguimiento = form.watch("requiereSeguimiento");

    // Cargar sugerencias basadas en signos vitales y triaje
    useEffect(() => {
        const cargarSugerencias = async () => {
            if (!pacienteId) return;

            setCargandoSugerencias(true);
            try {
                const sugerenciasData = await atencionesService.obtenerSugerenciasDiagnostico(pacienteId);
                setSugerencias(sugerenciasData);
            } catch (err) {
                console.error('Error al cargar sugerencias:', err);
            } finally {
                setCargandoSugerencias(false);
            }
        };

        cargarSugerencias();
    }, [pacienteId]);

    // Manejar la adición de una nueva prescripción
    const agregarPrescripcion = () => {
        if (!nuevaPrescripcion.descripcion) return;

        setPrescripciones([...prescripciones, nuevaPrescripcion as PrescripcionFormValues]);
        setNuevaPrescripcion({
            tipo: 'MEDICAMENTO',
            descripcion: '',
            dosis: '',
            frecuencia: '',
            duracion: '',
        });
    };

    // Manejar la eliminación de una prescripción
    const eliminarPrescripcion = (index: number) => {
        const nuevasPrescripciones = [...prescripciones];
        nuevasPrescripciones.splice(index, 1);
        setPrescripciones(nuevasPrescripciones);
    };

    // Aplicar una sugerencia al diagnóstico
    const aplicarSugerencia = (sugerencia: any) => {
        form.setValue("codigoCie10", sugerencia.codigoCie10 || "");
        form.setValue("descripcion", sugerencia.descripcion || "");
        form.setValue("severidad", sugerencia.severidad || "MODERADA");

        // Si hay medicamentos sugeridos, agregarlos a las prescripciones
        if (sugerencia.medicamentos && sugerencia.medicamentos.length > 0) {
            const nuevasPrescripciones = sugerencia.medicamentos.map((med: any) => ({
                tipo: 'MEDICAMENTO',
                descripcion: med.nombre,
                dosis: med.dosis,
                frecuencia: med.frecuencia,
                duracion: med.duracion,
                indicacionesEspeciales: med.indicaciones,
            }));

            setPrescripciones([...prescripciones, ...nuevasPrescripciones]);
        }

        // Cerrar el acordeón de sugerencias y abrir el de diagnóstico
        setAcordeonActivo("diagnostico");
    };

    const handleSubmit = async (values: DiagnosticoFormValues) => {
        // Preparar objeto completo con diagnóstico y prescripciones
        const diagnosticoCompleto = {
            ...values,
            prescripciones,
            fechaDiagnostico: new Date().toISOString(),
        };

        onSubmit(diagnosticoCompleto);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="mb-4">
                    <h2 className="text-lg font-medium">Diagnóstico y Tratamiento</h2>
                    <p className="text-sm text-slate-500">
                        Registre el diagnóstico, tratamiento y seguimiento del paciente.
                    </p>
                </div>

                <Accordion
                    type="single"
                    collapsible
                    value={acordeonActivo || undefined}
                    // onValueChange={(value) => setAcordeonActivo(value)}
                    className="mb-6"
                >
                    {/* Sugerencias de diagnóstico */}
                    <AccordionItem value="sugerencias" className="rounded-md border">
                        <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <ListChecks className="size-5 text-blue-500" />
                                <span>Sugerencias de Diagnóstico</span>
                                {sugerencias.length > 0 && (
                                    <Badge variant="outline" className="ml-2">
                                        {sugerencias.length}
                                    </Badge>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            {cargandoSugerencias ? (
                                <div className="flex justify-center py-4">
                                    <div className="flex flex-col items-center">
                                        <div className="size-8 animate-spin rounded-full border-y-2 border-blue-500"></div>
                                        <p className="mt-2 text-sm text-slate-500">Cargando sugerencias...</p>
                                    </div>
                                </div>
                            ) : sugerencias.length > 0 ? (
                                <div className="space-y-3">
                                    {sugerencias.map((sugerencia, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start">
                                                    <div className="flex-1 p-4">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <Badge
                                                                className={
                                                                    sugerencia.confianza > 0.7 ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300" :
                                                                        sugerencia.confianza > 0.4 ? "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300" :
                                                                            "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                                                                }
                                                            >
                                                                {Math.round(sugerencia.confianza * 100)}% coincidencia
                                                            </Badge>
                                                            {sugerencia.codigoCie10 && (
                                                                <Badge variant="outline">
                                                                    {sugerencia.codigoCie10}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium">{sugerencia.descripcion}</h4>
                                                        <p className="mt-1 text-sm text-slate-500">{sugerencia.detalles}</p>
                                                    </div>
                                                    <div className="flex justify-center border-t bg-slate-50 p-3 dark:bg-slate-800 sm:justify-end sm:border-l sm:border-t-0">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => aplicarSugerencia(sugerencia)}
                                                        >
                                                            Aplicar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-2 text-center text-sm text-slate-500">
                                    No hay sugerencias disponibles para este paciente.
                                </p>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Formulario de diagnóstico */}
                    <AccordionItem value="diagnostico" className="mt-3 rounded-md border">
                        <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <Pill className="size-5 text-red-500" />
                                <span>Diagnóstico Principal</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 px-4 pb-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="codigoCie10"
                                    label="Código CIE-10"
                                    placeholder="Ej. I10"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="severidad"
                                    label="Severidad"
                                >
                                    <SelectItem value="LEVE">Leve</SelectItem>
                                    <SelectItem value="MODERADA">Moderada</SelectItem>
                                    <SelectItem value="GRAVE">Grave</SelectItem>
                                </CustomFormField>
                            </div>

                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="descripcion"
                                label="Descripción del Diagnóstico"
                                placeholder="Detalle el diagnóstico del paciente..."
                            />

                            <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="esPrincipal"
                                label="Es diagnóstico principal"
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Sección de notas médicas */}
                    <AccordionItem value="notas" className="mt-3 rounded-md border">
                        <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="size-5 text-slate-500" />
                                <span>Notas Médicas</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="notasMedicas"
                                label="Notas y Observaciones"
                                placeholder="Registre observaciones adicionales, síntomas, signos, evolución, etc."
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Sección de prescripciones/tratamiento */}
                    <AccordionItem value="prescripciones" className="mt-3 rounded-md border">
                        <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <Pill className="size-5 text-green-500" />
                                <span>Tratamiento y Recomendaciones</span>
                                {prescripciones.length > 0 && (
                                    <Badge variant="outline" className="ml-2">
                                        {prescripciones.length}
                                    </Badge>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            {/* Lista de prescripciones agregadas */}
                            {prescripciones.length > 0 && (
                                <div className="mb-4 space-y-3">
                                    {prescripciones.map((prescripcion, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start justify-between rounded-md border p-3"
                                        >
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    {prescripcion.tipo === 'MEDICAMENTO' && (
                                                        <Pill className="size-4 text-blue-500" />
                                                    )}
                                                    {prescripcion.tipo === 'ESTILO_VIDA' && (
                                                        <Repeat className="size-4 text-green-500" />
                                                    )}
                                                    {prescripcion.tipo === 'ACTIVIDAD_FISICA' && (
                                                        <Dumbbell className="size-4 text-orange-500" />
                                                    )}
                                                    {prescripcion.tipo === 'DIETA' && (
                                                        <Utensils className="size-4 text-amber-500" />
                                                    )}

                                                    <span className="font-medium">
                                                        {prescripcion.descripcion}
                                                    </span>

                                                    <Badge variant="outline" className="ml-auto">
                                                        {prescripcion.tipo === 'MEDICAMENTO' ? 'Medicamento' :
                                                            prescripcion.tipo === 'ESTILO_VIDA' ? 'Estilo de Vida' :
                                                                prescripcion.tipo === 'ACTIVIDAD_FISICA' ? 'Actividad Física' :
                                                                    'Dieta'}
                                                    </Badge>
                                                </div>

                                                {prescripcion.tipo === 'MEDICAMENTO' && (
                                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                                        {prescripcion.dosis && (
                                                            <div>
                                                                <span className="text-slate-500">Dosis:</span> {prescripcion.dosis}
                                                            </div>
                                                        )}
                                                        {prescripcion.frecuencia && (
                                                            <div>
                                                                <span className="text-slate-500">Frecuencia:</span> {prescripcion.frecuencia}
                                                            </div>
                                                        )}
                                                        {prescripcion.duracion && (
                                                            <div>
                                                                <span className="text-slate-500">Duración:</span> {prescripcion.duracion}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {prescripcion.indicacionesEspeciales && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {prescripcion.indicacionesEspeciales}
                                                    </p>
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => eliminarPrescripcion(index)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-300"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="rounded-md border p-4">
                                <h4 className="mb-3 text-sm font-medium">Agregar Recomendación o Medicamento</h4>

                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="mb-1 block text-sm font-medium">Tipo</label>
                                            <select
                                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                                value={nuevaPrescripcion.tipo}
                                                onChange={(e) => setNuevaPrescripcion({
                                                    ...nuevaPrescripcion,
                                                    tipo: e.target.value
                                                })}
                                            >
                                                <option value="MEDICAMENTO">Medicamento</option>
                                                <option value="ESTILO_VIDA">Estilo de Vida</option>
                                                <option value="ACTIVIDAD_FISICA">Actividad Física</option>
                                                <option value="DIETA">Dieta</option>
                                            </select>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            onClick={agregarPrescripcion}
                                            disabled={!nuevaPrescripcion.descripcion}
                                            className="mt-7"
                                        >
                                            <Plus className="size-4" />
                                        </Button>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Descripción</label>
                                        <Input
                                            value={nuevaPrescripcion.descripcion}
                                            onChange={(e) => setNuevaPrescripcion({
                                                ...nuevaPrescripcion,
                                                descripcion: e.target.value
                                            })}
                                            placeholder={
                                                nuevaPrescripcion.tipo === 'MEDICAMENTO' ? "Nombre del medicamento" :
                                                    nuevaPrescripcion.tipo === 'ESTILO_VIDA' ? "Recomendación de estilo de vida" :
                                                        nuevaPrescripcion.tipo === 'ACTIVIDAD_FISICA' ? "Actividad física recomendada" :
                                                            "Recomendación dietética"
                                            }
                                        />
                                    </div>

                                    {nuevaPrescripcion.tipo === 'MEDICAMENTO' && (
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium">Dosis</label>
                                                <Input
                                                    value={nuevaPrescripcion.dosis || ''}
                                                    onChange={(e) => setNuevaPrescripcion({
                                                        ...nuevaPrescripcion,
                                                        dosis: e.target.value
                                                    })}
                                                    placeholder="Ej. 500mg"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium">Frecuencia</label>
                                                <Input
                                                    value={nuevaPrescripcion.frecuencia || ''}
                                                    onChange={(e) => setNuevaPrescripcion({
                                                        ...nuevaPrescripcion,
                                                        frecuencia: e.target.value
                                                    })}
                                                    placeholder="Ej. Cada 8 horas"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium">Duración</label>
                                                <Input
                                                    value={nuevaPrescripcion.duracion || ''}
                                                    onChange={(e) => setNuevaPrescripcion({
                                                        ...nuevaPrescripcion,
                                                        duracion: e.target.value
                                                    })}
                                                    placeholder="Ej. 7 días"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            {nuevaPrescripcion.tipo === 'MEDICAMENTO' ? 'Indicaciones Especiales' : 'Detalles Adicionales'}
                                        </label>
                                        <Input
                                            value={nuevaPrescripcion.indicacionesEspeciales || ''}
                                            onChange={(e) => setNuevaPrescripcion({
                                                ...nuevaPrescripcion,
                                                indicacionesEspeciales: e.target.value
                                            })}
                                            placeholder="Instrucciones adicionales..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Sección de seguimiento */}
                    <AccordionItem value="seguimiento" className="mt-3 rounded-md border">
                        <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <Repeat className="size-5 text-purple-500" />
                                <span>Seguimiento</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="requiereSeguimiento"
                                label="Requiere seguimiento posterior"
                            />

                            {requiereSeguimiento && (
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <CustomFormField
                                        fieldType={FormFieldType.DATE_PICKER}
                                        control={form.control}
                                        name="fechaSeguimiento"
                                        label="Fecha de Seguimiento"
                                        placeholder="Seleccione fecha"
                                    />

                                    <CustomFormField
                                        fieldType={FormFieldType.SELECT}
                                        control={form.control}
                                        name="prioridadSeguimiento"
                                        label="Prioridad"
                                    >
                                        {NIVELES_PRIORIDAD.map((nivel) => (
                                            <SelectItem key={nivel.valor} value={nivel.valor}>
                                                {nivel.etiqueta}
                                            </SelectItem>
                                        ))}
                                    </CustomFormField>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Botón de finalizar */}
                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        <Save className="size-4" />
                        Finalizar Atención
                    </Button>
                </div>
            </form>
        </Form>
    );
}