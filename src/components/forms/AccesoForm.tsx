// src\components\forms\AccesoForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/src/components/CustomFormField";
import { Form } from "@/src/components/ui/form";
import { SelectItem } from "@/src/components/ui/select";
import { RUTAS_POR_ROL, TIPOS_IDENTIFICACION } from "@/src/constants";

import { DatosAcceso } from "@/src/types";

import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { useAuth } from "@/src/providers/auth-provider";


// Esquema de validación
const loginSchema = z.object({
    tipoIdentificacion: z.string({
        required_error: "Selecciona un tipo de identificación",
    }),
    identificacion: z.string().min(1, "Ingresa tu número de identificación"),
    clave: z.string().min(1, "Ingresa tu contraseña"),
});

// Tipo para los valores del formulario
type AccesoFormValues = z.infer<typeof loginSchema>;

export default function AccesoForm(): JSX.Element {
    const router = useRouter();
    const { iniciarSesion } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);
    const [mostrarClave, setMostrarClave] = useState<boolean>(false);

    const form = useForm<AccesoFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            tipoIdentificacion: "",
            identificacion: "",
            clave: "",
        },
    });

    const onSubmit = async (datos: AccesoFormValues): Promise<void> => {
        setCargando(true);
        setError(null);

        console.log(datos)

        try {
            const credenciales: DatosAcceso = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                clave: datos.clave,
            };

            const usuarioRespuesta = await iniciarSesion(credenciales);

            console.log("Respuesta de inicio de sesión:", usuarioRespuesta);

            // Redirigir según el rol, usar RUTAS_POR_ROL por ahora
            router.push(RUTAS_POR_ROL[usuarioRespuesta.rolId] || "/dashboard/paciente");
        } catch (err: any) {
            setError(
                err.response?.data?.mensaje ||
                "Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="space-y-2 items-center text-center">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/assets/icons/logo-icon.svg"
                            width={20}
                            height={20}
                            alt="Logo"
                            className="h-auto w-16 mr-4"
                        />
                        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                    </div>
                </div>
                <p className="my-2 text-sm text-gray-500 dark:text-gray-500">
                    Ingresa tus credenciales para acceder
                </p>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="tipoIdentificacion"
                            label="Tipo de Identificación"
                            placeholder="Selecciona tipo"
                        >
                            {TIPOS_IDENTIFICACION.map((tipo) => (
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
                            placeholder="Ingresa tu número de identificación"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="Usuario"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="clave"
                            label="Contraseña"
                            placeholder="••••••••"
                            type="password"
                            iconSrc="/assets/icons/lock.svg"
                            iconAlt="Contraseña"
                            showPassword={mostrarClave}
                            onTogglePassword={() => setMostrarClave(!mostrarClave)}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={cargando}
                        >
                            {cargando ? "Ingresando..." : "Iniciar Sesión"}
                        </Button>

                    </form>
                </Form>
            </div>
        </div>
    );
}