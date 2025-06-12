"use client"

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import apiClient from '@/src/services/api'
import { pacientesService } from '@/src/services/domain/pacientes.service'
import { enviarNotificacionSeguimientoCompletado } from '@/src/lib/notificaciones'

interface Seguimiento {
  id: number
  fecha_programada: string
  tipo: string
  resultado: string
  notas: string
  estado: string
  prioridad: string
}

interface CuestionarioRespuesta {
  [key: string]: any
}

interface SeguimientosWidgetProps {
  pacienteId: number
}

export default function SeguimientosWidget({ pacienteId }: SeguimientosWidgetProps) {
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([])
  const [seguimientoActivo, setSeguimientoActivo] = useState<Seguimiento | null>(null)
  const [cuestionario, setCuestionario] = useState<any>(null)
  const [respuestas, setRespuestas] = useState<CuestionarioRespuesta>({})
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalAnalisis, setModalAnalisis] = useState(false)
  const [analisisCompleto, setAnalisisCompleto] = useState<any>(null)
  const [notificacionesEnviadas, setNotificacionesEnviadas] = useState<{smsEnviado: boolean; correoEnviado: boolean} | null>(null)

  // Cargar TODOS los seguimientos del paciente
  useEffect(() => {
    const cargarSeguimientos = async () => {
      if (!pacienteId) return

      try {
        setCargando(true)
        
        console.log('📋 Cargando TODOS los seguimientos para paciente:', pacienteId)
        
        // Obtener todos los seguimientos del paciente
        const response = await apiClient.get(`/seguimientos/paciente/${pacienteId}`)
        setSeguimientos(response.data)
        console.log('📋 Total seguimientos cargados:', response.data.length)
        
        setError(null)
      } catch (err: any) {
        console.error('Error cargando seguimientos:', err)
        setError('No se pudieron cargar los seguimientos')
      } finally {
        setCargando(false)
      }
    }

    cargarSeguimientos()
  }, [pacienteId])

  // Iniciar cuestionario y abrir modal - LLAMADA AL WORKFLOW N8N
  const iniciarCuestionario = async (seguimiento: Seguimiento) => {
    try {
      setSeguimientoActivo(seguimiento)
      setRespuestas({})
      setModalAbierto(true)
      
      console.log('🎯 Generando cuestionario con workflow N8N para seguimiento:', seguimiento.id)
      
      // Calcular días desde programación
      const fechaProgramada = new Date(seguimiento.fecha_programada)
      const hoy = new Date()
      const diasDesdeProgramacion = Math.floor((hoy.getTime() - fechaProgramada.getTime()) / (1000 * 60 * 60 * 24))
      
      // Estructura de datos para el workflow de n8n
      const datosWorkflow = {
        paciente_id: pacienteId,
        datos_basicos: {
          nombre: `Paciente ${pacienteId}`,
          edad: 45 // Valor por defecto, idealmente vendría de la BD
        },
        datos_cardiovasculares: {
          presionSistolica: 120, // Valores por defecto
          presionDiastolica: 80,
          colesterolTotal: 200,
          diabetes: false
        },
        seguimiento_context: {
          seguimiento_id: seguimiento.id,
          tipo: seguimiento.tipo,
          prioridad: seguimiento.prioridad,
          dias_desde_programacion: diasDesdeProgramacion,
          resultado_analisis_ia: seguimiento.resultado || 'Seguimiento cardiovascular programado',
          notas_seguimiento: seguimiento.notas || 'Seguimiento médico regular'
        },
        objetivo_cuestionario: 'seguimiento_especifico'
      }
      
      console.log('📤 Enviando datos al workflow N8N:', datosWorkflow)
      
      // Llamar al webhook del workflow n8n
      const response = await fetch('http://localhost:5678/webhook/agente1-cardiovascular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosWorkflow)
      })
      
      if (!response.ok) {
        throw new Error(`Error del workflow: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📥 Respuesta del workflow N8N:', data)
      
      // Extraer datos de la estructura real de n8n
      let cuestionarioData = null;
      
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0]
        // Los datos están directamente en el primer elemento del array
        if (firstItem && firstItem.success && firstItem.cuestionario) {
          cuestionarioData = firstItem
          console.log('✅ Cuestionario extraído exitosamente:', cuestionarioData.cuestionario.titulo)
        }
      } else if (data && data.success) {
        // Estructura directa: { success: true, cuestionario: {...} }
        cuestionarioData = data
        console.log('✅ Cuestionario extraído (estructura directa):', cuestionarioData.cuestionario.titulo)
      }
      
      if (cuestionarioData && cuestionarioData.success && cuestionarioData.cuestionario) {
        setCuestionario(cuestionarioData)
        console.log('✅ Cuestionario generado exitosamente desde N8N')
        console.log('📋 Título:', cuestionarioData.cuestionario.titulo)
        console.log('🔢 Preguntas:', cuestionarioData.cuestionario.preguntas?.length)
      } else {
        console.error('❌ Estructura de cuestionario inválida:', cuestionarioData)
        throw new Error('El workflow no devolvió un cuestionario válido')
      }
      
      setError(null)
    } catch (err: any) {
      console.error('❌ Error generando cuestionario desde N8N:', err)
      setError(`No se pudo generar el cuestionario: ${err.message}`)
      setModalAbierto(false)
    }
  }

  // Guardar respuesta
  const manejarRespuesta = (preguntaId: string, valor: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }))
  }

  // Completar seguimiento
  const completarSeguimiento = async () => {
    if (!seguimientoActivo) return

    try {
      setEnviando(true)
      
      console.log('💾 Enviando respuestas del cuestionario:', respuestas)
      console.log('🎯 Seguimiento ID:', seguimientoActivo.id)
      
      // 1. Guardar respuestas en interacciones_chatbot para análisis detallado
      const respuestasResultado = await apiClient.post(`/interacciones-chatbot/seguimiento/${seguimientoActivo.id}/respuestas`, respuestas)
      console.log('✅ Respuestas guardadas en interacciones_chatbot:', respuestasResultado.data)
      
      // 2. Completar seguimiento (actualizar estado)
      const seguimientoResultado = await apiClient.put(`/seguimientos/${seguimientoActivo.id}/completar`, respuestas)
      console.log('✅ Seguimiento completado:', seguimientoResultado.data)
      
      // 3. Obtener análisis de las respuestas
      try {
        const analisisResultado = await apiClient.get(`/interacciones-chatbot/seguimiento/${seguimientoActivo.id}/analisis`)
        console.log('🔍 Análisis generado:', analisisResultado.data)
          
          // Guardar análisis y mostrar modal elegante
          if (analisisResultado.data.success && analisisResultado.data.analisis) {
            setAnalisisCompleto(analisisResultado.data.analisis)
            setModalAnalisis(true)
          }
      } catch (analisisError) {
        console.warn('⚠️ No se pudo obtener análisis:', analisisError)
      }
      
      // 4. Actualizar lista de seguimientos - marcar como completado
      setSeguimientos(prev => prev.map(s => 
        s.id === seguimientoActivo.id 
          ? { ...s, estado: 'REALIZADO' }
          : s
      ))

      // 5. NUEVO: Enviar notificaciones SMS y correo al paciente
      try {
        console.log('📱 Obteniendo datos de contacto para notificaciones...')
        
        // Obtener datos de contacto del paciente
        const datosContacto = await pacientesService.obtenerDatosContactoPaciente(pacienteId)
        
        const nombreCompleto = `${datosContacto.nombres} ${datosContacto.apellidos}`.trim()
        const fechaFormateada = new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        // Enviar notificaciones
        const resultadoNotificaciones = await enviarNotificacionSeguimientoCompletado(
          datosContacto.telefono,
          datosContacto.correo,
          nombreCompleto,
          seguimientoActivo.tipo,
          fechaFormateada
        )
        
        console.log('✅ Notificaciones enviadas:', resultadoNotificaciones)
        
        // Guardar resultado de notificaciones para mostrar en el modal
        setNotificacionesEnviadas(resultadoNotificaciones)
        
        // Mostrar mensaje adicional si se enviaron notificaciones
        if (resultadoNotificaciones.smsEnviado || resultadoNotificaciones.correoEnviado) {
          let mensajeNotificacion = '📱 Se han enviado notificaciones: '
          const notificacionesLista = []
          
          if (resultadoNotificaciones.smsEnviado) notificacionesLista.push('SMS')
          if (resultadoNotificaciones.correoEnviado) notificacionesLista.push('Correo')
          
          mensajeNotificacion += notificacionesLista.join(' y ')
          console.log(mensajeNotificacion)
        }
        
      } catch (errorNotificacion) {
        console.warn('⚠️ Error al enviar notificaciones (no afecta el seguimiento):', errorNotificacion)
        // No mostramos este error al usuario ya que el seguimiento se completó exitosamente
      }
      
      // 6. Cerrar modal y limpiar estado
      setModalAbierto(false)
      setSeguimientoActivo(null)
      setCuestionario(null)
      setRespuestas({})
      setError(null)
      
    } catch (err: any) {
      console.error('❌ Error completando seguimiento:', err)
      setError(`No se pudo completar el seguimiento: ${err.message}`)
    } finally {
      setEnviando(false)
    }
  }

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false)
    setSeguimientoActivo(null)
    setCuestionario(null)
    setRespuestas({})
    setNotificacionesEnviadas(null)
  }

  // Renderizar prioridad
  const renderPrioridad = (prioridad: string) => {
    const colores = {
      ALTA: 'destructive',
      MEDIA: 'secondary',
      BAJA: 'outline'
    }
    return <Badge variant={colores[prioridad as keyof typeof colores] || 'outline'}>{prioridad}</Badge>
  }

  // Renderizar estado
  const renderEstado = (estado: string) => {
    const colores = {
      PENDIENTE: 'secondary',
      PROGRAMADO: 'outline',
      REALIZADO: 'default'
    }
    return <Badge variant={colores[estado as keyof typeof colores] || 'outline'}>{estado}</Badge>
  }

  // Vista principal de seguimientos
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-blue-600" />
            Seguimientos del Paciente
          </CardTitle>
          <CardDescription>
            Todos los seguimientos cardiovasculares (pendientes y completados)
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {cargando ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : seguimientos.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto size-12 text-gray-400 mb-4" />
              <p className="text-slate-600">No hay seguimientos registrados</p>
              <p className="text-sm text-slate-400">Los seguimientos aparecerán aquí cuando se creen</p>
            </div>
          ) : (
            <div className="space-y-4">
              {seguimientos
                .sort((a, b) => new Date(b.fecha_programada).getTime() - new Date(a.fecha_programada).getTime())
                .map((seguimiento) => (
                <div 
                  key={seguimiento.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Clock className="size-4 text-orange-500" />
                      <span className="font-medium">Seguimiento {seguimiento.tipo}</span>
                      {renderPrioridad(seguimiento.prioridad)}
                      {renderEstado(seguimiento.estado)}
                    </div>
                    <span className="text-sm text-slate-500">
                      {new Date(seguimiento.fecha_programada).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4">
                    {seguimiento.resultado || 'Seguimiento cardiovascular programado'}
                  </p>

                  {seguimiento.notas && (
                    <p className="text-xs text-slate-500 mb-4 italic">
                      {seguimiento.notas.substring(0, 100)}...
                    </p>
                  )}
                  
                  <Button 
                    onClick={() => iniciarCuestionario(seguimiento)}
                    size="sm"
                    className="w-full"
                    disabled={seguimiento.estado === 'REALIZADO'}
                    variant={seguimiento.estado === 'REALIZADO' ? 'secondary' : 'default'}
                  >
                    {seguimiento.estado === 'REALIZADO' ? '✅ Completado' : 'Iniciar Seguimiento'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal del Cuestionario */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              {cuestionario?.cuestionario?.titulo || 'Seguimiento Cardiovascular'}
            </DialogTitle>
          </DialogHeader>
          
          {cuestionario ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                {cuestionario.cuestionario?.instrucciones || 'Complete las siguientes preguntas'}
              </p>

              {cuestionario.cuestionario?.preguntas?.map((pregunta: any, index: number) => (
                <div key={pregunta.id} className="space-y-3">
                  <h4 className="font-medium text-sm">
                    {index + 1}. {pregunta.pregunta}
                    {pregunta.requerida && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  
                  {pregunta.tipo === 'opcion_multiple' && (
                    <div className="space-y-2">
                      {pregunta.opciones?.map((opcion: string) => (
                        <label key={opcion} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={pregunta.id}
                            value={opcion}
                            onChange={(e) => manejarRespuesta(pregunta.id, e.target.value)}
                            className="form-radio"
                          />
                          <span className="text-sm">{opcion}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {pregunta.tipo === 'multiple_seleccion' && (
                    <div className="space-y-2">
                      {pregunta.opciones?.map((opcion: string) => (
                        <label key={opcion} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={opcion}
                            onChange={(e) => {
                              const valores = respuestas[pregunta.id] || []
                              if (e.target.checked) {
                                manejarRespuesta(pregunta.id, [...valores, opcion])
                              } else {
                                manejarRespuesta(pregunta.id, valores.filter((v: string) => v !== opcion))
                              }
                            }}
                            className="form-checkbox"
                          />
                          <span className="text-sm">{opcion}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {pregunta.tipo === 'texto' && (
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Escriba su respuesta detallada aquí..."
                      value={respuestas[pregunta.id] || ''}
                      onChange={(e) => manejarRespuesta(pregunta.id, e.target.value)}
                    />
                  )}

                  {pregunta.tipo === 'numero' && (
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingrese un número..."
                      value={respuestas[pregunta.id] || ''}
                      onChange={(e) => manejarRespuesta(pregunta.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={completarSeguimiento}
                  disabled={enviando}
                  className="flex-1"
                >
                  {enviando ? 'Enviando...' : 'Completar Seguimiento'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={cerrarModal}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Cargando cuestionario...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Elegante de Análisis */}
      <Dialog open={modalAnalisis} onOpenChange={setModalAnalisis}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="size-6 text-green-600" />
              Análisis Completado
            </DialogTitle>
          </DialogHeader>
          
          {analisisCompleto && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center size-12 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Seguimiento Completado!
                </h3>
                <p className="text-sm text-gray-600">
                  Hemos analizado sus respuestas y generado recomendaciones personalizadas
                </p>
              </div>

              {analisisCompleto.analisis && (
                <div className="space-y-4">
                  {/* Adherencia */}
                  {analisisCompleto.analisis.adherencia_nivel && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-2 bg-blue-500 rounded-full"></div>
                        <h4 className="font-medium text-blue-900">Adherencia a Medicamentos</h4>
                      </div>
                      <p className="text-sm text-blue-800">
                        Nivel: <span className="font-semibold">{analisisCompleto.analisis.adherencia_nivel}</span>
                      </p>
                      {analisisCompleto.analisis.adherencia_score && (
                        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${analisisCompleto.analisis.adherencia_score}%`}}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Síntomas */}
                  {analisisCompleto.analisis.sintomas_nivel && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-2 bg-amber-500 rounded-full"></div>
                        <h4 className="font-medium text-amber-900">Estado de Síntomas</h4>
                      </div>
                      <p className="text-sm text-amber-800">
                        Estado: <span className="font-semibold">{analisisCompleto.analisis.sintomas_nivel}</span>
                      </p>
                      {analisisCompleto.analisis.urgencia && (
                        <p className="text-xs text-amber-700 mt-1">
                          Urgencia: {analisisCompleto.analisis.urgencia}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Recomendación Principal */}
                  {analisisCompleto.analisis.recomendacion && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-2 bg-green-500 rounded-full"></div>
                        <h4 className="font-medium text-green-900">Recomendación</h4>
                      </div>
                      <p className="text-sm text-green-800">
                        {analisisCompleto.analisis.recomendacion}
                      </p>
                    </div>
                  )}

                  {/* Próximo Seguimiento */}
                  {analisisCompleto.analisis.seguimiento_sugerido && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-2 bg-purple-500 rounded-full"></div>
                        <h4 className="font-medium text-purple-900">Próximo Seguimiento</h4>
                      </div>
                      <p className="text-sm text-purple-800">
                        Recomendado en: <span className="font-semibold">{analisisCompleto.analisis.seguimiento_sugerido}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Información sobre notificaciones enviadas */}
              {notificacionesEnviadas && (notificacionesEnviadas.smsEnviado || notificacionesEnviadas.correoEnviado) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-2 bg-blue-500 rounded-full"></div>
                    <h4 className="font-medium text-blue-900">📱 Notificaciones Enviadas</h4>
                  </div>
                  <div className="space-y-1 text-sm text-blue-800">
                    {notificacionesEnviadas.smsEnviado && (
                      <p className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        Mensaje de texto (SMS) enviado
                      </p>
                    )}
                    {notificacionesEnviadas.correoEnviado && (
                      <p className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        Correo electrónico enviado
                      </p>
                    )}
                    <p className="text-xs text-blue-600 mt-2">
                      Has recibido confirmación de que tu seguimiento se completó exitosamente.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setModalAnalisis(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Entendido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 