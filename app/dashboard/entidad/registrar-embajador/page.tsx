"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RegistroEmbajadorForm from "@/src/components/forms/RegistroEmbajadorForm";
import { Button } from "@/src/components/ui/button";
import { ROLES } from "@/src/constants";
import { useAuth } from "@/src/providers/auth-provider";


export default function RegistrarEmbajadorPage() {
    const router = useRouter();
    const { estaAutenticado, tieneRol } = useAuth();

    // Verificar autenticación y rol
    useEffect(() => {
        if (!estaAutenticado) {
            router.push('/acceso');
            return;
        }

        if (!tieneRol(ROLES.ENTIDAD_SALUD)) {
            // Solo las entidades de salud pueden registrar embajadores
            router.push('/dashboard/entidad');
        }
    }, [estaAutenticado, tieneRol, router]);

    return (
        <div>
            <div className="mb-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/dashboard/entidad')}
                >
                    <ArrowLeft className="size-4" />
                </Button>
                <h1 className="text-2xl font-bold">Registrar Nuevo Embajador</h1>
            </div>

            <RegistroEmbajadorForm />
        </div>
    );
}