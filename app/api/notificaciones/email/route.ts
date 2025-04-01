import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { destinatario, asunto, contenido } = body;

        // Validación básica
        if (!destinatario || !asunto || !contenido) {
            return NextResponse.json(
                { success: false, message: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Opciones del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: destinatario,
            subject: asunto,
            html: contenido
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "Correo enviado correctamente"
        });
    } catch (error) {
        console.error("Error al enviar correo:", error);
        return NextResponse.json(
            { success: false, message: "Error al enviar correo" },
            { status: 500 }
        );
    }
}