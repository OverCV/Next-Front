"use client";

import { Calendar, User, ClipboardList, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { StatCard } from '@/src/components/StatCard';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { formatearFecha } from '@/src/lib/utils';
import { useAuth } from '@/src/providers/auth-provider';
import apiClient from '@/src/services/api';
import { ENDPOINTS } from '@/src/services/auth/endpoints';
import { Campana } from '@/src/types';

// import CitacionesDiarias from '@/src/components/medicos/CitacionesDiarias';
// import PacientesEspera from '@/src/components/medicos/PacientesEspera';
// import { Badge } from '@/src/components/ui/badge';
// import { pacientesService } from '@/src/services/pacientes';

export default function MedicoPage() {
    const router = useRouter();
    const { usuario } = useAuth();
    const [busqueda, setBusqueda] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
    const [campanas, setCampanas] = useState<Campana[]>([]);
    const [campanasActivas, setCampanasActivas] = useState<Campana[]>([]);

    const [cargandoCampanas, setCargandoCampanas] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar campañas del médico
    const cargarMisCampanas = async () => {
        if (!usuario?.id) {
            console.log("⏳ Esperando datos del médico para cargar campañas...")
            return;
        }

        setCargandoCampanas(true);
        console.log("🔍 Cargando campañas para médico:", usuario.id);

        try {
            // Obtener todas las campañas (necesitamos endpoint específico para médicos)
            const responseCampanas = await apiClient.get(ENDPOINTS.CAMPANAS.TODAS);
            const todasCampanas = responseCampanas.data;

            // Filtrar campañas donde el médico está asignado
            // Por ahora mostramos todas, luego se puede filtrar por medicoId
            const campanasDelMedico = todasCampanas.filter((campana: Campana) =>
                campana.estado === 'EJECUCION' || campana.estado === 'POSTULADA'
            );

            setCampanas(campanasDelMedico);
            setCampanasActivas(campanasDelMedico.filter((c: Campana) => c.estado === 'EJECUCION'));

            console.log("✅ Campañas del médico cargadas:", campanasDelMedico.length);
        } catch (err: any) {
            console.error('❌ Error al cargar campañas del médico:', err);
            setError('Error al cargar las campañas. Intente nuevamente.');
        } finally {
            setCargandoCampanas(false);
        }
    };

    // Cargar campañas al montar el componente
    useEffect(() => {
        if (usuario?.id) {
            console.log("🔄 Iniciando carga de campañas del médico...")
            cargarMisCampanas();
        }
    }, [usuario?.id]);

    // Si está cargando datos iniciales, mostrar indicador
    if (cargandoCampanas) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                    <p className="mt-2 text-slate-500">Cargando campañas médicas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Mensajes de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Estadísticas */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    type="ejecucion"
                    count={campanasActivas.length}
                    label="Campañas Activas"
                    icon="/assets/icons/calendar.svg"
                />

                <StatCard
                    type="postulada"
                    count={campanas.length}
                    label="Total Campañas"
                    icon="/assets/icons/heart.svg"
                />

                <StatCard
                    type="ejecucion"
                    count={0}
                    label="Pacientes Atendidos Hoy"
                    icon="/assets/icons/user-check.svg"
                />

                <StatCard
                    type="postulada"
                    count={0}
                    label="Citas Pendientes"
                    icon="/assets/icons/clock.svg"
                />
            </section>

            {/* Fecha y buscador */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarFecha(new Date())}
                        className="flex items-center gap-2"
                    >
                        <Calendar className="size-4" />
                        Hoy
                    </Button>
                    <span className="font-medium">
                        {formatearFecha(fechaSeleccionada)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-xs">
                        <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar paciente..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={cargarMisCampanas}
                        disabled={cargandoCampanas}
                        title="Actualizar campañas"
                    >
                        <RefreshCw className={`size-4 ${cargandoCampanas ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </section>

            {/* Mis Campañas Médicas */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Mis Campañas Médicas</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Campañas asignadas donde puede atender pacientes.
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
                                                onClick={() => router.push(`/dashboard/medico/campanas/${campana.id}`)}
                                                disabled={campana.estado !== 'EJECUCION'}
                                            >
                                                {campana.estado === 'EJECUCION' ? 'Ver Pacientes' : 'No Disponible'}
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
                        <h3 className="mt-3 text-lg font-medium">No hay campañas asignadas</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Cuando sea asignado a campañas médicas, aparecerán aquí.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}