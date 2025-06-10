"use client"

import { Calendar, AlertCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { StatCard } from '@/src/components/StatCard'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/providers/auth-provider'
import apiClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { Triaje, Campana } from '@/src/types'

// import TriajeForm from '@/src/components/forms/TriajeForm'
// import { campanasService } from '@/src/services/campanas'
// import { triajeService } from '@/src/services/triaje'

// import CampanaCard from '@/src/components/CampanaCard'
// import { Triaje, Campana } from '@/src/types'

export default function PacientePage() {
    const router = useRouter()
    const { usuario } = useAuth()
    const [triaje, setTriaje] = useState<Triaje | null>(null)
    const [campanas, setCampanas] = useState<Campana[]>([])
    const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([])
    const [usuarioId, setPacienteId] = useState<number | null>(null)

    const [cargandoTriaje, setCargandoTriaje] = useState(true)
    const [cargandoCampanas, setCargandoCampanas] = useState(true)
    const [cargandoPaciente, setCargandoPaciente] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Primero obtenemos el pacienteId
    useEffect(() => {
        const obtenerPaciente = async () => {
            console.log("Datos usuario:", usuario)

            if (!usuario?.id) {
                console.log("⏳ Esperando datos del usuario...")
                return
            }

            setCargandoPaciente(true)
            console.log("🔍 Obteniendo datos del paciente para usuario:", usuario.id)

            try {
                // Usar endpoint centralizado
                const response = await apiClient.get(ENDPOINTS.PACIENTES.PERFIL(usuario.id))

                console.log("✅ Paciente encontrado:", response.data.id)
                setPacienteId(response.data.id)
            } catch (err: any) {
                console.error("❌ Error al obtener paciente:", err)
                if (err.response?.status === 404) {
                    console.log("🔄 Redirigiendo al acceso pues no existe el registro de paciente...")
                    router.push('/acceso')
                    return
                }
                setError("Error al obtener datos del paciente")
            } finally {
                setCargandoPaciente(false)
            }
        }

        obtenerPaciente()
    }, [usuario?.id, router])

    const cargarMisCampanas = async () => {
        if (!usuario?.id) {
            console.log("⏳ Esperando pacienteId para cargar campañas...")
            return
        }

        setCargandoCampanas(true)
        console.log("🔍 Cargando campañas para paciente:", usuario?.id)

        try {
            // Usar endpoint centralizado para inscripciones
            const responseCampanas = await apiClient.get(ENDPOINTS.CAMPANAS.INSCRIPCIONES.POR_USUARIO(usuario?.id))
            const todasCampanasInscritas = responseCampanas.data

            // Obtener detalles completos de cada campaña
            const campanasDetalladas = await Promise.all(
                todasCampanasInscritas.map(async (inscripcion: any) => {
                    try {
                        const responseCampana = await apiClient.get(ENDPOINTS.CAMPANAS.POR_ID(inscripcion.campanaId))
                        return {
                            ...responseCampana,
                            estado: inscripcion.estado,
                            fechaInscripcion: inscripcion.fechaInscripcion
                        }
                    } catch (err) {
                        console.error(`❌ Error al obtener detalles de campaña ${inscripcion.campanaId}:`, err)
                        return null
                    }
                })
            )

            console.log("Inscripciones: ", campanasDetalladas)

            // Filtrar campañas nulas y actualizar el array
            const campanasFiltradas = campanasDetalladas.filter(campana => campana !== null)

            setCampanasDisponibles(campanasFiltradas)
            // Filtrar las campañas en las que está inscrito
            /* const campanasInscritas = todasCampanasInscritas.filter((campana: Campana) =>
                todasCampanasInscritas.some((inscripcion: any) =>
                    inscripcion.campanaId === campana.id &&
                    inscripcion.estado === 'INSCRITO'
                )
            ) */

            setCampanas(campanasFiltradas)
            // console.log("✅ Campañas cargadas:", campanasFiltradas.length)
        } catch (err: any) {
            console.error('❌ Error al cargar campañas:', err)
            // setError('Error al cargar las campañas. Intente nuevamente.')
        } finally {
            setCargandoCampanas(false)
        }
    }

    // Cargar campañas solo cuando tengamos pacienteId
    useEffect(() => {
        if (usuarioId && !cargandoPaciente) {
            console.log("🔄 Iniciando carga de campañas...")
            cargarMisCampanas()
        }
    }, [usuarioId, cargandoPaciente])

    // Cargar triaje inicial del paciente
    useEffect(() => {
        const cargarTriaje = async () => {
            if (!usuarioId || cargandoPaciente) {
                console.log("⏳ Esperando datos para cargar triaje...")
                return
            }

            setCargandoTriaje(true)
            setError(null)
            console.log("🔍 Cargando triaje para paciente:", usuarioId)

            try {
                // Usar endpoint centralizado para triajes
                const response = await apiClient.get(ENDPOINTS.TRIAJES.POR_PACIENTE(usuarioId))

                const triajes = response.data
                // Tomamos el triaje más reciente
                const ultimoTriaje = triajes.length > 0 ? triajes[0] : null
                setTriaje(ultimoTriaje)

                console.log("✅ Triaje cargado:", ultimoTriaje ? "encontrado" : "no encontrado")

                // Si no hay triaje, redirigir a crearlo
                if (!ultimoTriaje) {
                    console.log("🔄 Redirigiendo a triaje inicial...")
                    router.push('/dashboard/paciente/triaje-inicial')
                }
            } catch (err: any) {
                console.error('❌ Error al cargar triaje:', err)
                setError('No se pudo cargar la información médica. Intente nuevamente.')
            } finally {
                setCargandoTriaje(false)
            }
        }

        if (usuarioId && !cargandoPaciente) {
            console.log("🔄 Iniciando carga de triaje...")
            cargarTriaje()
        }
    }, [usuarioId, cargandoPaciente, router])

    // Si está cargando datos iniciales, mostrar indicador
    if (cargandoPaciente || (cargandoTriaje && !error)) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                    <p className="mt-2 text-slate-500">
                        {cargandoPaciente ? "Cargando datos..." : "Cargando información médica..."}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Estadísticas */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    type="ejecucion"
                    count={campanas.length}
                    label="Campañas Activas"
                    icon="/assets/icons/calendar.svg"
                />

                <StatCard
                    type="postulada"
                    count={campanasDisponibles.length}
                    label="Campañas Disponibles"
                    icon="/assets/icons/calendar.svg"
                />

                <StatCard
                    type={triaje ? 'ejecucion' : 'cancelada'}
                    count={triaje ? 1 : 0}
                    label="Triajes Realizados"
                    icon="/assets/icons/heart.svg"
                />
            </section>

            {/* Mis Campañas */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Mis Campañas de Salud</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Campañas en las que está registrado actualmente.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={cargarMisCampanas}
                        disabled={cargandoCampanas}
                        className="h-8 gap-2"
                    >
                        <RefreshCw className={`size-4 ${cargandoCampanas ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>

                {cargandoCampanas ? (
                    <div className="py-8 text-center">
                        <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                        <p className="mt-2 text-slate-500">Cargando campañas...</p>
                    </div>
                ) : campanas.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="py-3 text-left font-medium">Nombre</th>
                                    <th className="py-3 text-left font-medium">Descripción</th>
                                    <th className="py-3 text-left font-medium">Pacientes</th>
                                    <th className="py-3 text-left font-medium">Fecha Inicio</th>
                                    <th className="py-3 text-left font-medium">Estado</th>
                                    <th className="py-3 text-right font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campanas.map(campana => (
                                    <tr key={campana.id} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                                        <td className="py-4 font-medium text-slate-900 dark:text-slate-100">{campana.nombre}</td>
                                        <td className="max-w-md truncate py-4 text-slate-600 dark:text-slate-400">{campana.descripcion}</td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {campana.pacientes || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 text-slate-600 dark:text-slate-400">
                                            {new Date(campana.fechaInicio).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campana.estado.toLowerCase() === 'postulada' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                campana.estado.toLowerCase() === 'ejecucion' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    campana.estado.toLowerCase() === 'finalizada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                {campana.estado}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                onClick={() => router.push(`/dashboard/paciente/campanas/${campana.id}`)}
                                            >
                                                Ver Detalles
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                        <Calendar className="mx-auto size-10 text-slate-400" />
                        <h3 className="mt-3 text-lg font-medium">No tiene registro en campaña alguna</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Explore las campañas disponibles y regístrese en las que le interesen.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}