"use client"

import { AlertCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { medicosService } from '@/src/services/domain/medicos.service'
import { PacienteCompleto } from '@/src/types'

import DatosClinicosForm from '../forms/DatosClinicosForm'

import {
    PacienteHeader,
    TriajeSection,
    HistorialSection,
    StatusMessages,
    AtenderCitacionButton,
    LoadingModal,
    ModalAtencionMedicaProps
} from './modal-atencion'
import PredecirRiesgoCV from './PredecirRiesgoCV'

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
            const citacionActualizada = await citacionesService.atenderCitacion(citacion.id)
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

    const { usuario, triajes, datosClinicosRecientes } = pacienteCompleto
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
                    <TriajeSection triaje={ultimoTriaje} />
                </TabsContent>

                {/* Tab de predicción de riesgo CV */}
                <TabsContent value="prediccion" className="mt-6">
                    <PredecirRiesgoCV
                        pacienteId={citacion.pacienteId}
                        campanaId={citacion.campanaId}
                    />
                </TabsContent>

                {/* Tab de diagnosticos médicos */}
                <TabsContent value="diagnosticos" className="mt-6">
                    <HistorialSection datosClinicosRecientes={datosClinicosRecientes} />
                </TabsContent>

            </Tabs>

            {/* A lo mejor otro botón??? */}

            {/* Botón para marcar como atendida */}
            <AtenderCitacionButton
                citacion={citacion}
                atendiendoCitacion={atendiendoCitacion}
                onAtender={atenderCitacion}
            />
        </div>
    )
} 