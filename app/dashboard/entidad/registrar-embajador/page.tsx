"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import RegistroEmbajadorForm from "@/src/components/forms/RegistroEmbajadorForm";
import { useAuth } from "@/src/providers/auth-provider";
import { ROLES } from "@/src/constants";
import { useEffect } from "react";

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
            router.push('/dashboard');
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
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Registrar Nuevo Embajador</h1>
            </div>

            <RegistroEmbajadorForm />
        </div>
    );
}