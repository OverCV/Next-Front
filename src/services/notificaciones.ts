// src/services/notificaciones.ts
// import nodemailer from 'nodemailer';
// import twilio from 'twilio';

// Cliente de Twilio (inicializado sólo en el lado del servidor)
// let twilioClient: ReturnType<typeof twilio> | null = null;
// let mailerTransport: nodemailer.Transporter | null = null;

// Inicializar clientes solo en servidor
// if (typeof window === 'undefined') {
//     // Cliente Twilio
//     twilioClient = twilio(
//         process.env.TWILIO_ACCOUNT_SID,
//         process.env.TWILIO_AUTH_TOKEN
//     );

//     // Transportador de email
//     mailerTransport = nodemailer.createTransport({
//         service: process.env.EMAIL_SERVICE || 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });
// }
// import { NextResponse } from 'next/server';
// Twilio solo se importa en el servidor

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