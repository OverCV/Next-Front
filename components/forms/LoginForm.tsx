"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { RUTAS_POR_ROL, TIPOS_IDENTIFICACION } from "@/constants";
import { DatosAcceso, authService } from "@/lib/services/auth.service";



// Esquema de validación para el login
const loginSchema = z.object({
    tipoIdentificacion: z.string().min(1, "Selecciona un tipo de identificación"),
    identificacion: z.string().min(3, "Ingresa un número de identificación válido"),
    clave: z.string().min(3, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    // const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            tipoIdentificacion: "",
            identificacion: "",
            clave: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        try {
            const credenciales: DatosAcceso = {
                tipoIdentificacion: values.tipoIdentificacion,
                identificacion: values.identificacion,
                clave: values.clave
            };

            const response = await authService.login(credenciales);

            // Mostrar mensaje de éxito
            toast({
                title: "Inicio de sesión exitoso",
                description: `Bienvenido(a), ${response.usuario.nombres}`,
                variant: "default",
            });

            // Redirigir según el rol del usuario
            const rutaDestino = RUTAS_POR_ROL[response.usuario.rolId] || "/";
            router.push(rutaDestino);

        } catch (error: any) {
            // Mostrar mensaje de error
            alert(`{
                title: "Error de autenticación",
                description: error.response?.data?.mensaje || "Credenciales inválidas. Verifica e intenta nuevamente.",
                variant: "destructive",
            }`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[496px]">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="logo"
                        className="mb-12 h-10 w-fit"
                    />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                            <section className="mb-12 space-y-4">
                                <h1 className="header">Bienvenido 👋</h1>
                                <p className="text-dark-700">Inicia sesión para continuar</p>
                            </section>

                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="tipoIdentificacion"
                                label="Tipo de Identificación"
                                placeholder="Selecciona tipo de identificación"
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
                                placeholder="Ej. 1023456789"
                                iconSrc="/assets/icons/id-card.svg"
                                iconAlt="Identificación"
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
                            />

                            <SubmitButton isLoading={isLoading}>Iniciar Sesión</SubmitButton>
                        </form>
                    </Form>

                    <div className="text-14-regular mt-20 text-center">
                        <p className="text-dark-600">© 2025 Campañas de Salud</p>
                    </div>
                </div>
            </section>

            <Image
                src="/assets/images/onboarding-img.png"
                height={1000}
                width={1000}
                alt="Campaña de Salud"
                className="side-img max-w-[50%]"
                priority={true}
            />
        </div>
    );
}