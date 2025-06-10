// src/components/auth/RegistroButton.tsx
"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";

export function RegistroButton() {
    const router = useRouter();

    const navegarARegistro = () => {
        router.push("/admin/registrar-entidad");
    };

    return (
        <div className="mt-1 text-center ">
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                {/* ¿Eres una entidad de salud y necesitas registrarte? */}
            </p>
            <Button
                type="button"
                onClick={navegarARegistro}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
                Registrar Entidad de Salud
            </Button>
        </div>
    );
}