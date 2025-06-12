"use client";

import { Save, AlertCircle, RefreshCw } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { medicosService, DatoClinico } from '@/src/services/domain/medicos.service'

interface DatosClinicosFormProps {
    pacienteId: number
    onGuardar?: () => void
}

export default function DatosClinicosForm({ pacienteId, onGuardar }: DatosClinicosFormProps) {
    const [datosExistentes, setDatosExistentes] = useState<DatoClinico[]>([])
    const [nuevosDatos, setNuevosDatos] = useState<Omit<DatoClinico, 'id'>>({
        pacienteId,
        presionSistolica: 120,
        presionDiastolica: 80,
        frecuenciaCardiacaMin: 70,
        frecuenciaCardiacaMax: 90,
        saturacionOxigeno: 98,
        temperatura: 36.5,
        colesterolTotal: 200,
        hdl: 50,
        observaciones: '',
        fechaMedicion: new Date().toISOString().split('T')[0]
    })

    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [exito, setExito] = useState(false)

    // Cargar datos clínicos existentes del paciente
    useEffect(() => {
        const cargarDatosClinicos = async () => {
            setCargando(true)
            try {
                const datos = await medicosService.obtenerDatosClinicosPorPaciente(pacienteId)
                setDatosExistentes(datos)
                console.log('✅ Datos clínicos existentes cargados:', datos.length)
            } catch (err: any) {
                console.error('❌ Error al cargar datos clínicos:', err)
                setError('No se pudieron cargar los datos clínicos del paciente')
            } finally {
                setCargando(false)
            }
        }

        cargarDatosClinicos()
    }, [pacienteId])

    // Manejar cambios en el formulario
    const manejarCambio = (campo: keyof Omit<DatoClinico, 'id'>, valor: string | number) => {
        setNuevosDatos(prev => ({
            ...prev,
            [campo]: valor
        }))
        setError(null)
        setExito(false)
    }

    // Validar formulario
    const validarFormulario = (): boolean => {
        if (nuevosDatos.presionSistolica < 80 || nuevosDatos.presionSistolica > 300) {
            setError('La presión sistólica debe estar entre 80 y 300 mmHg')
            return false
        }
        if (nuevosDatos.presionDiastolica < 40 || nuevosDatos.presionDiastolica > 150) {
            setError('La presión diastólica debe estar entre 40 y 150 mmHg')
            return false
        }
        if (nuevosDatos.temperatura < 30 || nuevosDatos.temperatura > 45) {
            setError('La temperatura debe estar entre 30 y 45 °C')
            return false
        }
        if (nuevosDatos.saturacionOxigeno < 70 || nuevosDatos.saturacionOxigeno > 100) {
            setError('La saturación de oxígeno debe estar entre 70 y 100%')
            return false
        }
        return true
    }

    // Guardar nuevos datos clínicos
    const guardarDatos = async () => {
        if (!validarFormulario()) return

        setGuardando(true)
        setError(null)

        try {
            await medicosService.crearDatosClinicos(nuevosDatos)
            console.log('✅ Datos clínicos guardados exitosamente')
            setExito(true)

            // Recargar datos existentes
            const datosActualizados = await medicosService.obtenerDatosClinicosPorPaciente(pacienteId)
            setDatosExistentes(datosActualizados)

            // Limpiar formulario
            setNuevosDatos(prev => ({
                ...prev,
                observaciones: '',
                fechaMedicion: new Date().toISOString().split('T')[0]
            }))

            // Llamar callback si existe
            if (onGuardar) onGuardar()

        } catch (err: any) {
            console.error('❌ Error al guardar datos clínicos:', err)
            setError('No se pudieron guardar los datos clínicos. Intente nuevamente.')
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
                    <p className="mt-2 text-slate-500">Cargando datos clínicos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Mensajes */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {exito && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                        Datos clínicos guardados exitosamente
                    </AlertDescription>
                </Alert>
            )}

            {/* Historial de datos clínicos */}
            {datosExistentes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Historial Clínico del Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Fecha</th>
                                        <th className="py-2 text-left">Presión</th>
                                        <th className="py-2 text-left">FC</th>
                                        <th className="py-2 text-left">Temp</th>
                                        <th className="py-2 text-left">SpO2</th>
                                        <th className="py-2 text-left">Colesterol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datosExistentes.slice(0, 5).map(dato => (
                                        <tr key={dato.id} className="border-b">
                                            <td className="py-2">{new Date(dato.fechaMedicion).toLocaleDateString('es-ES')}</td>
                                            <td className="py-2">{dato.presionSistolica}/{dato.presionDiastolica}</td>
                                            <td className="py-2">{dato.frecuenciaCardiacaMin}-{dato.frecuenciaCardiacaMax}</td>
                                            <td className="py-2">{dato.temperatura}°C</td>
                                            <td className="py-2">{dato.saturacionOxigeno}%</td>
                                            <td className="py-2">{dato.colesterolTotal} mg/dL</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                </div>
                    </CardContent>
                </Card>
            )}

            {/* Formulario para nuevos datos */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Nuevos Datos Clínicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Signos vitales */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="presionSistolica">Presión Sistólica (mmHg)</Label>
                            <Input
                                id="presionSistolica"
                            type="number"
                                min="80"
                                max="300"
                                value={nuevosDatos.presionSistolica}
                                onChange={(e) => manejarCambio('presionSistolica', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="presionDiastolica">Presión Diastólica (mmHg)</Label>
                            <Input
                                id="presionDiastolica"
                            type="number"
                                min="40"
                                max="150"
                                value={nuevosDatos.presionDiastolica}
                                onChange={(e) => manejarCambio('presionDiastolica', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="frecuenciaCardiacaMin">Frecuencia Cardíaca Mín (bpm)</Label>
                            <Input
                                id="frecuenciaCardiacaMin"
                            type="number"
                                min="40"
                                max="200"
                                value={nuevosDatos.frecuenciaCardiacaMin}
                                onChange={(e) => manejarCambio('frecuenciaCardiacaMin', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frecuenciaCardiacaMax">Frecuencia Cardíaca Máx (bpm)</Label>
                            <Input
                                id="frecuenciaCardiacaMax"
                            type="number"
                                min="40"
                                max="200"
                                value={nuevosDatos.frecuenciaCardiacaMax}
                                onChange={(e) => manejarCambio('frecuenciaCardiacaMax', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="temperatura">Temperatura (°C)</Label>
                            <Input
                                id="temperatura"
                            type="number"
                                step="0.1"
                                min="30"
                                max="45"
                                value={nuevosDatos.temperatura}
                                onChange={(e) => manejarCambio('temperatura', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="saturacionOxigeno">Saturación O2 (%)</Label>
                            <Input
                                id="saturacionOxigeno"
                            type="number"
                                min="70"
                                max="100"
                                value={nuevosDatos.saturacionOxigeno}
                                onChange={(e) => manejarCambio('saturacionOxigeno', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                    {/* Laboratorios */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="colesterolTotal">Colesterol Total (mg/dL)</Label>
                            <Input
                                id="colesterolTotal"
                                type="number"
                                min="100"
                                max="400"
                                value={nuevosDatos.colesterolTotal}
                                onChange={(e) => manejarCambio('colesterolTotal', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hdl">HDL (mg/dL)</Label>
                            <Input
                                id="hdl"
                            type="number"
                                min="20"
                                max="100"
                                value={nuevosDatos.hdl}
                                onChange={(e) => manejarCambio('hdl', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Fecha y observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="fechaMedicion">Fecha de Medición</Label>
                        <Input
                            id="fechaMedicion"
                            type="date"
                            value={nuevosDatos.fechaMedicion}
                            onChange={(e) => manejarCambio('fechaMedicion', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones Clínicas</Label>
                        <Textarea
                            id="observaciones"
                            placeholder="Escriba las observaciones clínicas del paciente..."
                            className="min-h-[100px] resize-none"
                            value={nuevosDatos.observaciones}
                            onChange={(e) => manejarCambio('observaciones', e.target.value)}
                        />
                </div>

                    {/* Botón de guardar */}
                    <div className="flex justify-end pt-4">
                    <Button
                            onClick={guardarDatos}
                            disabled={guardando}
                        className="gap-2"
                    >
                            {guardando ? (
                                <RefreshCw className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            {guardando ? 'Guardando...' : 'Guardar Datos Clínicos'}
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}