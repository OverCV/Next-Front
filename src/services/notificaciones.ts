// Servicio para manejar notificaciones SMS y Email
import apiClient from './api';

interface NotificacionSMSResponse {
    success: boolean;
    message: string;
}

interface NotificacionEmailResponse {
    success: boolean;
    message: string;
}

export const notificacionesService = {
    /**
     * Envía un SMS a un número específico
     */
    enviarSMS: async (telefono: string, mensaje: string): Promise<boolean> => {
        try {
            const response = await apiClient.post('/notificaciones/sms', {
                telefono,
                mensaje
            });

            return response.data.success;
        } catch (error) {
            console.error('Error al enviar SMS:', error);
            throw error;
        }
    },

    /**
     * Envía un correo electrónico
     */
    enviarCorreo: async (
        destinatario: string,
        asunto: string,
        contenido: string
    ): Promise<boolean> => {
        try {
            const response = await apiClient.post('/notificaciones/email', {
                destinatario,
                asunto,
                contenido
            });

            return response.data.success;
        } catch (error) {
            console.error('Error al enviar correo:', error);
            throw error;
        }
    }
};