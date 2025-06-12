import { Metadata } from "next"
import Image from "next/image"

import SolicitarRecuperacionForm from "@/src/components/forms/SolicitarRecuperacionForm"

export const metadata: Metadata = {
    title: "Recuperar Contraseña | Sistema de Campañas de Salud",
    description: "Solicita la recuperación de tu contraseña",
}

export default function RecuperarContraseñaPage(): JSX.Element {
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container relative my-auto">
                <div className="sub-container">
                    <Image
                        src="/assets/brand/logo-white.ico"
                        height={180}
                        width={180}
                        alt="Logo"
                        className="mb-6 h-10 w-fit"
                    />

                    <SolicitarRecuperacionForm />
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
    )
} 