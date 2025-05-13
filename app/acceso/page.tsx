// app/acceso/page.tsx - Server Component
import { Metadata } from "next"
import Image from "next/image"

// import { RegistroButton } from "@/src/components/auth/RegistroButton"
import AccesoForm from "@/src/components/forms/AccesoForm"

export const metadata: Metadata = {
    title: "Iniciar Sesión | Sistema de Campañas de Salud",
    description: "Accede al sistema de gestión de campañas de salud cardiovascular",
}

export default function AccesoPage(): JSX.Element {
    return <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container relative my-auto">
            <div className="sub-container">
                <Image
                    src="/assets/brand/logo-white.ico"
                    height={180}
                    width={180}
                    alt="Logo"
                    className="mb-6 h-10 w-fit"
                />

                <AccesoForm />

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
}
