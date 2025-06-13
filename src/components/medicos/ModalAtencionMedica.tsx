"use client"

import { AlertCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'

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

    // Manejar citación atendida (callback del botón)
    const manejarCitacionAtendida = async (citacionActualizada: Citacion) => {
        try {
            // Generar seguimientos usando el workflow de n8n
            await seguimientosService.generarSeguimientos(
                citacion.pacienteId,
                citacion.id,
                citacion.campanaId
            );
            
            setExito(true)
            onCitacionAtendida(citacionActualizada)

            // Cerrar modal después de un momento
            setTimeout(() => {
                onCerrar()
            }, 1500)
        } catch (error) {
            console.error('Error generando seguimientos:', error);
            setError('Error al generar seguimientos automáticos');
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
            <PacienteHeader usuario={usuario} citacion={citacion} />

            {/* Contenido principal con tabs */}
            <Tabs defaultValue="datos-clinicos" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="datos-clinicos">Datos Clínicos</TabsTrigger>
                    <TabsTrigger value="triaje">Triaje Inicial</TabsTrigger>
                    {/* <TabsTrigger value="historial">Historial</TabsTrigger> */}
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

                {/* Tab de historial de atenciones médicas
                <TabsContent value="historial" className="mt-6">
                    <HistorialAtencionesSection citacionId={citacion.id} />
                </TabsContent> */}

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

            {/* Botón para marcar como atendida */}
            <AtenderCitacionButton
                citacion={citacion}
                onCitacionAtendida={manejarCitacionAtendida}
            />
        </div>
    )
} 