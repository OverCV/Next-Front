// app\admin\page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/src/components/StatCard";
// import { columns } from "@/src/components/table/columns";
// import { DataTable } from "@/src/components/table/DataTable";
// import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { PasskeyModal } from "@/src/components/PasskeyModal";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/auth-provider";
import { Button } from "@/src/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
// import { useState } from "react";

const AdminPage = async () => {
  // const appointments = await getRecentAppointmentList();
  const { cerrarSesion } = useAuth();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await cerrarSesion();
    router.push("/acceso");
  };

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

        <p className="text-16-semibold mr-8">Admin Dashboard</p>

        {/* Navegación para escritorio */}
        <nav className="hidden mr-4 mt-1 md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </nav>

        {/* Botón de menú móvil */}
        <button
          className="mr-12 ml-3 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="postulada"
            count={3}
            label="Campañas postuladas"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="ejecucion"
            count={2}
            label="Campañas activas"
            icon={"/assets/icons/activa.svg"}
          />
          <StatCard
            type="cancelada"
            count={1}
            label="Campañas canceladas"
            icon={"/assets/icons/cancelada.svg"}
          />
        </section>

        {/* <DataTable columns={columns} data={appointments.documents} /> */}
      </main>
    </div>
  );
};

export default AdminPage;
