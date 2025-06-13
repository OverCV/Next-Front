"use client"

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import RegistroMedicoForm from '@/src/components/forms/RegistroMedicoForm'
import { Button } from '@/src/components/ui/button'

export default function RegistrarMedicoPage() {
    return (
        <div className="space-y-6">
            {/* Navegación */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/entidad">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Registrar Médico</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Registra un nuevo médico para tu entidad de salud
                        </p>
                    </div>
                </div>
            </div>

            {/* Layout con formulario e imagen */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Formulario de Registro */}
                <div className="order-2 lg:order-1">
                    <RegistroMedicoForm />
                </div>

                {/* Imagen decorativa */}
                <div className="order-1 flex items-center justify-center lg:order-2">
                    <div className="relative">
                        <Image
                            src="/assets/images/dr-sharma.png"
                            alt="Médico profesional"
                            width={300}
                            height={300}
                            className="rounded-lg"
                            priority
                        />
                        <div className="absolute -bottom-4 -right-4 rounded-lg bg-green-100 p-3">
                            <div className="flex items-center space-x-2 text-green-800">
                                <span className="size-2 rounded-full bg-green-600"></span>
                                <span className="text-sm font-medium">Registro Médico</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 