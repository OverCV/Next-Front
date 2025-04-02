// import { Citacion } from '@/src/types';

// import apiClient from './api';

// // Mock data para desarrollo
// const MOCK_CITACIONES = [
//     {
//         id: 1,
//         pacienteId: 101,
//         campanaId: 1,
//         medicoId: 201,
//         horaProgramada: new Date(new Date().setHours(9, 0, 0)).toISOString(),
//         duracionEstimada: 30,
//         estado: 'AGENDADA',
//         prediccionAsistencia: 85,
//         prioridad: 3,
//         razon: "Control de hipertensión arterial",
//         notas: "Paciente con medicación actual: Losartan 50mg",
//         paciente: {
//             nombres: "Juan",
//             apellidos: "Pérez",
//             tipoIdentificacion: "cc",
//             identificacion: "1234567890",
//             celular: "3101234567"
//         }
//     },
//     {
//         id: 2,
//         pacienteId: 102,
//         campanaId: 1,
//         medicoId: 201,
//         horaProgramada: new Date(new Date().setHours(10, 0, 0)).toISOString(),
//         duracionEstimada: 20,
//         estado: 'AGENDADA',
//         prediccionAsistencia: 92,
//         prioridad: 4,
//         razon: "Dolor en el pecho al realizar actividad física",
//         notas: "Posible angina de esfuerzo",
//         paciente: {
//             nombres: "María",
//             apellidos: "González",
//             tipoIdentificacion: "cc",
//             identificacion: "0987654321",
//             celular: "3109876543"
//         }
//     }
// ];

// // Servicio para gestionar citaciones
// export const citacionesService = {
//     /**
//      * Obtiene todas las citaciones de un médico para una fecha específica
//      */
//     obtenerCitacionesMedico: async (medicoId: number, fecha?: Date): Promise<Citacion[]> => {
//         try {
//             const formattedDate = fecha ? fecha.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
//             const response = await apiClient.get(`/citaciones/medico/${medicoId}?fecha=${formattedDate}`);
//             return response.data;
//         } catch (error) {
//             console.error('Error al obtener citaciones del médico:', error);
//             // Para desarrollo, retornar datos mock
//             return MOCK_CITACIONES;
//         }
//     },

//     /**
//      * Obtiene estadísticas del médico
//      */
//     obtenerEstadisticasMedico: async (medicoId: number): Promise<any> => {
//         try {
//             const response = await apiClient.get(`/citaciones/estadisticas/${medicoId}`);
//             return response.data;
//         } catch (error) {
//             console.error('Error al obtener estadísticas del médico:', error);
//             // Datos mock para desarrollo
//             return {
//                 atendidos: 18,
//                 pendientes: 5,
//                 total: 23,
//                 campanasActivas: 2
//             };
//         }
//     },

//     /**
//      * Obtiene una citación específica por su ID
//      */
//     obtenerCitacionPorId: async (citacionId: number): Promise<Citacion> => {
//         try {
//             const response = await apiClient.get(`/citaciones/${citacionId}`);
//             return response.data;
//         } catch (error) {
//             console.error('Error al obtener citación por ID:', error);
//             // Para desarrollo, retornar el primero de los mock como ejemplo
//             return MOCK_CITACIONES[0];
//         }
//     },

//     /**
//      * Actualiza el estado de una citación
//      */
//     actualizarEstadoCitacion: async (citacionId: number, estado: string): Promise<Citacion> => {
//         try {
//             const response = await apiClient.patch(`/citaciones/${citacionId}/estado`, { estado });
//             return response.data;
//         } catch (error) {
//             console.error('Error al actualizar estado de citación:', error);
//             throw error;
//         }
//     },

//     /**
//      * Recalcula las prioridades de las citaciones
//      */
//     recalcularPrioridades: async (medicoId: number): Promise<void> => {
//         try {
//             await apiClient.post(`/citaciones/recalcular-prioridades/${medicoId}`);
//         } catch (error) {
//             console.error('Error al recalcular prioridades:', error);
//             throw error;
//         }
//     }
// };