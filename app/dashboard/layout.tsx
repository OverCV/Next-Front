// src/app/dashboard/layout.tsx
"use client";

import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
//  usePathname,
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { ROLES_NOMBRE } from "@/src/constants";
import { useAuth } from "@/src/providers/auth-provider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { usuario, cargando, cerrarSesion } = useAuth();
    const router = useRouter();
    // const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    useEffect(() => {
        // Solo redirigir cuando la carga haya terminado y no haya usuario
        if (!cargando && !usuario) {
            router.push("/acceso");
        }
    }, [cargando, usuario, router]);
    // Mostrar un estado de carga mientras se verifica la autenticación
    if (cargando) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center text-center">
                    <div className="size-10 animate-spin rounded-full border-y-2 border-green-500"></div>
                    <p className="mt-4">Verificando autenticación...</p>
                </div>
            </div>
        );
    }


    // Si no hay usuario, redirigir al login
    if (!usuario) {
        // router.push("/acceso");
        return null;
    }

    const handleLogout = async () => {
        await cerrarSesion();
        router.push("/acceso");
    };

    // const isActive = (path: string) => {
    //     return pathname.startsWith(path)
    //         ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
    //         : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";
    // };

    return (
        <div className="min-h-screen">
            {/* Header fijo */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                            <Image
                                src="/assets/brand/logo-black.ico"
                                height={32}
                                width={140}
                                alt="logo"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800">
                            {ROLES_NOMBRE[usuario.rolId] || "Usuario"}
                        </span>
                    </div>

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
                </div>
            </header>

            {/* Menú móvil */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="fixed inset-0 z-30 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)} />
                    <nav className="absolute inset-x-0 z-40 border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="mt-2 flex w-full items-center justify-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                        >
                            <LogOut className="size-4" />
                            Cerrar Sesión
                        </Button>
                    </nav>
                </div>
            )}

            {/* Contenido principal */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">
                        Bienvenid@, {usuario.nombres} 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Panel de {ROLES_NOMBRE[usuario.rolId] || "Usuario"}
                    </p>
                </div>
                {children}
            </main>
        </div>
    );
}