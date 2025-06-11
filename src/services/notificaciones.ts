export const notificacionesService = {
    /**
     * Envía un SMS usando Twilio directamente
     */
    enviarSMS: async (telefono: string, mensaje: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/notificaciones/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telefono, mensaje })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error al enviar SMS:', error);
            throw error;
        }
    },

    /**
     * Envía un correo electrónico usando la API route
     */
    enviarCorreo: async (
        destinatario: string,
        asunto: string,
        contenido: string
    ): Promise<boolean> => {
        try {
            const response = await fetch('/api/notificaciones/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinatario, asunto, contenido })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error al enviar correo:', error);
            throw error;
        }
    }
};