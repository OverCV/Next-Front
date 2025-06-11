"use client";

import {
    UserPlus,
    RefreshCw,
    Search,
    AlertCircle,
    PlusCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { StatCard } from '@/src/components/StatCard';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { CampanaModel, Embajador, Usuario } from '@/src/types';
import { CampanaService } from '@/src/services/CampanaService';
import EmbajadorEntidadService from '@/src/services/EmbajadorEntidadService';
import { useAuth } from '@/src/providers/auth-provider';

export default function EntidadPage() {
    const router = useRouter();
    const { usuario } = useAuth() as { usuario: Usuario | undefined };
    const [busqueda, setBusqueda] = useState('');
    const [embajadores, setEmbajadores] = useState<Embajador[]>([]);
    const [campanas, setCampanas] = useState<CampanaModel[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar embajadores desde la API
    const cargarEmbajadores = async () => {
        setCargando(true);
        setError(null);
        try {
            if (!usuario || !usuario.entidadSaludId) {
                setError('No hay una sesión activa. Inicie sesión nuevamente.');
                return;
            }
            const embajadoresEntidadData = await EmbajadorEntidadService.obtenerEmbajadoresPorEntidadId(usuario?.entidadSaludId);

            let embajadoresData = undefined;
            if (embajadoresEntidadData !== undefined) {
                embajadoresData = embajadoresEntidadData.map(emb => emb.embajador).filter((emb): emb is Embajador => emb !== null);
            }

            setEmbajadores(embajadoresData ?? []);
        } catch (err: any) {
            console.error('Error al cargar embajadores:', err);
            setError('No se pudieron cargar los embajadores. Por favor, intente de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    const cargarCampanas = async () => {
        setCargando(true);
        setError(null);
        try {
            if (!usuario || !usuario?.entidadSaludId) {
                setError('No hay una sesión activa. Inicie sesión nuevamente.');
                return;
            }

            const campanasData = await CampanaService.obtenerCampanasPorEntidad(usuario?.entidadSaludId);

            if (campanasData !== undefined && campanasData.length > 0) {
                setCampanas(campanasData);
            }
        } catch (err: any) {
            console.error('Error al cargar campañas:', err);
            setError('No se pudieron cargar las campañas. Por favor, intente de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    // Cargar datos al iniciar
    useEffect(() => {
        cargarEmbajadores();
        cargarCampanas();
    }, []);

    // Filtrar embajadores según búsqueda
    const embajadoresFiltrados = embajadores.filter(
        e =>
            e.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.telefono.includes(busqueda)
    );

    // Funciones de navegación
    const irARegistroEmbajador = () => {
        router.push('/dashboard/entidad/registrar-embajador');
    };

    const irAPostularCampana = () => {
        router.push('/dashboard/entidad/postular-campana');
    };

    // Función para recargar datos
    const recargarDatos = () => {
        cargarEmbajadores();
        cargarCampanas();
    };

    return (
        <div className="space-y-8">
            {/* Estadísticas */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    type="ejecucion"
                    count={embajadores.length}
                    label="Embajadores Registrados"
                    icon="/assets/icons/people.svg"
                />

                <StatCard
                    type="postulada"
                    count={campanas.length}
                    label="Campañas Postuladas"
                    icon="/assets/icons/calendar.svg"
                />

                <StatCard
                    type="ejecucion"
                    count={campanas.filter(c => c.estado?.toLowerCase() === 'ejecucion').length}
                    label="Campañas en Ejecución"
                    icon="/assets/icons/megaphone.svg"
                />
            </section>

            {/* Acciones principales */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                    <Button
                        onClick={irARegistroEmbajador}
                        className="flex items-center gap-2"
                    >
                        <UserPlus className="size-4" />
                        Registrar Embajador
                    </Button>

                    <Button
                        onClick={irAPostularCampana}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <PlusCircle className="size-4" />
                        Agregar Campaña
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar embajador..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={recargarDatos}
                        disabled={cargando}
                    >
                        <RefreshCw className={`size-4 ${cargando ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </section>

            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabs para Embajadores y Campañas */}
            <Tabs defaultValue="embajadores" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="embajadores">Embajadores</TabsTrigger>
                    <TabsTrigger value="campanas">Campañas</TabsTrigger>
                </TabsList>

                {/* Contenido de Embajadores */}
                <TabsContent value="embajadores" className="mt-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Embajadores Registrados</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Listado de embajadores registrados por esta entidad.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="h-8">
                                Filtrar
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="py-3 text-left font-medium">Nombre</th>
                                        <th className="py-3 text-left font-medium">Identificación</th>
                                        <th className="py-3 text-left font-medium">Teléfono</th>
                                        <th className="py-3 text-left font-medium">Correo</th>
                                        <th className="py-3 text-left font-medium">Localidad</th>
                                        <th className="py-3 text-right font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cargando ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center">
                                                <div className="flex justify-center">
                                                    <RefreshCw className="size-6 animate-spin text-slate-400" />
                                                </div>
                                                <p className="mt-2 text-slate-500">Cargando embajadores...</p>
                                            </td>
                                        </tr>
                                    ) : embajadoresFiltrados.length > 0 ? (
                                        embajadoresFiltrados.map((embajador) => (
                                            <tr
                                                key={embajador.id}
                                                className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                            >
                                                <td className="py-3 font-medium">
                                                    {embajador.nombreCompleto}
                                                </td>
                                                <td className="py-3">
                                                    {embajador.identificacion}
                                                </td>
                                                <td className="py-3">
                                                    {embajador.telefono}
                                                </td>
                                                <td className="py-3">
                                                    {embajador.correo}
                                                </td>
                                                <td className="py-3 text-slate-600 dark:text-slate-400">
                                                    {embajador.localidad}

                                                </td>
                                                <td className="py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8"
                                                        onClick={() => router.push(`/dashboard/entidad/embajadores/${embajador.id}`)}
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-slate-500">
                                                {busqueda ? 'No se encontraron embajadores que coincidan con la búsqueda' : 'No hay embajadores registrados'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>

                {/* Contenido de Campañas */}
                <TabsContent value="campanas" className="mt-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Campañas de Salud</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Campañas postuladas por esta entidad de salud.
                            </p>
                        </div>

                        <div className="space-y-4">
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
                                                <td className="py-4 text-slate-600 dark:text-slate-400 max-w-md truncate">{campana.descripcion}</td>
                                                <td className="py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${campana.estado.toLowerCase() === 'postulada' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
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
                                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        onClick={() => router.push(`/dashboard/entidad/campanas/${campana.id}`)}
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {campanas.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-10 text-center text-slate-500">
                                                    No hay campañas postuladas
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

