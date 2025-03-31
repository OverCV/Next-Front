"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import RegistroPacienteForm from "@/src/components/forms/RegistroPacienteForm";

export default function RegistrarPacientePage() {
    const router = useRouter();

    return (
        <div>
            <div className="mb-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/dashboard/embajador')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Registrar Nuevo Paciente</h1>
            </div>

            <RegistroPacienteForm />
        </div>
    );
}