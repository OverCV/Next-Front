// "use client";

// import { CheckCircle2, FileText, Clock, User, RefreshCw, Heart, AlertTriangle, RotateCw } from 'lucide-react';
// import { useState } from 'react';

// import { Button } from '@/src/components/ui/button';
// import { Citacion } from '@/src/types';

// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/components/ui/tooltip';


// type PacientesEsperaProps = {
//     citaciones: Citacion[];
//     cargando: boolean;
//     onAtender: (citacionId: number) => void;
//     onVerHistorial: (pacienteId: number) => void;
// };

// export default function PacientesEspera({
//     citaciones,
//     cargando,
//     onAtender,
//     onVerHistorial
// }: PacientesEsperaProps) {
//     // Estado para controlar el orden de las citaciones (por default: por prioridad)
//     const [ordenActual, setOrdenActual] = useState<'prioridad' | 'hora'>('prioridad');

//     // Ordenar citaciones según criterio seleccionado
//     const citacionesOrdenadas = [...citaciones].sort((a, b) => {
//         if (ordenActual === 'prioridad') {
//             // Ordenar por prioridad (descendente) y luego por hora programada
//             return b.prioridad - a.prioridad ||
//                 new Date(a.horaProgramada).getTime() - new Date(b.horaProgramada).getTime();
//         } else {
//             // Ordenar solo por hora programada
//             return new Date(a.horaProgramada).getTime() - new Date(b.horaProgramada).getTime();
//         }
//     });

//     // Formatear hora
//     const formatearHora = (fecha: string) => {
//         try {
//             const fechaObj = new Date(fecha);
//             return fechaObj.toLocaleTimeString('es-CO', {
//                 hour: '2-digit',
//                 minute: '2-digit'
//             });
//         } catch (error) {
//             console.error('Error al formatear hora:', error);
//             return 'Hora no disponible';
//         }
//     };

//     // Calcular tiempo de espera en minutos
//     const calcularTiempoEspera = (fechaProgramada: string) => {
//         const ahora = new Date();
//         const programada = new Date(fechaProgramada);
//         const diferencia = ahora.getTime() - programada.getTime();
//         return Math.max(0, Math.floor(diferencia / (1000 * 60)));
//     };

//     // Determinar clase del tiempo de espera
//     const obtenerClaseTiempoEspera = (minutos: number) => {
//         if (minutos > 30) return 'text-red-500';
//         if (minutos > 15) return 'text-amber-500';
//         return 'text-slate-500';
//     };

//     // Verificar si el paciente tiene riesgo cardiovascular alto
//     const tieneRiesgoAlto = (citacion: Citacion) => {
//         // citacion.paciente?.triaje?.resultadoRiesgoCv >
//         return 'ALTA';
//         //  citacion.paciente?.triaje?.nivelPrioridad
//     };

//     if (cargando) {
//         return (
//             <div className="flex h-64 w-full items-center justify-center">
//                 <div className="flex flex-col items-center">
//                     <RefreshCw className="size-10 animate-spin text-slate-400" />
//                     <p className="mt-4 text-slate-500">Cargando pacientes en espera...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (citacionesOrdenadas.length === 0) {
//         return (
//             <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
//                 <CheckCircle2 className="size-12 text-slate-400" />
//                 <h3 className="mt-4 text-lg font-medium">No hay pacientes en espera</h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                     Todos los pacientes han sido atendidos para esta fecha.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-medium">Lista de espera</h3>
//                 <div className="flex gap-2">
//                     <TooltipProvider>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <Button
//                                     variant={ordenActual === 'prioridad' ? 'default' : 'outline'}
//                                     size="sm"
//                                     onClick={() => setOrdenActual('prioridad')}
//                                 >
//                                     <AlertTriangle className="mr-1 size-4" />
//                                     Por Prioridad
//                                 </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                                 <p>Ordenar por nivel de prioridad clínica</p>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>

//                     <TooltipProvider>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <Button
//                                     variant={ordenActual === 'hora' ? 'default' : 'outline'}
//                                     size="sm"
//                                     onClick={() => setOrdenActual('hora')}
//                                 >
//                                     <Clock className="mr-1 size-4" />
//                                     Por Hora
//                                 </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                                 <p>Ordenar por hora de llegada</p>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>
//                 </div>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {citacionesOrdenadas.map((citacion) => {
//                     const tiempoEspera = calcularTiempoEspera(citacion.horaProgramada);
//                     const claseTiempoEspera = obtenerClaseTiempoEspera(tiempoEspera);

//                     return (
//                         <div
//                             key={citacion.id}
//                             className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
//                         >
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className={`rounded-full p-1 ${citacion.prioridad >= 4 ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
//                                         <User className="size-5" />
//                                     </div>
//                                     <div>
//                                         <h4 className="font-medium">
//                                             Nombres Apellidos
//                                         </h4>
//                                         <p className="text-xs text-slate-500">
//                                             Tipo e identificacion
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {tieneRiesgoAlto(citacion) && (
//                                     <div className="rounded-full bg-red-100 p-1 text-red-500 dark:bg-red-900/30 dark:text-red-400">
//                                         <Heart className="size-5" />
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="mt-3 space-y-2 text-sm">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-slate-500">Hora programada:</span>
//                                     <span>{formatearHora(citacion.horaProgramada)}</span>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-slate-500">Tiempo en espera:</span>
//                                     <span className={claseTiempoEspera}>
//                                         {tiempoEspera} minutos
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-slate-500">Prioridad:</span>
//                                     <div className="flex items-center">
//                                         {Array.from({ length: 5 }).map((_, i) => (
//                                             <div
//                                                 key={i}
//                                                 className={`size-2 rounded-full ${i < citacion.prioridad ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}
//                                                 style={{ marginRight: i < 4 ? '2px' : 0 }}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <span className="text-slate-500">Prob. asistencia:</span>
//                                     <span>{Math.round(citacion.prediccionAsistencia || 0)}%</span>
//                                 </div>

//                                 {/* {citacion.razon && (
//                                     <div className="pt-2">
//                                         <p className="text-xs text-slate-500">Razón de la visita:</p>
//                                         <p className="text-sm">{citacion.razon}</p>
//                                     </div>
//                                 )} */}
//                                 razon de la citación
//                             </div>

//                             <div className="mt-4 flex items-center justify-between space-x-2">
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="flex-1"
//                                     onClick={() => onVerHistorial(citacion.pacienteId)}
//                                 >
//                                     <FileText className="mr-1 size-4" />
//                                     Historial
//                                 </Button>

//                                 <Button
//                                     variant="default"
//                                     size="sm"
//                                     className="flex-1"
//                                     onClick={() => onAtender(citacion.id)}
//                                 >
//                                     <CheckCircle2 className="mr-1 size-4" />
//                                     Atender
//                                 </Button>
//                             </div>

//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="mt-2 text-xs text-slate-500"
//                                 title="Mover al final de la lista"
//                             >
//                                 <RotateCw className="mr-1 size-3" />
//                                 Reprogramar
//                             </Button>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }