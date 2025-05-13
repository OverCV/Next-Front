"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { SelectItem } from "@/src/components/ui/select";
import { OPCIONES_GENERO, GeneroBiologicoEnum } from "@/src/constants";
import { useAuth } from "@/src/providers/auth-provider";

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
});

type CompletarPerfilFormValues = z.infer<typeof completarPerfilSchema>;

export default function CompletarPerfilForm() {
    const router = useRouter();
    const { usuario, setNecesitaCompletarPerfil } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);

    const form = useForm<CompletarPerfilFormValues>({
        resolver: zodResolver(completarPerfilSchema),
        defaultValues: {
            fechaNacimiento: undefined,
            genero: undefined,
            direccion: "",
        },
    });

    const onSubmit = async (datos: CompletarPerfilFormValues) => {
        if (!form.formState.isValid || !usuario) return;

        try {
            setCargando(true);
            setError(null);

            // Crear el perfil del paciente
            const response = await fetch("/api/pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...datos,
                    usuarioId: usuario.id,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el perfil");
            }

            setNecesitaCompletarPerfil(false);
            router.push("/dashboard/paciente/triaje-inicial");
        } catch (err: any) {
            console.error("Error al guardar perfil:", err);
            setError("Error al guardar el perfil. Por favor intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

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