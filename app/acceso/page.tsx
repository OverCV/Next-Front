import { Metadata } from "next";

import AccesoForm from "@/src/components/forms/AccesoForm";
import ThemeToggle from "@/src/components/ui/theme-toggle";

export const metadata: Metadata = {
    title: "Iniciar Sesión | Sistema de Campañas de Salud",
    description: "Accede al sistema de gestión de campañas de salud cardiovascular",
};

export default function LoginPage(): JSX.Element {
    return (
        <div className="relative min-h-screen">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>
            <AccesoForm />
        </div>
    );
}