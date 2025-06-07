"use client";

import { Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import TriajeForm from '@/src/components/forms/TriajeForm';
import { StatCard } from '@/src/components/StatCard';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/providers/auth-provider';
import apiClient from '@/src/services/api';
import { Triaje, Campana } from '@/src/types';

// import TriajeForm from '@/src/components/forms/TriajeForm';
// import { campanasService } from '@/src/services/campanas';
// import { triajeService } from '@/src/services/triaje';

// import CampanaCard from '@/src/components/CampanaCard';
// import { Triaje, Campana } from '@/src/types';

export default function PacientePage() {
    const router = useRouter();
    const { usuario } = useAuth();
    const [triaje, setTriaje] = useState<Triaje | null>(null);
    const [campanas, setCampanas] = useState<Campana[]>([]);
    const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([]);
    const [pacienteId, setPacienteId] = useState<number | null>(null);

    const [cargandoTriaje, setCargandoTriaje] = useState(true);
    const [cargandoCampanas, setCargandoCampanas] = useState(true);
    const [cargandoPaciente, setCargandoPaciente] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarTriajeForm, setMostrarTriajeForm] = useState(false);

    // Primero obtenemos el pacienteId
    useEffect(() => {
        const obtenerPaciente = async () => {
            if (!usuario?.id || !usuario?.token) {
                console.log("⏳ Esperando datos del usuario...")
                return;
            }

            setCargandoPaciente(true);
            console.log("🔍 Obteniendo datos del paciente para usuario:", usuario.id);

            try {
                const response = await apiClient.get(`/pacientes/usuario/${usuario.id}`, {
                    headers: {
                        'Authorization': `Bearer ${usuario.token}`
                    }
                });

                console.log("✅ Paciente encontrado:", response.data.id);
                setPacienteId(response.data.id);
            } catch (err: any) {
                console.error("❌ Error al obtener paciente:", err);
                if (err.response?.status === 404) {
                    console.log("🔄 Redirigiendo a completar perfil...");
                    router.push('/dashboard/paciente/completar-perfil');
                    return;
                }
                setError("Error al obtener datos del paciente");
            } finally {
                setCargandoPaciente(false);
            }
        };

        obtenerPaciente();
    }, [usuario?.id, usuario?.token, router]);

    const cargarCampanas = async () => {
        if (!pacienteId || !usuario?.token) {
            console.log("⏳ Esperando pacienteId o token para cargar campañas...");
            return;
        }

        setCargandoCampanas(true);
        console.log("🔍 Cargando campañas para paciente:", pacienteId);

        try {
            // Cargar todas las campañas disponibles
            const responseCampanas = await apiClient.get('/campanas', {
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });
            const todasCampanas = responseCampanas.data;
            setCampanasDisponibles(todasCampanas);

            // Cargar inscripciones del paciente
            const responseInscripciones = await apiClient.get(`/inscripciones-campana/paciente/${pacienteId}`, {
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });
            const inscripciones = responseInscripciones.data;

            // Filtrar las campañas en las que está inscrito
            const campanasInscritas = todasCampanas.filter((campana: Campana) =>
                inscripciones.some((inscripcion: any) =>
                    inscripcion.campanaId === campana.id &&
                    inscripcion.estado === 'INSCRITO'
                )
            );
            setCampanas(campanasInscritas);
            console.log("✅ Campañas cargadas:", campanasInscritas.length);
        } catch (err: any) {
            console.error('❌ Error al cargar campañas:', err);
            setError('Error al cargar las campañas. Intente nuevamente.');
        } finally {
            setCargandoCampanas(false);
        }
    };

    // Cargar campañas solo cuando tengamos pacienteId
    useEffect(() => {
        if (pacienteId && usuario?.token && !cargandoPaciente) {
            console.log("🔄 Iniciando carga de campañas...");
            cargarCampanas();
        }
    }, [pacienteId, usuario?.token, cargandoPaciente]);

    // Cargar triaje inicial del paciente
    useEffect(() => {
        const cargarTriaje = async () => {
            if (!pacienteId || !usuario?.token || cargandoPaciente) {
                console.log("⏳ Esperando datos para cargar triaje...");
                return;
            }

            setCargandoTriaje(true);
            setError(null);
            console.log("🔍 Cargando triaje para paciente:", pacienteId);

            try {
                const response = await apiClient.get(`/triaje/paciente/${pacienteId}`, {
                    headers: {
                        'Authorization': `Bearer ${usuario.token}`
                    }
                });

                const triajes = response.data;
                // Tomamos el triaje más reciente
                const ultimoTriaje = triajes.length > 0 ? triajes[0] : null;
                setTriaje(ultimoTriaje);

                console.log("✅ Triaje cargado:", ultimoTriaje ? "encontrado" : "no encontrado");

                // Si no hay triaje, redirigir a crearlo
                if (!ultimoTriaje) {
                    console.log("🔄 Redirigiendo a triaje inicial...");
                    router.push('/dashboard/paciente/triaje-inicial');
                }
            } catch (err: any) {
                console.error('❌ Error al cargar triaje:', err);
                setError('No se pudo cargar la información médica. Intente nuevamente.');
            } finally {
                setCargandoTriaje(false);
            }
        };

        if (pacienteId && usuario?.token && !cargandoPaciente) {
            console.log("🔄 Iniciando carga de triaje...");
            cargarTriaje();
        }
    }, [pacienteId, usuario?.token, cargandoPaciente, router]);

    // Manejar envío del formulario de triaje
    const handleTriajeSubmit = async (datosTriaje: any) => {
        if (!pacienteId || !usuario?.token) return;

        try {
            const response = await apiClient.post('/triaje', {
                ...datosTriaje,
                pacienteId,
                fechaTriaje: new Date()
            }, {
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });

            const nuevoTriaje = response.data;
            setTriaje(nuevoTriaje);
            setMostrarTriajeForm(false);
        } catch (err: any) {
            console.error('Error al guardar triaje:', err);
            setError('Error al guardar la información médica. Intente nuevamente.');
        }
    };

    // Si el usuario aún no tiene triaje, mostrar el formulario
    if (mostrarTriajeForm) {
        return (
            <div className="space-y-6">
                <div className="bg-card rounded-lg border p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold">Evaluación Inicial de Salud</h2>
                    <p className="text-muted-foreground mb-6">
                        Antes de continuar, necesitamos recopilar información básica sobre su salud
                        para brindarle la mejor atención posible.
                    </p>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="size-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <TriajeForm onSubmit={handleTriajeSubmit} />
                </div>
            </div>
        );
    }

    // Si está cargando datos iniciales, mostrar indicador
    if (cargandoPaciente || (cargandoTriaje && !error)) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                    <p className="mt-2 text-slate-500">
                        {cargandoPaciente ? "Cargando perfil..." : "Cargando información médica..."}
                    </p>
                </div>
            </div>
        );
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
                        onClick={cargarCampanas}
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
                    <div className="space-y-4">
                        {campanas.map(campana => (
                            <div key={campana.id} className="rounded-lg border p-4">
                                <h3 className="font-semibold">{campana.nombre}</h3>
                                <p className="text-sm text-slate-500">{campana.descripcion}</p>
                                <div className="mt-2 text-sm">
                                    <span className="font-medium">Estado:</span> {campana.estatus}
                                </div>
                            </div>
                        ))}
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
    );
}