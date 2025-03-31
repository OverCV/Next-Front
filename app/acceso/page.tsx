// app/acceso/page.tsx - Server Component
import { Metadata } from "next";
import Image from "next/image";
import AccesoForm from "@/src/components/forms/AccesoForm";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";
import { RegistroButton } from "@/src/components/auth/RegistroButton";

export const metadata: Metadata = {
    title: "Iniciar Sesión | Sistema de Campañas de Salud",
    description: "Accede al sistema de gestión de campañas de salud cardiovascular",
};

export default function AccesoPage(): JSX.Element {
    return (
        <div className="flex h-screen max-h-screen">

            <section className="remove-scrollbar container relative my-auto">
                <div className="sub-container">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={180}
                        width={180}
                        alt="Logo"
                        className="mb-6 h-10 w-fit"
                    />

                    <AccesoForm />

                    <RegistroButton />

                    <div className="text-14-regular mt-10 text-center">
                        <p className="text-slate-500 dark:text-slate-400">
                            © 2025 Sistema de Campañas de Salud
                        </p>
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