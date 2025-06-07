"use client";

import {
    UserPlus,
    // Calendar,
    RefreshCw,
    Search,
    AlertCircle,
    PlusCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { StatCard } from '@/src/components/StatCard';
import { StatusBadge } from '@/src/components/StatusBadge';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { CAMPANAS_MOCK, ROLES } from '@/src/constants';
// import { useAuth } from '@/src/providers/auth-provider';
import { usuariosService } from '@/src/services/usuarios';
import { UsuarioAccedido } from '@/src/types';

export default function EntidadPage() {
    const router = useRouter();
    // const { usuario } = useAuth();
    const [busqueda, setBusqueda] = useState('');
    const [embajadores, setEmbajadores] = useState<UsuarioAccedido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar embajadores desde la API
    const cargarEmbajadores = async () => {
        setCargando(true);
        setError(null);
        try {
            // Obtener usuarios con rol de embajador (rolId: 7)
            const embajadoresData = await usuariosService.obtenerUsuariosPorRol(ROLES.EMBAJADOR);
            setEmbajadores(embajadoresData);
        } catch (err: any) {
            console.error('Error al cargar embajadores:', err);
            setError('No se pudieron cargar los embajadores. Por favor, intente de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    // Cargar datos al iniciar
    useEffect(() => {
        cargarEmbajadores();
    }, []);

    // Filtrar embajadores según búsqueda
    const embajadoresFiltrados = embajadores.filter(
        e =>
            e.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.identificacion.includes(busqueda)
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
                    count={CAMPANAS_MOCK.length}
                    label="Campañas Postuladas"
                    icon="/assets/icons/calendar.svg"
                />

                <StatCard
                    type="ejecucion"
                    count={CAMPANAS_MOCK.filter(c => c.estatus === 'ejecucion').length}
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
                        Postular Campaña
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
                                                    {embajador.nombres} {embajador.apellidos}
                                                </td>
                                                <td className="py-3">
                                                    {embajador.tipoIdentificacion.toUpperCase()}: {embajador.identificacion}
                                                </td>
                                                <td className="py-3">{embajador.celular}</td>
                                                <td className="py-3 text-slate-600 dark:text-slate-400">{embajador.correo}</td>
                                                <td className="py-3 text-slate-600 dark:text-slate-400">
                                                    {/* Aquí iría la localidad si se guarda en un campo adicional */}
                                                    Localidad
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
                            {CAMPANAS_MOCK.map(campana => (
                                <div key={campana.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                                    <div>
                                        <h3 className="font-medium">{campana.nombre}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {campana.pacientes} pacientes • {campana.fecha}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge estatus={campana.estatus as any} />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/entidad/campanas/${campana.id}`)}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {CAMPANAS_MOCK.length === 0 && (
                                <div className="py-10 text-center text-slate-500">
                                    No hay campañas postuladas
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}