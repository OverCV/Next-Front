// app/api/notificaciones/sms/route.ts
import { NextResponse } from 'next/server';
// Twilio solo se importa en el servidor
import twilio from 'twilio';

// Este código solo se ejecuta en el servidor
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { telefono, mensaje } = body;

        if (!telefono || !mensaje) {
            return NextResponse.json(
                { success: false, message: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Inicializar cliente de Twilio
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        // Formato para Colombia si no incluye código de país
        let telefonoFormateado = telefono;
        if (!telefono.startsWith('+')) {
            telefonoFormateado = `+57${telefono}`;
        }

        // Enviar SMS
        const message = await client.messages.create({
            body: mensaje,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: telefonoFormateado
        });

        return NextResponse.json({
            success: true,
            message: "SMS enviado correctamente",
            sid: message.sid
        });
    } catch (error) {
        console.error("Error al enviar SMS:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al enviar SMS",
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}