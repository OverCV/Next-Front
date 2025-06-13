"use client"

import { AlertCircle, Clock, Play, Square } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { medicosService } from '@/src/services/domain/medicos.service'
import { seguimientosService } from '@/src/services/seguimientos'
import { Citacion, PacienteCompleto } from '@/src/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

import DatosClinicosForm from '../forms/DatosClinicosForm'

import {
    PacienteHeader,
    TriajeSection,
    StatusMessages,
    AtenderCitacionButton,
    LoadingModal,
    ModalAtencionMedicaProps,
    HistorialAtencionesSection,
    DiagnosticoMedicoSection
    } from './modal-atencion'
import PredecirRiesgoCV from './PredecirRiesgoCV'

export default function ModalAtencionMedica({
    citacion,
    onCitacionAtendida,
    onCerrar
}: ModalAtencionMedicaProps) {
    const [pacienteCompleto, setPacienteCompleto] = useState<PacienteCompleto | null>(null)
    const [cargandoPaciente, setCargandoPaciente] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [exito, setExito] = useState(false)
    
    // NUEVOS ESTADOS PARA EL FLUJO DE ATENCIÓN
    const [atencionIniciada, setAtencionIniciada] = useState(false)
    const [iniciandoAtencion, setIniciandoAtencion] = useState(false)
    const [finalizandoAtencion, setFinalizandoAtencion] = useState(false)
    const [citacionActual, setCitacionActual] = useState<Citacion>(citacion)

    // Verificar si la atención ya fue iniciada al cargar el componente
    useEffect(() => {
        // Si la citación ya tiene hora_atencion, significa que ya se inició la atención
        if (citacion.horaAtencion) {
            setAtencionIniciada(true)
        }
    }, [citacion])

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

    // NUEVA FUNCIÓN: Iniciar atención médica
    const iniciarAtencionMedica = async () => {
        setIniciandoAtencion(true)
        setError(null)
        
        try {
            console.log('🚀 Iniciando atención médica...')
            const citacionActualizada = await citacionesService.iniciarAtencion(citacion.id)
            setCitacionActual(citacionActualizada)
            setAtencionIniciada(true)
            console.log('✅ Atención médica iniciada exitosamente')
        } catch (error: any) {
            console.error('❌ Error al iniciar atención:', error)
            setError('Error al iniciar la atención médica')
        } finally {
            setIniciandoAtencion(false)
        }
    }

    // NUEVA FUNCIÓN: Finalizar atención médica
    const finalizarAtencionMedica = async () => {
        setFinalizandoAtencion(true)
        setError(null)
        
        try {
            console.log('🏁 Finalizando atención médica...')
            
            // 1. Finalizar la atención (establecer hora_fin_atencion Y cambiar estado a ATENDIDA)
            // Spring Boot detectará automáticamente el cambio de estado y disparará el webhook n8n
            const citacionFinalizada = await citacionesService.finalizarAtencion(citacion.id)
            setCitacionActual(citacionFinalizada)
            
            // 2. NO necesitamos llamar manualmente a seguimientosService.generarSeguimientos
            // porque Spring Boot lo hace automáticamente via EventListener cuando estado = ATENDIDA
            console.log('✅ Spring Boot manejará los seguimientos automáticamente')
            
            setExito(true)
            onCitacionAtendida(citacionFinalizada)
            
            // Cerrar modal después de un momento
            setTimeout(() => {
                onCerrar()
            }, 1500)
            
            console.log('✅ Atención médica finalizada exitosamente')
        } catch (error: any) {
            console.error('❌ Error al finalizar atención:', error)
            setError('Error al finalizar la atención médica')
        } finally {
            setFinalizandoAtencion(false)
        }
    }

    // Callback para el formulario (sin parámetros)
    const manejarGuardadoDatos = () => {
        console.log('📝 Datos clínicos guardados')
        // El formulario solo guarda datos, no atiende la citación
    }

    // Estado de carga
    if (cargandoPaciente) {
        return <LoadingModal />
    }

    // Error al cargar paciente
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

    const { usuario, triajes } = pacienteCompleto
    const ultimoTriaje = triajes[0] // El más reciente

    return (
        <div className="space-y-6">
            {/* Mensajes de estado */}
            <StatusMessages error={error} exito={exito} />

            {/* Header con información del paciente */}
            <PacienteHeader usuario={usuario} citacion={citacionActual} />

            {/* BOTÓN INICIAR ATENCIÓN */}
            {!atencionIniciada && (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <Clock className="size-16 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                        Atención No Iniciada
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
                        Para acceder a las herramientas de atención médica, primero debe iniciar la atención del paciente.
                    </p>
                    <Button 
                        onClick={iniciarAtencionMedica}
                        disabled={iniciandoAtencion}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {iniciandoAtencion ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Iniciando...
                            </>
                        ) : (
                            <>
                                <Play className="size-4 mr-2" />
                                Iniciar Atención
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* CONTENIDO DEL MODAL - SOLO DISPONIBLE DESPUÉS DE INICIAR ATENCIÓN */}
            {atencionIniciada && (
                <>
                    {/* Contenido principal con tabs */}
                    <Tabs defaultValue="datos-clinicos" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="datos-clinicos">Datos Clínicos</TabsTrigger>
                            <TabsTrigger value="triaje">Triaje Inicial</TabsTrigger>
                            <TabsTrigger value="prediccion">Predecir Riesgo CV</TabsTrigger>
                            <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
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
                            <TriajeSection triaje={ultimoTriaje} />
                        </TabsContent>

                        {/* Tab de predicción de riesgo CV */}
                        <TabsContent value="prediccion" className="mt-6">
                            <PredecirRiesgoCV
                                pacienteId={citacion.pacienteId}
                                campanaId={citacion.campanaId}
                            />
                        </TabsContent>

                        {/* Tab de diagnóstico médico */}
                        <TabsContent value="diagnostico" className="mt-6">
                            <DiagnosticoMedicoSection
                                citacionId={citacion.id}
                                pacienteId={citacion.pacienteId}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* BOTÓN FINALIZAR ATENCIÓN */}
                    <div className="flex justify-center pt-4 border-t">
                        <Button 
                            onClick={finalizarAtencionMedica}
                            disabled={finalizandoAtencion}
                            size="lg"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {finalizandoAtencion ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Finalizando...
                                </>
                            ) : (
                                <>
                                    <Square className="size-4 mr-2" />
                                    Finalizar Atención
                                </>
                            )}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
} 