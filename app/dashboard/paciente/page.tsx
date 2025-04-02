"use client";

import { Calendar, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

import { StatCard } from '@/src/components/StatCard';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import TriajeForm from '@/src/components/forms/TriajeForm';
import { useAuth } from '@/src/providers/auth-provider';
// import { useAuth } from '@/src/providers/auth-provider';

// import TriajeForm from '@/src/components/forms/TriajeForm';
// import { campanasService } from '@/src/services/campanas';
// import { triajeService } from '@/src/services/triaje';

// import CampanaCard from '@/src/components/CampanaCard';
// import { Triaje, Campana } from '@/src/types';

export default function PacientePage() {
    const { usuario } = useAuth();
    const [triaje, setTriaje] = useState<Triaje | null>(null);
    const [campanas, setCampanas] = useState<Campana[]>([]);
    const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([]);

    const [cargandoTriaje, setCargandoTriaje] = useState(true);
    const [cargandoCampanas, setCargandoCampanas] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarTriajeForm, setMostrarTriajeForm] = useState(false);

    // Cargar triaje inicial del paciente
    useEffect(() => {
        const cargarTriaje = async () => {
            if (!usuario?.id) return;

            setCargandoTriaje(true);
            setError(null);

            try {
                // Intentar cargar el triaje del paciente
                const triajeData = await triajeService.obtenerTriajePorPaciente(usuario.id);
                setTriaje(triajeData);

                // Si no hay triaje, mostrar el formulario
                if (!triajeData) {
                    setMostrarTriajeForm(true);
                }
            } catch (err: any) {
                console.error('Error al cargar triaje:', err);
                setError('No se pudo cargar la información médica. Intente nuevamente.');
                setMostrarTriajeForm(true); // Mostrar formulario en caso de error también
            } finally {
                setCargandoTriaje(false);
            }
        };

        cargarTriaje();
    }, [usuario?.id]);

    // Cargar campañas del paciente
    useEffect(() => {
        const cargarCampanas = async () => {
            if (!usuario?.id) return;

            setCargandoCampanas(true);

            try {
                // Cargar campañas en las que el paciente está registrado
                const campanasData = await campanasService.obtenerCampanasPorPaciente(usuario.id);
                setCampanas(campanasData);

                // Cargar campañas disponibles
                const disponibles = await campanasService.obtenerCampanasDisponibles();
                setCampanasDisponibles(disponibles);
            } catch (err: any) {
                console.error('Error al cargar campañas:', err);
            } finally {
                setCargandoCampanas(false);
            }
        };

        cargarCampanas();
    }, [usuario?.id]);

    // Manejar envío del formulario de triaje
    const handleTriajeSubmit = async (datosTriaje: any) => {
        try {
            const nuevoTriaje = await triajeService.crearTriaje({
                pacienteId: usuario!.id,
                ...datosTriaje
            });

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
                    count={triaje?.nivelPrioridad === 'ALTA' ? 1 : 0}
                    label="Alertas de Salud"
                    icon="/assets/icons/alert-circle.svg"
                />

                <StatCard
                    type={triaje?.nivelPrioridad === 'ALTA' ? 'cancelada' : 'ejecucion'}
                    count={Math.round((triaje?.resultadoRiesgoCv || 0) * 100)}
                    label="Riesgo Cardiovascular"
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
                        onClick={() => { }}
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
                            <CampanaCard
                                key={campana.id}
                                campana={campana}
                                isRegistered={true}
                                onCancel={() => { }}
                                onDetails={() => { }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                        <Calendar className="mx-auto size-10 text-slate-400" />
                        <h3 className="mt-3 text-lg font-medium">No está registrado en ninguna campaña</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Consulte las campañas disponibles a continuación para registrarse.
                        </p>
                    </div>
                )}
            </div>

            {/* Campañas Disponibles */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Campañas Disponibles</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Campañas de salud a las que puede registrarse.
                    </p>
                </div>

                {cargandoCampanas ? (
                    <div className="py-8 text-center">
                        <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                        <p className="mt-2 text-slate-500">Cargando campañas disponibles...</p>
                    </div>
                ) : campanasDisponibles.length > 0 ? (
                    <div className="space-y-4">
                        {campanasDisponibles.map(campana => (
                            <CampanaCard
                                key={campana.id}
                                campana={campana}
                                isRegistered={false}
                                onRegister={() => { }}
                                onDetails={() => { }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                        <Heart className="mx-auto size-10 text-slate-400" />
                        <h3 className="mt-3 text-lg font-medium">No hay campañas disponibles</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            En este momento no hay campañas disponibles en su área.
                        </p>
                    </div>
                )}
            </div>

            {/* Información de Salud */}
            {triaje && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Mi Información de Salud</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Resultados de su evaluación de salud.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setMostrarTriajeForm(true)}
                        >
                            Actualizar Información
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                            <h3 className="mb-2 font-medium">Factores de Riesgo</h3>
                            <ul className="space-y-2 text-sm">
                                {triaje.tabaquismo && <li className="flex items-center gap-2">🚬 Tabaquismo</li>}
                                {triaje.alcoholismo && <li className="flex items-center gap-2">🍷 Alcoholismo</li>}
                                {triaje.diabetes && <li className="flex items-center gap-2">🩸 Diabetes</li>}
                                {triaje.antecedentesCardiacos && (
                                    <li className="flex items-center gap-2">❤️ Antecedentes cardíacos</li>
                                )}
                            </ul>
                        </div>

                        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                            <h3 className="mb-2 font-medium">Signos Vitales</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center justify-between">
                                    <span>Presión arterial:</span>
                                    <span className="font-medium">{triaje.presionSistolica}/{triaje.presionDiastolica} mmHg</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span>Colesterol total:</span>
                                    <span className="font-medium">{triaje.colesterolTotal} mg/dL</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span>Peso:</span>
                                    <span className="font-medium">{triaje.peso} kg</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span>IMC:</span>
                                    <span className="font-medium">{triaje.imc}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}