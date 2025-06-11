"use client"

import { Brain, AlertCircle, RefreshCw, TrendingUp, Calendar, Target, CheckCircle, Heart } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useAuth } from '@/src/providers/auth-provider'
import {
    prediccionesService,
    PrediccionRiesgoCV,
    PrediccionGuardada
} from '@/src/services/domain/predicciones.service'

interface PredecirRiesgoCVProps {
    pacienteId: number
    campanaId: number
}

export default function PredecirRiesgoCV({ pacienteId, campanaId }: PredecirRiesgoCVProps) {
    const { usuario } = useAuth()

    const [prediccionActual, setPrediccionActual] = useState<PrediccionRiesgoCV | null>(null)
    const [historialPredicciones, setHistorialPredicciones] = useState<PrediccionGuardada[]>([])

    const [cargandoHistorial, setCargandoHistorial] = useState(true)
    const [generandoPrediccion, setGenerandoPrediccion] = useState(false)
    const [verificandoAPI, setVerificandoAPI] = useState(false)
    const [apiDisponible, setApiDisponible] = useState<boolean | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [exito, setExito] = useState(false)

    // Cargar historial de predicciones al montar
    useEffect(() => {
        cargarHistorialPredicciones()
        verificarDisponibilidadAPI()
    }, [pacienteId])

    // Verificar si la API de FastAPI está disponible
    const verificarDisponibilidadAPI = async () => {
        setVerificandoAPI(true)
        try {
            await prediccionesService.verificarSaludFastAPI()
            setApiDisponible(true)
            console.log('✅ API de FastAPI disponible')
        } catch (error) {
            console.error('❌ API de FastAPI no disponible:', error)
            setApiDisponible(false)
            setError('El servicio de predicciones no está disponible en este momento')
        } finally {
            setVerificandoAPI(false)
        }
    }

    // Cargar historial de predicciones del paciente
    const cargarHistorialPredicciones = async () => {
        setCargandoHistorial(true)
        setError(null)

        try {
            const predicciones = await prediccionesService.obtenerPrediccionesPorPaciente(pacienteId)
            setHistorialPredicciones(predicciones)
            console.log('✅ Historial de predicciones cargado:', predicciones.length)
        } catch (err: any) {
            console.error('❌ Error al cargar historial de predicciones:', err)
            setError('No se pudo cargar el historial de predicciones')
        } finally {
            setCargandoHistorial(false)
        }
    }

    // Generar nueva predicción
    const generarPrediccion = async () => {
        if (!usuario?.token) {
            setError('No se encontró token de autenticación')
            return
        }

        setGenerandoPrediccion(true)
        setError(null)
        setExito(false)

        try {
            const prediccion = await prediccionesService.predecirRiesgoCV(
                pacienteId,
                campanaId,
                usuario.token
            )

            setPrediccionActual(prediccion)
            setExito(true)

            // Recargar historial para incluir la nueva predicción
            setTimeout(() => {
                cargarHistorialPredicciones()
            }, 2000)

            console.log('✅ Predicción generada exitosamente')
        } catch (err: any) {
            console.error('❌ Error al generar predicción:', err)
            setError('No se pudo generar la predicción. Verifique que el paciente tenga datos suficientes.')
        } finally {
            setGenerandoPrediccion(false)
        }
    }

    // Obtener color según nivel de riesgo
    const obtenerColorRiesgo = (nivelRiesgo: string) => {
        switch (nivelRiesgo.toUpperCase()) {
            case 'BAJO':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'MODERADO':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            case 'ALTO':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
        }
    }

    // Formatear factores principales
    const formatearFactor = (factor: any) => {
        const key = Object.keys(factor)[0]
        const value = factor[key]
        const porcentaje = Math.round(value * 100)

        const nombres: { [key: string]: string } = {
            'imc': 'IMC',
            'presion_sistolica': 'Presión Sistólica',
            'presion_diastolica': 'Presión Diastólica',
            'edad': 'Edad',
            'colesterol_total': 'Colesterol Total',
            'hdl': 'HDL',
            'tabaquismo': 'Tabaquismo',
            'diabetes': 'Diabetes',
            'hipertension': 'Hipertensión'
        }

        return {
            nombre: nombres[key] || key,
            porcentaje
        }
    }

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
                        Predicción de riesgo cardiovascular generada exitosamente
                    </AlertDescription>
                </Alert>
            )}

            {/* Estado de la API */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Predicción de Riesgo Cardiovascular</CardTitle>
                            <p className="text-sm text-slate-500">
                                Análisis predictivo basado en inteligencia artificial
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {verificandoAPI ? (
                                <RefreshCw className="size-4 animate-spin text-slate-400" />
                            ) : (
                                <div className={`size-3 rounded-full ${apiDisponible ? 'bg-green-500' : 'bg-red-500'}`} />
                            )}
                            <span className="text-sm text-slate-600">
                                {verificandoAPI ? 'Verificando...' : apiDisponible ? 'API Disponible' : 'API No Disponible'}
                            </span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Botón para generar predicción */}
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <Brain className="mx-auto mb-4 size-12 text-blue-500" />
                        <h3 className="mb-2 text-lg font-medium">Generar Nueva Predicción</h3>
                        <p className="mb-4 text-sm text-slate-500">
                            Análisis del riesgo cardiovascular basado en los datos actuales del paciente
                        </p>
                        <Button
                            onClick={generarPrediccion}
                            disabled={generandoPrediccion || !apiDisponible}
                            className="gap-2"
                        >
                            {generandoPrediccion ? (
                                <RefreshCw className="size-4 animate-spin" />
                            ) : (
                                <TrendingUp className="size-4" />
                            )}
                            {generandoPrediccion ? 'Analizando...' : 'Generar Predicción'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Resultado de predicción actual */}
            {prediccionActual && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Heart className="size-5 text-red-500" />
                            Resultado de Predicción
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Métricas principales */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                                <p className="text-sm text-slate-600">Nivel de Riesgo</p>
                                <Badge className={`mt-1 ${obtenerColorRiesgo(prediccionActual.nivel_riesgo)}`}>
                                    {prediccionActual.nivel_riesgo}
                                </Badge>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                                <p className="text-sm text-slate-600">Probabilidad</p>
                                <p className="mt-1 text-2xl font-bold">
                                    {Math.round(prediccionActual.probabilidad * 100)}%
                                </p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                                <p className="text-sm text-slate-600">Confianza</p>
                                <p className="mt-1 text-2xl font-bold">{prediccionActual.confianza}%</p>
                            </div>
                        </div>

                        {/* Factores principales */}
                        <div>
                            <h4 className="mb-3 font-medium">Factores Principales de Riesgo</h4>
                            <div className="space-y-2">
                                {prediccionActual.factores_principales.map((factor, index) => {
                                    const { nombre, porcentaje } = formatearFactor(factor)
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="min-w-[120px] text-sm">{nombre}:</span>
                                            <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                                    style={{ width: `${porcentaje}%` }}
                                                />
                                            </div>
                                            <span className="min-w-[40px] text-sm font-medium">{porcentaje}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Recomendaciones */}
                        <div>
                            <h4 className="mb-3 font-medium">Recomendaciones Médicas</h4>
                            <ul className="space-y-2">
                                {prediccionActual.recomendaciones.map((recomendacion, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-500" />
                                        {recomendacion}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Información técnica */}
                        <div className="border-t pt-4 text-xs text-slate-500">
                            <p>Modelo: {prediccionActual.modelo_version}</p>
                            <p>Fecha: {new Date(prediccionActual.fecha_prediccion).toLocaleString('es-ES')}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Historial de predicciones */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Historial de Predicciones</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={cargarHistorialPredicciones}
                            disabled={cargandoHistorial}
                            className="gap-2"
                        >
                            <RefreshCw className={`size-4 ${cargandoHistorial ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {cargandoHistorial ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="size-6 animate-spin text-slate-400" />
                            <span className="ml-2 text-slate-500">Cargando historial...</span>
                        </div>
                    ) : historialPredicciones.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Fecha</th>
                                        <th className="py-2 text-left">Nivel de Riesgo</th>
                                        <th className="py-2 text-left">Valor</th>
                                        <th className="py-2 text-left">Confianza</th>
                                        <th className="py-2 text-left">Modelo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historialPredicciones.slice(0, 10).map(prediccion => (
                                        <tr key={prediccion.id} className="border-b">
                                            <td className="py-2">
                                                {new Date(prediccion.fechaPrediccion).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="py-2">
                                                <Badge className={obtenerColorRiesgo(prediccion.nivelRiesgo)}>
                                                    {prediccion.nivelRiesgo}
                                                </Badge>
                                            </td>
                                            <td className="py-2 font-medium">
                                                {Math.round(prediccion.valorPrediccion)}%
                                            </td>
                                            <td className="py-2">{prediccion.confianza}%</td>
                                            <td className="py-2 text-xs text-slate-500">
                                                {prediccion.modeloVersion}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <TrendingUp className="mx-auto size-12 text-slate-400" />
                            <h3 className="mt-4 text-lg font-medium">Sin predicciones previas</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Las predicciones generadas aparecerán aquí
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 