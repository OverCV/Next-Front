// app/api/notificaciones/email/route.ts - Versión mejorada
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { destinatario, asunto, contenido } = body;

        if (!destinatario || !asunto || !contenido) {
            return NextResponse.json(
                { success: false, message: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Opciones más detalladas para Gmail
        const transporterOptions = {
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            debug: true, // Ayuda a diagnóstico
            logger: true, // Muestra logs detallados
        };

        console.log("Intentando configurar transportador con:", {
            service: transporterOptions.service,
            user: process.env.EMAIL_USER ? "✓ configurado" : "✗ no configurado",
            pass: process.env.EMAIL_PASSWORD ? "✓ configurado" : "✗ no configurado"
        });

        // Crear transportador
        const transporter = nodemailer.createTransport(transporterOptions);

        // Verificar conexión
        await transporter.verify();
        console.log("Verificación de servidor de correo exitosa");

        // Enviar correo
        const info = await transporter.sendMail({
            from: `"Sistema de Campañas" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: contenido
        });

        console.log("Correo enviado:", info.messageId);

        return NextResponse.json({
            success: true,
            message: "Correo enviado correctamente",
            messageId: info.messageId
        });
    } catch (error) {
        console.error("Error detallado al enviar correo:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al enviar correo",
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}