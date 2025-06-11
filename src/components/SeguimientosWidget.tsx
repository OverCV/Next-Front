"use client"

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import apiClient from '@/src/services/api'

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

  // Cargar seguimientos disponibles HOY (para habilitar cuestionarios)
  useEffect(() => {
    const cargarSeguimientos = async () => {
      if (!pacienteId) return

      try {
        setCargando(true)
        
        // Primero intentar cargar seguimientos disponibles para HOY
        const responseHoy = await apiClient.get(`/seguimientos/paciente/${pacienteId}/disponibles-hoy`)
        
        if (responseHoy.data && responseHoy.data.length > 0) {
          // Hay seguimientos disponibles hoy
          setSeguimientos(responseHoy.data)
          console.log('✅ Seguimientos disponibles hoy:', responseHoy.data.length)
        } else {
          // Si no hay seguimientos hoy, mostrar pendientes para información
          const responsePendientes = await apiClient.get(`/seguimientos/paciente/${pacienteId}/pendientes`)
          setSeguimientos(responsePendientes.data)
          console.log('📋 Seguimientos pendientes:', responsePendientes.data.length)
        }
        
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

  // Iniciar cuestionario
  const iniciarCuestionario = async (seguimiento: Seguimiento) => {
    try {
      setSeguimientoActivo(seguimiento)
      setRespuestas({})
      
      console.log('🎯 Generando cuestionario específico para seguimiento:', seguimiento.id)
      
      // Usar el endpoint específico que genera cuestionarios basados en análisis previo
      const response = await apiClient.post(`/seguimientos/${seguimiento.id}/generar-cuestionario-especifico`)
      
      if (response.data && response.data.success) {
        setCuestionario(response.data.cuestionario)
        console.log('✅ Cuestionario generado exitosamente')
      } else {
        // Fallback al cuestionario básico
        console.warn('⚠️ Cuestionario específico falló, usando básico')
        const fallbackResponse = await apiClient.post(`/seguimientos/${seguimiento.id}/generar-cuestionario`)
        setCuestionario(fallbackResponse.data)
      }
      
      setError(null)
    } catch (err: any) {
      console.error('Error generando cuestionario:', err)
      setError('No se pudo generar el cuestionario')
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
      
      // Enviar respuestas al backend
      await apiClient.put(`/seguimientos/${seguimientoActivo.id}/completar`, respuestas)
      
      // Actualizar lista de seguimientos
      setSeguimientos(prev => prev.filter(s => s.id !== seguimientoActivo.id))
      
      // Limpiar estado
      setSeguimientoActivo(null)
      setCuestionario(null)
      setRespuestas({})
      setError(null)
      
    } catch (err: any) {
      console.error('Error completando seguimiento:', err)
      setError('No se pudo completar el seguimiento')
    } finally {
      setEnviando(false)
    }
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

  // Vista del cuestionario
  if (cuestionario && seguimientoActivo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="size-5 text-green-600" />
            {cuestionario.cuestionario?.titulo || 'Seguimiento Cardiovascular'}
          </CardTitle>
          <CardDescription>
            {cuestionario.cuestionario?.instrucciones || 'Complete las siguientes preguntas'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
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
              onClick={() => {
                setSeguimientoActivo(null)
                setCuestionario(null)
                setRespuestas({})
              }}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vista principal de seguimientos
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5 text-blue-600" />
          Seguimientos Disponibles
        </CardTitle>
        <CardDescription>
          Complete sus seguimientos cardiovasculares programados para hoy
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
            <CheckCircle className="mx-auto size-12 text-green-500 mb-4" />
            <p className="text-slate-600">¡No tienes seguimientos disponibles hoy!</p>
            <p className="text-sm text-slate-400">Vuelve mañana para más seguimientos programados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {seguimientos.map((seguimiento) => (
              <div 
                key={seguimiento.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-orange-500" />
                    <span className="font-medium">Seguimiento {seguimiento.tipo}</span>
                    {renderPrioridad(seguimiento.prioridad)}
                  </div>
                  <span className="text-sm text-slate-500">
                    {new Date(seguimiento.fecha_programada).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 mb-4">
                  {seguimiento.resultado || 'Seguimiento cardiovascular programado'}
                </p>
                
                <Button 
                  onClick={() => iniciarCuestionario(seguimiento)}
                  size="sm"
                  className="w-full"
                >
                  Iniciar Seguimiento
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 