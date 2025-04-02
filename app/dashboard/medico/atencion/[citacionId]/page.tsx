"use client";

import { ArrowLeft, Save, FileClock, BadgeAlert, HeartPulse, Activity, Clock, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import DatosClinicosForm from '@/src/components/forms/DatosClinicosForm';
import DiagnosticoForm from '@/src/components/forms/DiagnosticoForm';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { formatearFecha } from '@/src/lib/utils';
import { useAuth } from '@/src/providers/auth-provider';
// import { citacionesService } from '@/src/services/citaciones';
import { Citacion, Triaje } from '@/src/types';


// import { atencionesService } from '@/src/services/atenciones';

type AtencionPageProps = {
    params: {
        citacionId: string;
    };
};

export default function AtencionPage({ params }: AtencionPageProps) {
    const router = useRouter();
    const { usuario } = useAuth();
    const citacionId = parseInt(params.citacionId);

    const [citacion, setCitacion] = useState<Citacion | null>(null);
    const [triaje, setTriaje] = useState<Triaje | null>(null);
    const [atencionId, setAtencionId] = useState<number | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tabActiva, setTabActiva] = useState('datos-clinicos');
    const [horaInicio, setHoraInicio] = useState<Date | null>(null);

    // Cargar datos de la citación y el paciente
    useEffect(() => {
        const cargarDatosCitacion = async () => {
            if (!citacionId) return;

            setCargando(true);
            setError(null);

            try {
                // // Cargar datos de la citación
                // const citacionData = await citacionesService.obtenerCitacionPorId(citacionId);
                // setCitacion(citacionData);

                // // Cargar triaje del paciente
                // if (citacionData.pacienteId) {
                //     const triajeData = await atencionesService.obtenerTriajePaciente(citacionData.pacienteId);
                //     setTriaje(triajeData);
                // }

                // // Verificar si ya existe una atención médica para esta citación
                // const atencionExistente = await atencionesService.verificarAtencionExistente(citacionId);
                // if (atencionExistente) {
                //     setAtencionId(atencionExistente.id);
                // } else {
                //     // Iniciar nueva atención médica
                //     const nuevaAtencion = await atencionesService.iniciarAtencion({
                //         citacionId,
                //         medicoId: usuario?.id,
                //         fechaHoraInicio: new Date().toISOString(),
                //         estado: 'EN_PROCESO'
                //     });
                //     setAtencionId(nuevaAtencion.id);
                //     setHoraInicio(new Date());
                // }

            } catch (err: any) {
                console.error('Error al cargar datos de la citación:', err);
                setError('No se pudieron cargar los datos. Por favor, intente nuevamente.');
            } finally {
                setCargando(false);
            }
        };

        cargarDatosCitacion();

        // Iniciar temporizador de atención
        setHoraInicio(new Date());

        // Cleanup al desmontar el componente
        return () => {
            // Aquí podríamos guardar una versión parcial si el usuario sale sin finalizar
        };
    }, [citacionId, usuario?.id]);

    // Manejar envío de datos clínicos
    const handleDatosClinicosSubmit = async (datos: any) => {
        if (!atencionId || !citacion?.pacienteId) return;

        setGuardando(true);

        try {
            // // Guardar datos clínicos
            // await atencionesService.guardarDatosClinicos({
            //     pacienteId: citacion.pacienteId,
            //     atencionId,
            //     ...datos
            // });

            // // Cambiar a la pestaña de diagnóstico
            // setTabActiva('diagnostico');
        } catch (err) {
            console.error('Error al guardar datos clínicos:', err);
            setError('Error al guardar datos clínicos. Intente nuevamente.');
        } finally {
            setGuardando(false);
        }
    };

    // Manejar envío de diagnóstico y finalización
    const handleDiagnosticoSubmit = async (datos: any) => {
        if (!atencionId || !citacion) return;

        setGuardando(true);

        try {
            // // Guardar diagnóstico
            // await atencionesService.guardarDiagnostico({
            //     atencionId,
            //     pacienteId: citacion.pacienteId,
            //     ...datos
            // });

            // // Finalizar atención
            // await atencionesService.finalizarAtencion(atencionId, {
            //     fechaHoraFin: new Date().toISOString(),
            //     estado: 'COMPLETADA'
            // });

            // // Actualizar estado de la citación
            // await citacionesService.actualizarEstadoCitacion(citacion.id, 'ATENDIDA');

            // // Redireccionar al dashboard
            // router.push('/dashboard/medico?atencion=completada');
        } catch (err) {
            console.error('Error al finalizar atención:', err);
            setError('Error al finalizar la atención. Intente nuevamente.');
        } finally {
            setGuardando(false);
        }
    };

    // Calcular duración de la atención
    const calcularDuracion = () => {
        if (!horaInicio) return '00:00';

        const ahora = new Date();
        const diffMs = ahora.getTime() - horaInicio.getTime();
        const diffMinutos = Math.floor(diffMs / 60000);
        const minutos = diffMinutos % 60;
        const horas = Math.floor(diffMinutos / 60);

        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    };

    // Función para volver al dashboard
    const volverADashboard = async () => {
        // if (atencionId) {
        //     // Guardar estado parcial antes de salir
        //     try {
        //         await atencionesService.actualizarAtencion(atencionId, {
        //             estado: 'EN_PROCESO',
        //             notasMedicas: 'Atención interrumpida temporalmente'
        //         });
        //     } catch (err) {
        //         console.error('Error al guardar estado parcial:', err);
        //     }
        // }

        // router.push('/dashboard/medico');
    };

    if (cargando) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="size-10 animate-spin rounded-full border-y-2 border-green-500"></div>
                    <p className="mt-4">Cargando datos del paciente...</p>
                </div>
            </div>
        );
    }

    if (!citacion) {
        return (
            <div className="space-y-4">
                <Button onClick={volverADashboard} variant="outline">
                    <ArrowLeft className="mr-2 size-4" />
                    Volver al Dashboard
                </Button>

                <Alert variant="destructive">
                    <BadgeAlert className="size-4" />
                    <AlertDescription>
                        No se encontró la citación o no tiene permisos para acceder a ella.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header de la atención */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Button onClick={volverADashboard} variant="outline" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Atención Médica</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {/* {citacion.paciente?.nombres} {citacion.paciente?.apellidos} */}
                            Nombres Apellidos paciente
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Clock className="size-4" />
                        <span>{calcularDuracion()}</span>
                    </div>

                    <Button
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
                        onClick={() => setTabActiva('diagnostico')}
                    >
                        <Save className="mr-1 size-4" />
                        Finalizar
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <BadgeAlert className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Panel lateral con información del paciente */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Tarjeta de información del paciente */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-3 flex items-center gap-2">
                            <User className="size-5 text-slate-400" />
                            <h2 className="text-lg font-medium">Información del Paciente</h2>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Identificación:</span>
                                {/* <span>{citacion.paciente?.tipoIdentificacion.toUpperCase()}: {citacion.paciente?.identificacion}</span> */}
                                ID: Numero
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Edad:</span>
                                <span>{triaje?.edad || 'No disponible'} años</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Teléfono:</span>
                                {/* <span>{citacion.paciente?.celular || 'No disponible'}</span> */}
                                Disponible?
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Cita programada:</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-4 text-slate-400" />
                                    <span>{formatearFecha(citacion.horaProgramada, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Campaña:</span>
                                {/* <span>{citacion.campana?.nombre || 'No disponible'}</span> */}
                                Nombre campaña
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de factores de riesgo */}
                    {triaje && (
                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="mb-3 flex items-center gap-2">
                                <HeartPulse className="size-5 text-red-500" />
                                <h2 className="text-lg font-medium">Factores de Riesgo</h2>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Riesgo cardiovascular:</span>
                                    <div className="flex items-center">
                                        <span className={`mr-2 font-medium ${triaje.resultadoRiesgoCv > 0.7 ? 'text-red-500' :
                                            triaje.resultadoRiesgoCv > 0.4 ? 'text-amber-500' :
                                                'text-green-500'
                                            }`}>
                                            {Math.round(triaje.resultadoRiesgoCv * 100)}%
                                        </span>
                                        <div className="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-700">
                                            <div
                                                className={`h-2 rounded-full ${triaje.resultadoRiesgoCv > 0.7 ? 'bg-red-500' :
                                                    triaje.resultadoRiesgoCv > 0.4 ? 'bg-amber-500' :
                                                        'bg-green-500'
                                                    }`}
                                                style={{ width: `${triaje.resultadoRiesgoCv * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`flex items-center gap-1 rounded px-2 py-1 ${triaje.tabaquismo ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        <div className="size-2 rounded-full bg-current"></div>
                                        <span>Tabaquismo</span>
                                    </div>

                                    <div className={`flex items-center gap-1 rounded px-2 py-1 ${triaje.alcoholismo ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        <div className="size-2 rounded-full bg-current"></div>
                                        <span>Alcoholismo</span>
                                    </div>

                                    <div className={`flex items-center gap-1 rounded px-2 py-1 ${triaje.diabetes ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        <div className="size-2 rounded-full bg-current"></div>
                                        <span>Diabetes</span>
                                    </div>

                                    <div className={`flex items-center gap-1 rounded px-2 py-1 ${triaje.antecedentesCardiacos ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        <div className="size-2 rounded-full bg-current"></div>
                                        <span>Antecedentes</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Presión arterial:</span>
                                        <span>{triaje.presionSistolica}/{triaje.presionDiastolica} mmHg</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Colesterol total:</span>
                                        <span>{triaje.colesterolTotal} mg/dL</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">HDL:</span>
                                        <span>{triaje.hdl} mg/dL</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">IMC:</span>
                                        <span>{triaje.imc} kg/m²</span>
                                    </div>
                                </div>

                                {triaje.descripcion && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-slate-500">Observaciones del triaje:</p>
                                            <p className="mt-1 text-sm">{triaje.descripcion}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Formularios de atención médica */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full">
                            <TabsList className="mb-0 grid w-full grid-cols-2 rounded-t-lg bg-slate-100 p-0 dark:bg-slate-800">
                                <TabsTrigger
                                    value="datos-clinicos"
                                    className="rounded-none rounded-tl-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                                >
                                    <Activity className="mr-2 size-4" />
                                    Datos Clínicos
                                </TabsTrigger>
                                <TabsTrigger
                                    value="diagnostico"
                                    className="rounded-none rounded-tr-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                                >
                                    <FileClock className="mr-2 size-4" />
                                    Diagnóstico y Tratamiento
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="datos-clinicos" className="p-4">
                                <DatosClinicosForm
                                    onSubmit={handleDatosClinicosSubmit}
                                    isSubmitting={guardando}
                                    initialData={triaje}
                                />
                            </TabsContent>

                            <TabsContent value="diagnostico" className="p-4">
                                <DiagnosticoForm
                                    onSubmit={handleDiagnosticoSubmit}
                                    isSubmitting={guardando}
                                    pacienteId={citacion.pacienteId}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}