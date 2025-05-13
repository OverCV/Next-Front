"use client";

import {
    UserPlus,
    // Calendar,
    // Users,
    RefreshCw,
    Search,
    AlertCircle
} from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { StatCard } from '@/src/components/StatCard';
import { StatusBadge } from '@/src/components/StatusBadge';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { CAMPANAS_MOCK, ROLES } from '@/src/constants';
// import { formatearFecha } from '@/src/lib/utils';
// import { useAuth } from '@/src/providers/auth-provider';
import { usuariosService } from '@/src/services/usuarios';
import { Usuario } from '@/src/types';

export default function EmbajadorPage() {
    const router = useRouter();
    // const { usuario } = useAuth();
    const [busqueda, setBusqueda] = useState('');
    const [pacientes, setPacientes] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar pacientes desde la API
    const cargarPacientes = async () => {
        setCargando(true);
        setError(null);
        try {
            // Obtener usuarios con rol de paciente (rolId: 6)
            const pacientesData = await usuariosService.obtenerUsuariosPorRol(ROLES.PACIENTE);
            setPacientes(pacientesData);
        } catch (err: any) {
            console.error('Error al cargar pacientes:', err);
            setError('No se pudieron cargar los pacientes. Por favor, intente de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    // Cargar datos al iniciar
    useEffect(() => {
        cargarPacientes();
    }, []);

    // Filtrar pacientes según búsqueda
    const pacientesFiltrados = pacientes.filter(
        p =>
            p.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.identificacion.includes(busqueda)
    );

    // Función para registrar nuevo paciente
    const irARegistroPaciente = () => {
        router.push('/dashboard/embajador/registrar-paciente');
    };

    // Función para recargar datos
    const recargarDatos = () => {
        cargarPacientes();
    };

    return (
        <div className="space-y-8">
            {/* Estadísticas */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    type="ejecucion"
                    count={pacientes.length}
                    label="Pacientes Registrados"
                    icon="/assets/icons/people.svg"
                />

                <StatCard
                    type="postulada"
                    count={CAMPANAS_MOCK.length}
                    label="Campañas Activas"
                    icon="/assets/icons/calendar.svg"
                />

                <StatCard
                    type="ejecucion"
                    count={CAMPANAS_MOCK.filter(c => c.estatus === 'ejecucion').length}
                    label="Campañas en Ejecución"
                    icon="/assets/icons/megaphone.svg"
                />
            </section>

            {/* Registrar Paciente y Buscador */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    onClick={irARegistroPaciente}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="size-4" />
                    Registrar Paciente
                </Button>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
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

            {/* Lista de Pacientes */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Pacientes Registrados</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Pacientes registrados en el sistema.
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
                                <th className="py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center">
                                        <div className="flex justify-center">
                                            <RefreshCw className="size-6 animate-spin text-slate-400" />
                                        </div>
                                        <p className="mt-2 text-slate-500">Cargando pacientes...</p>
                                    </td>
                                </tr>
                            ) : pacientesFiltrados.length > 0 ? (
                                pacientesFiltrados.map((paciente) => (
                                    <tr
                                        key={paciente.id}
                                        className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="py-3 font-medium">
                                            {paciente.nombres} {paciente.apellidos}
                                        </td>
                                        <td className="py-3">
                                            {paciente.tipoIdentificacion.toUpperCase()}: {paciente.identificacion}
                                        </td>
                                        <td className="py-3">{paciente.celular}</td>
                                        <td className="py-3 text-slate-600 dark:text-slate-400">{paciente.correo}</td>
                                        <td className="py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8"
                                                onClick={() => router.push(`/dashboard/embajador/pacientes/${paciente.id}`)}
                                            >
                                                Ver Detalles
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        {busqueda ? 'No se encontraron pacientes que coincidan con la búsqueda' : 'No hay pacientes registrados'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Campañas Asignadas */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Campañas Asignadas</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Campañas de salud en las que participas como embajador.
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
                                    onClick={() => router.push(`/dashboard/embajador/campanas/${campana.id}`)}
                                >
                                    Ver Detalles
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}