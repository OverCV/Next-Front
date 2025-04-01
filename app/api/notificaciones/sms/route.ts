import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Inicializar cliente de Twilio
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { telefono, mensaje } = body;

        // Validación básica
        if (!telefono || !mensaje) {
            return NextResponse.json(
                { success: false, message: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Asegurarnos que el formato del teléfono sea correcto
        // Twilio necesita formato internacional: +57XXXXXXXXXX para Colombia
        let telefonoFormateado = telefono;
        let prefijoColombia = '57';
        if (!telefono.startsWith('+')) {
            // Asumimos Colombia si no se especifica el código de país
            telefonoFormateado = `+${prefijoColombia}${telefono}`;
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