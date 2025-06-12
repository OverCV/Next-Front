import { prediccionesService } from './predicciones.service'
import { seguimientosService } from '../seguimientos'
import apiSpringClient from '../api'
import { ENDPOINTS } from '../auth/endpoints'

interface CitacionConSeguimientos {
    citacion_id: number
    paciente_id: number
    estado: string
    fecha_atencion?: string
    campana_id?: number
    tiene_seguimientos: boolean
    seguimientos_count: number
}

interface DatosGeneracionSeguimientos {
    evento: string
    paciente_id: number
    citacion_id?: number
    campana_id?: number
    fecha_atencion: string
    historial_clinico: any
    timestamp: number
}

export const seguimientosAutomaticosService = {
    /**
     * Verificar si un paciente tiene citaciones ATENDIDAS sin seguimientos
     */
    verificarCitacionesSinSeguimientos: async (pacienteId: number): Promise<CitacionConSeguimientos[]> => {
        console.log('🔍 Verificando citaciones sin seguimientos para paciente:', pacienteId)
        
        try {
            // Obtener citaciones del paciente directamente desde Spring Boot
            const response = await apiSpringClient.get(`/citaciones-medicas/paciente/${pacienteId}`)
            const todasCitaciones = response.data || []
            
            // Filtrar solo las citaciones ATENDIDAS
            const citacionesAtendidas = todasCitaciones.filter((c: any) => c.estado === 'ATENDIDA')
            
            if (!citacionesAtendidas || citacionesAtendidas.length === 0) {
                console.log('ℹ️ No hay citaciones atendidas para el paciente')
                return []
            }

            // Obtener todos los seguimientos del paciente
            const seguimientosPaciente = await seguimientosService.obtenerPorPaciente(pacienteId)
            
            // Analizar cada citación atendida
            const citacionesAnalisis: CitacionConSeguimientos[] = []
            
            for (const citacion of citacionesAtendidas) {
                // Buscar seguimientos asociados a esta citación específica
                const seguimientosCitacion = seguimientosPaciente.filter(s => 
                    s.citacion_id === citacion.id
                )
                
                citacionesAnalisis.push({
                    citacion_id: citacion.id,
                    paciente_id: pacienteId,
                    estado: citacion.estado,
                    fecha_atencion: citacion.horaAtencion || citacion.fechaActualizacion,
                    campana_id: citacion.campanaMedica?.id,
                    tiene_seguimientos: seguimientosCitacion.length > 0,
                    seguimientos_count: seguimientosCitacion.length
                })
            }
            
            console.log('✅ Análisis de citaciones completado:', citacionesAnalisis)
            return citacionesAnalisis
            
        } catch (error) {
            console.error('❌ Error verificando citaciones sin seguimientos:', error)
            return []
        }
    },

    /**
     * Generar seguimientos para una citación específica usando el workflow de n8n
     */
    generarSeguimientosParaCitacion: async (citacionId: number, pacienteId: number, campanaId?: number): Promise<any> => {
        console.log('🚀 Generando seguimientos para citación:', citacionId)
        
        try {
            // Obtener historial clínico del paciente
            const historialCompleto = await seguimientosAutomaticosService.obtenerHistorialClinico(pacienteId)
            
            // Preparar datos para el webhook de n8n (según el formato del workflow)
            const datosGeneracion: DatosGeneracionSeguimientos = {
                evento: 'citacion_atendida',
                paciente_id: pacienteId,
                citacion_id: citacionId,
                campana_id: campanaId,
                fecha_atencion: new Date().toISOString(),
                historial_clinico: historialCompleto,
                timestamp: Date.now()
            }

            // Llamar al webhook del workflow "Generador de seguimientos"
            const webhookUrl = `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook'}/orquestador-seguimientos`
            
            console.log('📡 Enviando datos al webhook de n8n:', webhookUrl)
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosGeneracion)
            })

            if (!response.ok) {
                throw new Error(`Error en webhook n8n: ${response.status} ${response.statusText}`)
            }

            const resultado = await response.json()
            console.log('✅ Seguimientos generados exitosamente:', resultado)
            
            return resultado
            
        } catch (error) {
            console.error('❌ Error generando seguimientos:', error)
            throw error
        }
    },

    /**
     * Obtener historial clínico completo del paciente
     */
    obtenerHistorialClinico: async (pacienteId: number): Promise<any> => {
        console.log('🏥 Obteniendo historial clínico para paciente:', pacienteId)
        
        try {
            // Obtener triaje del paciente desde Spring Boot
            let triajeData = {}
            try {
                const responseTriaje = await apiSpringClient.get(`/triaje/paciente/${pacienteId}`)
                if (responseTriaje.data && responseTriaje.data.length > 0) {
                    triajeData = responseTriaje.data[0] // Triaje más reciente
                }
            } catch (error) {
                console.warn('⚠️ No se pudo obtener triaje:', error)
            }

            // Obtener predicciones de riesgo desde Spring Boot
            let prediccionRiesgo = {}
            try {
                const responsePred = await apiSpringClient.get(`/predicciones/paciente/${pacienteId}`)
                if (responsePred.data && responsePred.data.length > 0) {
                    prediccionRiesgo = responsePred.data[0] // Predicción más reciente
                }
            } catch (error) {
                console.warn('⚠️ No se pudieron obtener predicciones:', error)
            }

            // Intentar obtener datos cardiovasculares desde FastAPI
            let datosCardiovasculares = {}
            try {
                const responseCV = await fetch(`${ENDPOINTS.FASTAPI.BASE}/api/pacientes/${pacienteId}/datos-cardiovasculares`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                if (responseCV.ok) {
                    datosCardiovasculares = await responseCV.json()
                }
            } catch (error) {
                console.warn('⚠️ No se pudieron obtener datos cardiovasculares:', error)
            }

            const historialCompleto = {
                paciente_id: pacienteId,
                datos_cardiovasculares: datosCardiovasculares,
                triaje_inicial: triajeData,
                prediccion_riesgo: prediccionRiesgo,
                timestamp: new Date().toISOString()
            }

            console.log('✅ Historial clínico obtenido:', Object.keys(historialCompleto))
            return historialCompleto
            
        } catch (error) {
            console.error('❌ Error obteniendo historial clínico:', error)
            // Retornar estructura mínima en caso de error
            return {
                paciente_id: pacienteId,
                datos_cardiovasculares: {},
                triaje_inicial: {},
                prediccion_riesgo: {},
                timestamp: new Date().toISOString()
            }
        }
    },

    /**
     * Validar y generar seguimientos faltantes para un paciente
     */
    validarYGenerarSeguimientos: async (pacienteId: number): Promise<{
        citaciones_analizadas: number
        citaciones_sin_seguimientos: number
        seguimientos_generados: number
        errores: string[]
    }> => {
        console.log('🔎 Iniciando validación completa de seguimientos para paciente:', pacienteId)
        
        const resultado = {
            citaciones_analizadas: 0,
            citaciones_sin_seguimientos: 0,
            seguimientos_generados: 0,
            errores: [] as string[]
        }

        try {
            // Verificar citaciones sin seguimientos
            const citacionesAnalisis = await seguimientosAutomaticosService.verificarCitacionesSinSeguimientos(pacienteId)
            resultado.citaciones_analizadas = citacionesAnalisis.length

            // Filtrar citaciones que no tienen seguimientos
            const citacionesSinSeguimientos = citacionesAnalisis.filter(c => !c.tiene_seguimientos)
            resultado.citaciones_sin_seguimientos = citacionesSinSeguimientos.length

            console.log(`📊 Análisis completado: ${resultado.citaciones_analizadas} citaciones analizadas, ${resultado.citaciones_sin_seguimientos} sin seguimientos`)

            // Solo generar seguimientos si hay citaciones que lo necesiten
            if (citacionesSinSeguimientos.length === 0) {
                console.log('✅ Todas las citaciones atendidas ya tienen seguimientos asociados')
                return resultado
            }

            // Generar seguimientos para cada citación que lo necesite
            for (const citacion of citacionesSinSeguimientos) {
                try {
                    console.log(`🔧 Generando seguimientos para citación ${citacion.citacion_id}`)
                    
                    await seguimientosAutomaticosService.generarSeguimientosParaCitacion(
                        citacion.citacion_id, 
                        pacienteId, 
                        citacion.campana_id
                    )
                    
                    resultado.seguimientos_generados++
                    console.log(`✅ Seguimientos generados para citación ${citacion.citacion_id}`)
                    
                } catch (error) {
                    const errorMsg = `Error generando seguimientos para citación ${citacion.citacion_id}: ${error}`
                    console.error('❌', errorMsg)
                    resultado.errores.push(errorMsg)
                }
            }

            console.log(`🎯 Proceso completado: ${resultado.seguimientos_generados} seguimientos generados, ${resultado.errores.length} errores`)
            return resultado

        } catch (error) {
            console.error('❌ Error en validación completa de seguimientos:', error)
            resultado.errores.push(`Error general: ${error}`)
            return resultado
        }
    }
} 