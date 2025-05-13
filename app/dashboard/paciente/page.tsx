"use client";

import { Calendar, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import TriajeForm from '@/src/components/forms/TriajeForm';
import { StatCard } from '@/src/components/StatCard';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/providers/auth-provider';
import { Triaje, Campana } from '@/src/types';
// import { useAuth } from '@/src/providers/auth-provider';

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
    const [error, setError] = useState<string | null>(null);
    const [mostrarTriajeForm, setMostrarTriajeForm] = useState(false);

    // Primero obtenemos el pacienteId
    useEffect(() => {
        const obtenerPaciente = async () => {
            if (!usuario?.id) return;

            try {
                const response = await fetch(`/api/pacientes/usuario/${usuario.id}`);

                // Si no existe el perfil del paciente, redirigir a completarlo
                if (response.status === 404) {
                    router.push('/dashboard/paciente/completar-perfil');
                    return;
                }

                if (!response.ok) throw new Error("Error al obtener datos del paciente");

                const paciente = await response.json();
                setPacienteId(paciente.id);
            } catch (err) {
                console.error("Error al obtener paciente:", err);
                setError("Error al obtener datos del paciente");
            }
        };

        obtenerPaciente();
    }, [usuario?.id, router]);

    const cargarCampanas = async () => {
        if (!pacienteId) return;

        setCargandoCampanas(true);

        try {
            // Cargar todas las campañas disponibles
            const responseCampanas = await fetch('/api/campana');
            if (!responseCampanas.ok) throw new Error("Error al obtener campañas");
            const todasCampanas = await responseCampanas.json();
            setCampanasDisponibles(todasCampanas);

            // Cargar inscripciones del paciente
            const responseInscripciones = await fetch(`/api/inscripciones-campana/paciente/${pacienteId}`);
            if (!responseInscripciones.ok) throw new Error("Error al obtener inscripciones");
            const inscripciones = await responseInscripciones.json();

            // Filtrar las campañas en las que está inscrito
            const campanasInscritas = todasCampanas.filter((campana: Campana) =>
                inscripciones.some((inscripcion: any) =>
                    inscripcion.campanaId === campana.id &&
                    inscripcion.estado === 'INSCRITO'
                )
            );
            setCampanas(campanasInscritas);
        } catch (err: any) {
            console.error('Error al cargar campañas:', err);
            setError('Error al cargar las campañas. Intente nuevamente.');
        } finally {
            setCargandoCampanas(false);
        }
    };

    // Cargar campañas inicialmente
    useEffect(() => {
        cargarCampanas();
    }, [pacienteId]);

    // Cargar triaje inicial del paciente
    useEffect(() => {
        const cargarTriaje = async () => {
            if (!pacienteId) return;

            setCargandoTriaje(true);
            setError(null);

            try {
                const response = await fetch(`/api/triaje/paciente/${pacienteId}`);
                if (!response.ok) throw new Error("Error al obtener triaje");

                const triajes = await response.json();
                // Tomamos el triaje más reciente
                const ultimoTriaje = triajes.length > 0 ? triajes[0] : null;
                setTriaje(ultimoTriaje);

                // Si no hay triaje, redirigir a crearlo
                if (!ultimoTriaje) {
                    router.push('/dashboard/paciente/triaje-inicial');

                }
            } catch (err: any) {
                console.error('Error al cargar triaje:', err);
                setError('No se pudo cargar la información médica. Intente nuevamente.');
            } finally {
                setCargandoTriaje(false);
            }
        };

        cargarTriaje();
    }, [pacienteId, router]);

    // Manejar envío del formulario de triaje
    const handleTriajeSubmit = async (datosTriaje: any) => {
        if (!pacienteId) return;

        try {
            const response = await fetch('/api/triaje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...datosTriaje,
                    pacienteId,
                    fechaTriaje: new Date()
                })
            });

            if (!response.ok) throw new Error("Error al crear triaje");

            const nuevoTriaje = await response.json();
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

    // Si está cargando, mostrar indicador
    if (cargandoTriaje) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <RefreshCw className="size-8 animate-spin text-slate-400" />
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