// app\admin\page.tsx
"use client"

import { LogOut, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { RegistroEntidadSaludButton } from "@/src/components/auth/RegistroEntidadSaludButton"
import PasskeyModal from "@/src/components/PasskeyModal"
import { StatCard } from "@/src/components/StatCard"
import { Button } from "@/src/components/ui/button"
import { useAuth } from "@/src/providers/auth-provider"

// Página de administración
const AdminPage = () => {
  const { cerrarSesion } = useAuth()
  const router = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await cerrarSesion()
    router.push("/acceso")
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <PasskeyModal />

      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/images/logo.png"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold mr-8 ">Admin Dashboard</p>

        {/* Navegación para escritorio */}
        <nav className="mr-4 mt-1 hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
          >
            <LogOut className="size-4" />
            Cerrar Sesión
          </Button>
        </nav>

        {/* Botón de menú móvil */}
        <button
          className="ml-3 mr-12 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Bienvenid@ 👋</h1>
          <p className="text-dark-700">
            Administre campañas de salud y gestione notificaciones desde este panel
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="postulada"
            count={3}
            label="Campañas postuladas"
            icon="/assets/icons/postulada.svg"
          />
          <StatCard
            type="ejecucion"
            count={2}
            label="Campañas activas"
            icon="/assets/icons/activa.svg"
          />
          <StatCard
            type="finalizada"
            count={1}
            label="Campañas finalizadas"
            icon="/assets/icons/ambulancia.svg"
          />
        </section>

        {/* Componente de notificaciones deshabilitado temporalmente
        <NotificacionPrueba />
        */}

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-lg font-semibold mb-2">🚧 Notificaciones</h3>
          <p className="text-slate-500">
            Panel de notificaciones SMS/Email en desarrollo
          </p>
        </div>
      </main>

      <RegistroEntidadSaludButton />

    </div>
  )
}

export default AdminPage