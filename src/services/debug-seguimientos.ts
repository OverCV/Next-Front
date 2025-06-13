import apiSpringClient from './api'
import { seguimientosService } from './seguimientos'

export const debugSeguimientos = {
    /**
     * Probar el endpoint de seguimientos directamente
     */
    async probarEndpoint(pacienteId: number) {
        console.log('🔍 DEBUGGING: Probando endpoint de seguimientos para paciente:', pacienteId)
        
        try {
            // Probar ruta directa
            console.log('📡 Probando ruta: /seguimientos/paciente/' + pacienteId)
            const response1 = await apiSpringClient.get(`/seguimientos/paciente/${pacienteId}`)
            console.log('✅ Respuesta exitosa ruta directa:', response1.data)
            return response1.data
        } catch (error1) {
            console.error('❌ Error ruta directa:', error1)
            
            try {
                // Probar ruta con /api
                console.log('📡 Probando ruta con /api: /api/seguimientos/paciente/' + pacienteId)
                const response2 = await apiSpringClient.get(`/api/seguimientos/paciente/${pacienteId}`)
                console.log('✅ Respuesta exitosa ruta con /api:', response2.data)
                return response2.data
            } catch (error2) {
                console.error('❌ Error ruta con /api:', error2)
                
                // Intentar usando fetch directo
                try {
                    console.log('📡 Probando fetch directo a: http://localhost:8090/api/seguimientos/paciente/' + pacienteId)
                    const response3 = await fetch(`http://localhost:8090/api/seguimientos/paciente/${pacienteId}`)
                    console.log('📊 Status fetch directo:', response3.status)
                    if (response3.ok) {
                        const data = await response3.json()
                        console.log('✅ Respuesta exitosa fetch directo:', data)
                        return data
                    } else {
                        console.error('❌ Fetch directo falló:', response3.status, response3.statusText)
                    }
                } catch (error3) {
                    console.error('❌ Error fetch directo:', error3)
                }
            }
        }
        
        return null
    },

    /**
     * Verificar la configuración del cliente API
     */
    verificarConfiguracion() {
        console.log('🔍 DEBUGGING: Verificando configuración del cliente API')
        console.log('📡 Base URL:', apiSpringClient.defaults.baseURL)
        console.log('📡 Headers:', apiSpringClient.defaults.headers)
        
        // Verificar variables de entorno
        console.log('🌍 Env API_SPRINGBOOT_URL:', process.env.NEXT_PUBLIC_API_SPRINGBOOT_URL)
    },

    /**
     * Probar el servicio de seguimientos
     */
    async probarServicio(pacienteId: number) {
        console.log('🔍 DEBUGGING: Probando servicio de seguimientos')
        
        try {
            const seguimientos = await seguimientosService.obtenerPorPaciente(pacienteId)
            console.log('✅ Servicio funcionó:', seguimientos)
            return seguimientos
        } catch (error) {
            console.error('❌ Error en servicio:', error)
            return null
        }
    }
}

export default debugSeguimientos 