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
import { ROLES, TIPOS_IDENTIFICACION } from "@/src/constants";
import { useAuth } from "@/src/providers/auth-provider";
import { DatosRegistro } from "@/src/types";

// Esquema de validación
const registroEmbajadorSchema = z.object({
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
    telefono: z.string()
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\d+$/, "El teléfono debe contener solo números"),
    correo: z.string()
        .email("Ingresa un correo electrónico válido"),
    clave: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarClave: z.string()
        .min(6, "La confirmación de contraseña es requerida"),
    localidad: z.string()
        .min(2, "La localidad debe tener al menos 2 caracteres")
        .max(100, "La localidad no puede exceder 100 caracteres"),
}).refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
});

type RegistroEmbajadorFormValues = z.infer<typeof registroEmbajadorSchema>;

export default function RegistroEmbajadorForm() {
    const router = useRouter();
    const { registroUsuario } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);
    const [exitoso, setExitoso] = useState<boolean>(false);

    const form = useForm<RegistroEmbajadorFormValues>({
        resolver: zodResolver(registroEmbajadorSchema),
        defaultValues: {
            tipoIdentificacion: "",
            identificacion: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            correo: "",
            clave: "",
            confirmarClave: "",
            localidad: "",
        },
    });

    const onSubmit = async (datos: RegistroEmbajadorFormValues): Promise<void> => {
        setCargando(true);
        setError(null);
        setExitoso(false);

        try {
            console.log("Datos de registro:", datos);

            // Preparar datos para enviar al endpoint de registro
            const datosRegistro: DatosRegistro = {
                tipoIdentificacion: datos.tipoIdentificacion,
                identificacion: datos.identificacion,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                correo: datos.correo,
                clave: datos.clave,
                celular: datos.telefono,
                estaActivo: true,
                rolId: ROLES.EMBAJADOR, // Id 7: Rol de embajador
            };

            // Llamar al mismo endpoint de registro que usamos para las entidades y pacientes
            const respuesta = await registroUsuario(datosRegistro);
            console.log("Registro exitoso:", respuesta);

            // TODO: Aquí podríamos guardar datos adicionales específicos
            // como la localidad asignada y la relación con la entidad de salud

            setExitoso(true);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push('/dashboard/entidad');
            }, 2000);

        } catch (err: any) {
            console.error("Error al registrar embajador:", err);
            setError(
                err.response?.data?.mensaje ||
                "Error al registrar el embajador. Por favor, verifica los datos e intenta nuevamente."
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Formulario de Registro de Embajador</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Complete los datos del embajador para registrarlo en el sistema
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
                        Embajador registrado exitosamente. Serás redirigido al listado...
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
                            {TIPOS_IDENTIFICACION.filter(tipo => tipo.valor !== "nit").map((tipo) => (
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
                            placeholder="Nombres del embajador"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="Nombres"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="apellidos"
                            label="Apellidos"
                            placeholder="Apellidos del embajador"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="Apellidos"
                        />
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
                            label="Correo Electrónico"
                            placeholder="correo@ejemplo.com"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="Correo"
                        />
                    </div>

                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="confirmarClave"
                            label="Confirmar Contraseña"
                            placeholder="••••••••"
                            type="password"
                            iconSrc="/assets/icons/lock.svg"
                            iconAlt="Confirmar Contraseña"
                        />
                    </div>

                    {/* Localidad */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="localidad"
                        label="Localidad Asignada"
                        placeholder="Ej. Vereda San Antonio, Municipio La Unión"
                        iconSrc="/assets/icons/map-pin.svg"
                        iconAlt="Localidad"
                    />

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/dashboard/entidad')}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={cargando}
                        >
                            {cargando ? "Registrando..." : "Registrar Embajador"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}