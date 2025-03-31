// app\registro\entidad\page.tsx
// src/app/registro/entidad/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegistroEntidadForm from "@/src/components/forms/RegistroEntidadForm";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";

export const metadata: Metadata = {
    title: "Registro de Entidad de Salud | Sistema de Campañas de Salud",
    description: "Regístrese como entidad de salud para administrar campañas de salud cardiovascular",
};

export default function RegistroEntidadPage(): JSX.Element {
    return (
        <div className="flex h-screen max-h-screen">
            <div className="absolute right-4 top-4 flex gap-2">
                <ThemeToggle />
            </div>

            <section className="remove-scrollbar container my-auto overflow-y-auto py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/acceso">
                            <Image
                                src="/assets/icons/logo-full.svg"
                                height={40}
                                width={160}
                                alt="Logo"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    <RegistroEntidadForm />

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            © 2025 Sistema de Campañas de Salud
                        </p>
                    </div>
                </div>
            </section>

            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="Registro de Entidad"
                className="side-img max-w-[50%]"
                priority={true}
            />
        </div>
    );
}