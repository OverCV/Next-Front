"use client"

import { AlertCircle, RefreshCw, User, Calendar, Activity, CheckCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import {
    medicosService,
    CitacionMedica,
    PacienteCompleto
} from '@/src/services/domain/medicos.service'

import DatosClinicosForm from '../forms/DatosClinicosForm'

import PredecirRiesgoCV from './PredecirRiesgoCV'

interface ModalAtencionMedicaProps {
    citacion: CitacionMedica
    onCitacionAtendida: (citacionActualizada: CitacionMedica) => void
    onCerrar: () => void
}

export default function ModalAtencionMedica({
    citacion,
    onCitacionAtendida,
    onCerrar
}: ModalAtencionMedicaProps) {
    const [pacienteCompleto, setPacienteCompleto] = useState<PacienteCompleto | null>(null)
    const [cargandoPaciente, setCargandoPaciente] = useState(true)
    const [atendiendoCitacion, setAtendiendoCitacion] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [exito, setExito] = useState(false)

    // Cargar información completa del paciente
    useEffect(() => {
        const cargarPacienteCompleto = async () => {
            setCargandoPaciente(true)
            setError(null)

            try {
                const datos = await medicosService.obtenerPacienteCompleto(citacion.pacienteId)
                setPacienteCompleto(datos)
                console.log('✅ Información completa del paciente cargada')
            } catch (err: any) {
                console.error('❌ Error al cargar información del paciente:', err)
                setError('No se pudo cargar la información del paciente')
            } finally {
                setCargandoPaciente(false)
            }
        }

        cargarPacienteCompleto()
    }, [citacion.pacienteId])

    // Marcar citación como atendida
    const atenderCitacion = async () => {
        setAtendiendoCitacion(true)
        setError(null)

        try {
            const citacionActualizada = await medicosService.atenderCitacion(citacion.id)
            console.log('✅ Citación marcada como atendida')
            setExito(true)

            // Notificar al componente padre
            onCitacionAtendida(citacionActualizada)

            // Cerrar modal después de un momento
            setTimeout(() => {
                onCerrar()
            }, 1500)

        } catch (err: any) {
            console.error('❌ Error al marcar citación como atendida:', err)
            setError('No se pudo marcar la citación como atendida')
        } finally {
            setAtendiendoCitacion(false)
        }
    }

    // Manejar guardado de datos clínicos y atender citación
    const manejarGuardadoDatos = async () => {
        await atenderCitacion()
    }

    if (cargandoPaciente) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                    <p className="mt-2 text-slate-500">Cargando información del paciente...</p>
                </div>
            </div>
        )
    }

    if (!pacienteCompleto) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="mx-auto size-12 text-red-500" />
                <h3 className="mt-4 text-lg font-medium">Error al cargar paciente</h3>
                <p className="mt-2 text-sm text-slate-500">
                    No se pudo obtener la información del paciente
                </p>
            </div>
        )
    }

    const { usuario, triajes, datosClinicosRecientes } = pacienteCompleto
    console.log("Triajes:", triajes)
    const ultimoTriaje = triajes[0] // El más reciente

    return (
        <div className="space-y-6">
            {/* Mensajes de estado */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exito && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="size-4" />
                    <AlertDescription>
                        Citación marcada como atendida exitosamente
                    </AlertDescription>
                </Alert>
            )}

            {/* Header con información del paciente */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                {usuario.nombres} {usuario.apellidos}
                            </CardTitle>
                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                <p className="flex items-center gap-2">
                                    <User className="size-4" />
                                    {usuario.tipoIdentificacion}: {usuario.identificacion}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Citación: {new Date(citacion.horaProgramada).toLocaleString('es-ES')}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Activity className="size-4" />
                                    Código: {citacion.codigoTicket}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge
                                className={
                                    citacion.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-800' :
                                        citacion.estado === 'ATENDIDA' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                }
                            >
                                {citacion.estado}
                            </Badge>
                            <p className="mt-2 text-sm text-slate-500">
                                Duración: {citacion.duracionEstimada} min
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Contenido principal con tabs */}
            <Tabs defaultValue="datos-clinicos" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="datos-clinicos">Datos Clínicos</TabsTrigger>
                    <TabsTrigger value="triaje">Triaje Inicial</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                    <TabsTrigger value="prediccion">Predecir Riesgo CV</TabsTrigger>
                </TabsList>

                {/* Tab de datos clínicos */}
                <TabsContent value="datos-clinicos" className="mt-6">
                    <DatosClinicosForm
                        pacienteId={citacion.pacienteId}
                        onGuardar={manejarGuardadoDatos}
                    />
                </TabsContent>

                {/* Tab de triaje */}
                <TabsContent value="triaje" className="mt-6">
                    {ultimoTriaje ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Triaje Inicial</CardTitle>
                                <p className="text-sm text-slate-500">
                                    Realizado el {new Date(ultimoTriaje.fechaTriaje).toLocaleDateString('es-ES')}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Edad</p>
                                        <p className="text-sm text-slate-600">{ultimoTriaje.edad} años</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Peso</p>
                                        <p className="text-sm text-slate-600">{ultimoTriaje.peso} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Estatura</p>
                                        <p className="text-sm text-slate-600">{ultimoTriaje.estatura} cm</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full ${ultimoTriaje.tabaquismo ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-sm">Tabaquismo: {ultimoTriaje.tabaquismo ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full ${ultimoTriaje.diabetes ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-sm">Diabetes: {ultimoTriaje.diabetes ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full ${ultimoTriaje.hipertension ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-sm">Hipertensión: {ultimoTriaje.hipertension ? 'Sí' : 'No'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full ${ultimoTriaje.dolorPecho ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-sm">Dolor en pecho: {ultimoTriaje.dolorPecho ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full ${ultimoTriaje.antecedentesCardiacos ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-sm">Antecedentes cardíacos: {ultimoTriaje.antecedentesCardiacos ? 'Sí' : 'No'}</span>
                                    </div>
                                </div>

                                {ultimoTriaje.descripcion && (
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Observaciones</p>
                                        <p className="mt-1 text-sm text-slate-600">{ultimoTriaje.descripcion}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <AlertCircle className="mx-auto size-12 text-slate-400" />
                                <h3 className="mt-4 text-lg font-medium">No hay triaje registrado</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Este paciente no tiene triaje inicial registrado
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Tab de historial */}
                <TabsContent value="historial" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Historial Clínico Reciente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {datosClinicosRecientes.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 text-left">Fecha</th>
                                                <th className="py-2 text-left">Presión</th>
                                                <th className="py-2 text-left">FC</th>
                                                <th className="py-2 text-left">Temp</th>
                                                <th className="py-2 text-left">SpO2</th>
                                                <th className="py-2 text-left">Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datosClinicosRecientes.slice(0, 5).map(dato => (
                                                <tr key={dato.id} className="border-b">
                                                    <td className="py-2">{new Date(dato.fechaMedicion).toLocaleDateString('es-ES')}</td>
                                                    <td className="py-2">{dato.presionSistolica}/{dato.presionDiastolica}</td>
                                                    <td className="py-2">{dato.frecuenciaCardiacaMin}-{dato.frecuenciaCardiacaMax}</td>
                                                    <td className="py-2">{dato.temperatura}°C</td>
                                                    <td className="py-2">{dato.saturacionOxigeno}%</td>
                                                    <td className="max-w-xs truncate py-2">{dato.observaciones || 'Sin observaciones'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Activity className="mx-auto size-12 text-slate-400" />
                                    <h3 className="mt-4 text-lg font-medium">Sin historial clínico</h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Este paciente no tiene datos clínicos previos registrados
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab de predicción de riesgo CV */}
                <TabsContent value="prediccion" className="mt-6">
                    <PredecirRiesgoCV
                        pacienteId={citacion.pacienteId}
                        campanaId={citacion.campanaId}
                    />
                </TabsContent>
            </Tabs>

            {/* Botón para marcar como atendida (si no está atendida) */}
            {citacion.estado !== 'ATENDIDA' && (
                <div className="flex justify-end border-t pt-4">
                    <Button
                        onClick={atenderCitacion}
                        disabled={atendiendoCitacion}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                        {atendiendoCitacion ? (
                            <RefreshCw className="size-4 animate-spin" />
                        ) : (
                            <CheckCircle className="size-4" />
                        )}
                        {atendiendoCitacion ? 'Procesando...' : 'Marcar como Atendida'}
                    </Button>
                </div>
            )}
        </div>
    )
} 