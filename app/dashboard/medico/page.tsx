"use client";

import { Calendar, User, ClipboardList, Clock, RefreshCw, AlertCircle } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { StatCard } from '@/src/components/StatCard';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { formatearFecha } from '@/src/lib/utils';
import { useAuth } from '@/src/providers/auth-provider';
// import { citacionesService } from '@/src/services/citaciones';
// import { citacionesService } from '@/src/services/citaciones';
// import { Citacion } from '@/src/types';

// import CitacionesDiarias from '@/src/components/medicos/CitacionesDiarias';
// import PacientesEspera from '@/src/components/medicos/PacientesEspera';
// import { Badge } from '@/src/components/ui/badge';
// import { pacientesService } from '@/src/services/pacientes';


export default function MedicoPage() {
    // const router = useRouter();
    const { usuario } = useAuth();
    const [busqueda, setBusqueda] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
    // const [citaciones, setCitaciones] = useState<Citacion[]>([]);
    // const [pacientesAtendidos, setPacientesAtendidos] = useState<number>(0);
    // const [pacientesPendientes, setPacientesPendientes] = useState<number>(0);
    // const [pacientesTotal, setPacientesTotal] = useState<number>(0);
    // const [campanasActivas, setCampanasActivas] = useState<number>(0);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatosMedico = async () => {
            if (!usuario?.id) return;

            setCargando(true);
            setError(null);

            try {
                // // Cargar citaciones para la fecha seleccionada
                // const citacionesData = await citacionesService.obtenerCitacionesMedico(
                //     usuario.id,
                //     fechaSeleccionada
                // );
                // setCitaciones(citacionesData);

                // // Obtener estadísticas
                // const estadisticas = await citacionesService.obtenerEstadisticasMedico(usuario.id);
                // setPacientesAtendidos(estadisticas.atendidos || 0);
                // setPacientesPendientes(estadisticas.pendientes || 0);
                // setPacientesTotal(estadisticas.total || 0);
                // setCampanasActivas(estadisticas.campanasActivas || 0);
            } catch (err: any) {
                console.error('Error al cargar datos del médico:', err);
                setError('No se pudieron cargar los datos. Por favor, intente nuevamente.');
            } finally {
                setCargando(false);
            }
        };

        cargarDatosMedico();
    }, [usuario?.id, fechaSeleccionada]);

    // Filtrar citaciones según búsqueda
    // const citacionesFiltradas = citaciones.filter(
    //     c => {
    //         // const pacienteNombre = `${c.paciente?.nombres} ${c.paciente?.apellidos}`.toLowerCase();
    //         // return pacienteNombre.includes(busqueda.toLowerCase()) ||
    //         // c.paciente?.identificacion.includes(busqueda);
    //     }
    // );

    // Separar citaciones por estado
    // const citacionesPendientes = citacionesFiltradas.filter(c => c.estado === 'AGENDADA');
    // const citacionesAtendidas = citacionesFiltradas.filter(c => c.estado === 'ATENDIDA');
    // const citacionesCanceladas = citacionesFiltradas.filter(c => c.estado === 'CANCELADA');

    // Función para manejar la atención de un paciente
    // const iniciarAtencion = (citacionId: number) => {
    //     router.push(`/dashboard/medico/atencion/${citacionId}`);
    // };

    // Función para ver historial de un paciente
    // const verHistorialPaciente = (pacienteId: number) => {
    //     router.push(`/dashboard/medico/paciente/${pacienteId}`);
    // };

    // Función para recalcular prioridades
    const recalcularPrioridades = async () => {
        setCargando(true);
        try {
            // await citacionesService.recalcularPrioridades(usuario?.id);
            // // Recargar citaciones
            // const citacionesData = await citacionesService.obtenerCitacionesMedico(
            //     usuario?.id,
            //     fechaSeleccionada
            // );
            // setCitaciones(citacionesData);
        } catch (err) {
            console.error('Error al recalcular prioridades:', err);
            setError('No se pudieron recalcular las prioridades. Intente nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    // Cambiar fecha seleccionada
    const cambiarFecha = (fecha: Date) => {
        setFechaSeleccionada(fecha);
    };

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
                    count={42}
                    label="Pacientes Atendidos"
                    icon="/assets/icons/user-check.svg"
                />

                <StatCard
                    type="postulada"
                    count={42}
                    label="Pacientes Pendientes"
                    icon="/assets/icons/user-clock.svg"
                />

                <StatCard
                    type="ejecucion"
                    count={42}
                    label="Total Pacientes"
                    icon="/assets/icons/users.svg"
                />

                <StatCard
                    type="postulada"
                    count={42}
                    label="Campañas Activas"
                    icon="/assets/icons/calendar.svg"
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
                        onClick={recalcularPrioridades}
                        disabled={cargando}
                        title="Recalcular prioridades"
                    >
                        <RefreshCw className={`size-4 ${cargando ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </section>

            {/* Contenido principal */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <Tabs defaultValue="espera" className="w-full">
                    <TabsList className="mb-4 grid w-full grid-cols-3">
                        <TabsTrigger value="espera" className="flex items-center gap-2">
                            <Clock className="size-4" />
                            <span>En Espera</span>
                            1
                            {/* <Badge variant="outline" className="ml-1">
                                {citacionesPendientes.length} 
                                1
                            </Badge> */}
                        </TabsTrigger>
                        <TabsTrigger value="programadas" className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>Programadas</span>
                            {/* <Badge variant="outline" className="ml-1">
                                 {citaciones.length} 
                                42
                            </Badge> */}
                        </TabsTrigger>
                        <TabsTrigger value="historial" className="flex items-center gap-2">
                            <ClipboardList className="size-4" />
                            <span>Atendidas</span>
                            {/* <Badge variant="outline" className="ml-1">
                                {citacionesAtendidas.length}
                                3
                            </Badge> */}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="espera" className="mt-0">
                        {/* <PacientesEspera
                            citaciones={42}
                            // citaciones={citacionesPendientes}
                            cargando={cargando}
                            onAtender={iniciarAtencion}
                            onVerHistorial={verHistorialPaciente}
                        /> */}
                    </TabsContent>

                    <TabsContent value="programadas" className="mt-0">
                        {/* <CitacionesDiarias
                            citaciones={citaciones}
                            cargando={cargando}
                            onAtender={iniciarAtencion}
                            onVerHistorial={verHistorialPaciente}
                        /> */}
                    </TabsContent>

                    <TabsContent value="historial" className="mt-0">
                        {/* <CitacionesDiarias
                            // citaciones={citacionesAtendidas}
                            citaciones={42}
                            cargando={cargando}
                            onVerHistorial={verHistorialPaciente}
                            soloHistorial={true}
                        /> */}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}