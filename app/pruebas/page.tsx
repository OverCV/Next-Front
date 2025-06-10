"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"

// Componente para probar vista del dashboard embajador
function ComponenteVistaEmbajador() {
    const router = useRouter()

    const [parametros, setParametros] = useState({
        ruta: "/dashboard/embajador",
        busquedaInicial: "",
        modoDemo: "true"
    })

    const navegarAVista = () => {
        const queryParams = new URLSearchParams({
            demo: parametros.modoDemo,
            busqueda: parametros.busquedaInicial
        })

        router.push(`${parametros.ruta}?${queryParams}`)
    }

    const actualizarParametro = (campo: string, valor: string) => {
        setParametros(prev => ({
            ...prev,
            [campo]: valor
        }))
    }

    return (
        <Card className="mb-6 w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Vista Dashboard Embajador
                </CardTitle>
                <div className="text-sm text-slate-500">
                    Ruta: <code className="rounded bg-slate-100 px-2 py-1">{parametros.ruta}</code>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                            placeholder="Busqueda inicial (ej: Juan)"
                            value={parametros.busquedaInicial}
                            onChange={(e) => actualizarParametro("busquedaInicial", e.target.value)}
                        />

                        <Input
                            placeholder="Modo demo (true/false)"
                            value={parametros.modoDemo}
                            onChange={(e) => actualizarParametro("modoDemo", e.target.value)}
                        />

                        <Button onClick={navegarAVista} className="w-full">
                            Probar Vista
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Componente para probar registro de paciente del embajador
function ComponenteVistaRegistroPaciente() {
    const router = useRouter()

    const [parametros, setParametros] = useState({
        ruta: "/dashboard/embajador/registrar-paciente",
        precargarDatos: "false",
        tipoId: "CC",
        identificacion: "",
        nombres: "",
        apellidos: ""
    })

    const navegarAVista = () => {
        const queryParams = new URLSearchParams({
            precarga: parametros.precargarDatos,
            tipo_id: parametros.tipoId,
            identificacion: parametros.identificacion,
            nombres: parametros.nombres,
            apellidos: parametros.apellidos
        })

        router.push(`${parametros.ruta}?${queryParams}`)
    }

    const actualizarParametro = (campo: string, valor: string) => {
        setParametros(prev => ({
            ...prev,
            [campo]: valor
        }))
    }

    return (
        <Card className="mb-6 w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Vista Registrar Paciente (Embajador)
                </CardTitle>
                <div className="text-sm text-slate-500">
                    Ruta: <code className="rounded bg-slate-100 px-2 py-1">{parametros.ruta}</code>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                            placeholder="Precargar datos (true/false)"
                            value={parametros.precargarDatos}
                            onChange={(e) => actualizarParametro("precargarDatos", e.target.value)}
                        />

                        <Input
                            placeholder="Tipo ID (CC, CE, TI, etc)"
                            value={parametros.tipoId}
                            onChange={(e) => actualizarParametro("tipoId", e.target.value)}
                        />

                        <Input
                            placeholder="Identificación"
                            value={parametros.identificacion}
                            onChange={(e) => actualizarParametro("identificacion", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                            placeholder="Nombres"
                            value={parametros.nombres}
                            onChange={(e) => actualizarParametro("nombres", e.target.value)}
                        />

                        <Input
                            placeholder="Apellidos"
                            value={parametros.apellidos}
                            onChange={(e) => actualizarParametro("apellidos", e.target.value)}
                        />

                        <Button onClick={navegarAVista} className="w-full">
                            Probar Vista
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Componente para probar triaje inicial
function ComponenteVistaTriajeInicial() {
    const router = useRouter()

    const [parametros, setParametros] = useState({
        ruta: "/dashboard/paciente/triaje-inicial",
        pacienteId: "",
        precargarSintomas: "false",
        nivelUrgencia: ""
    })

    const navegarAVista = () => {
        const queryParams = new URLSearchParams({
            paciente_id: parametros.pacienteId,
            precarga_sintomas: parametros.precargarSintomas,
            urgencia: parametros.nivelUrgencia
        })

        router.push(`${parametros.ruta}?${queryParams}`)
    }

    const actualizarParametro = (campo: string, valor: string) => {
        setParametros(prev => ({
            ...prev,
            [campo]: valor
        }))
    }

    return (
        <Card className="mb-6 w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Vista Triaje Inicial
                </CardTitle>
                <div className="text-sm text-slate-500">
                    Ruta: <code className="rounded bg-slate-100 px-2 py-1">{parametros.ruta}</code>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <Input
                            placeholder="ID Paciente"
                            value={parametros.pacienteId}
                            onChange={(e) => actualizarParametro("pacienteId", e.target.value)}
                        />

                        <Input
                            placeholder="Precargar síntomas (true/false)"
                            value={parametros.precargarSintomas}
                            onChange={(e) => actualizarParametro("precargarSintomas", e.target.value)}
                        />

                        <Input
                            placeholder="Nivel urgencia (ALTA, MEDIA, BAJA)"
                            value={parametros.nivelUrgencia}
                            onChange={(e) => actualizarParametro("nivelUrgencia", e.target.value)}
                        />

                        <Button onClick={navegarAVista} className="w-full">
                            Probar Vista
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


export default function PaginaPruebas() {
    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold">Página de Pruebas de Vistas</h1>
                <p className="text-slate-600">
                    Configura parámetros y prueba las diferentes vistas del aplicativo
                </p>
            </div>

            {/* Sección Embajador */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-800">🏥 Vistas de Embajador</h2>

                <ComponenteVistaEmbajador />
                <ComponenteVistaRegistroPaciente />
            </div>

            {/* Sección Paciente */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-800">👤 Vistas de Paciente</h2>

                <ComponenteVistaTriajeInicial />
            </div>
        </div>
    )
}