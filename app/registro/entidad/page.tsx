// app\registro\entidad\page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import RegistroEntidadForm from "@/src/components/forms/RegistroEntidadForm";

export const metadata: Metadata = {
    title: "Registro de Entidad de Salud | Sistema de Campañas de Salud",
    description: "Regístrese como entidad de salud para administrar campañas de salud cardiovascular",
};

export default function RegistroEntidadPage(): JSX.Element {
    return (
        <div className="flex h-screen max-h-screen">

            <section className="remove-scrollbar container my-auto overflow-y-auto py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/acceso">
                            <Image
                                src="/assets/brand/logo-black.ico"
                                height={40}
                                width={160}
                                alt="Logo"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    <RegistroEntidadForm />


                </div>
            </section>

            <Image
                src="/assets/images/hospital.png"
                height={1000}
                width={1000}
                alt="Registro de Entidad"
                className="side-img max-w-[50%]"
                priority={true}
            />
        </div>
    );
}