import { notificacionesService } from "@/src/services/notificaciones";

/**
 * Envía una notificación por SMS cuando se programa una cita médica
 */
export const enviarNotificacionCitaProgramada = async (
    telefono: string,
    nombrePaciente: string,
    fecha: string,
    hora: string,
    doctor: string
): Promise<boolean> => {
    try {
        const mensaje = `Hola ${nombrePaciente}, tu cita ha sido programada para el ${fecha} a las ${hora} con el Dr. ${doctor}. Gracias por usar nuestro servicio de campañas de salud.`;

        return await notificacionesService.enviarSMS(telefono, mensaje);
    } catch (error) {
        console.error("Error al enviar notificación de cita programada:", error);
        return false;
    }
};

/**
 * Envía una notificación por SMS cuando se cancela una cita médica
 */
export const enviarNotificacionCitaCancelada = async (
    telefono: string,
    nombrePaciente: string,
    fecha: string,
    razon: string
): Promise<boolean> => {
    try {
        const mensaje = `Hola ${nombrePaciente}, lamentamos informarte que tu cita programada para el ${fecha} ha sido cancelada. Motivo: ${razon}. Nos pondremos en contacto contigo para reprogramarla.`;

        return await notificacionesService.enviarSMS(telefono, mensaje);
    } catch (error) {
        console.error("Error al enviar notificación de cita cancelada:", error);
        return false;
    }
};

/**
 * Envía un correo de confirmación cuando un usuario se registra
 */
export const enviarCorreoRegistroExitoso = async (
    correo: string,
    nombre: string
): Promise<boolean> => {
    try {
        const asunto = "Bienvenido a nuestro sistema de campañas de salud";
        const contenido = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">¡Bienvenido, ${nombre}!</h2>
        <p>Tu registro en nuestro sistema de campañas de salud ha sido exitoso.</p>
        <p>Ahora podrás programar citas médicas y recibir notificaciones sobre nuestras campañas de salud.</p>
        <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 14px;">Este es un correo automático, por favor no responda a este mensaje.</p>
      </div>
    `;

        return await notificacionesService.enviarCorreo(correo, asunto, contenido);
    } catch (error) {
        console.error("Error al enviar correo de registro exitoso:", error);
        return false;
    }
};

/**
 * Envía notificaciones cuando un paciente completa exitosamente un seguimiento
 */
export const enviarNotificacionSeguimientoCompletado = async (
    telefono: string,
    correo: string,
    nombrePaciente: string,
    tipoSeguimiento: string,
    fechaCompletado: string
): Promise<{ smsEnviado: boolean; correoEnviado: boolean }> => {
    const resultados = { smsEnviado: false, correoEnviado: false };

    try {
        // Mensaje personalizado para SMS
        const mensajeSMS = `¡Hola ${nombrePaciente}! Has completado exitosamente tu seguimiento cardiovascular "${tipoSeguimiento}" el ${fechaCompletado}. Gracias por cuidar tu salud. Tu equipo médico revisará tus respuestas y te contactará si es necesario.`;

        // Contenido del correo electrónico
        const asuntoCorreo = "Seguimiento Cardiovascular Completado";
        const contenidoCorreo = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">¡Seguimiento Completado!</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sistema de Campañas de Salud Cardiovascular</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #4a5568; margin-top: 0;">Estimado/a ${nombrePaciente},</h2>
                    
                    <p style="color: #2d3748; line-height: 1.6;">
                        ¡Felicitaciones! Has completado exitosamente tu seguimiento cardiovascular:
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38a169;">
                        <h3 style="color: #38a169; margin-top: 0;">📋 Detalles del Seguimiento</h3>
                        <p style="margin: 5px 0;"><strong>Tipo:</strong> ${tipoSeguimiento}</p>
                        <p style="margin: 5px 0;"><strong>Fecha completado:</strong> ${fechaCompletado}</p>
                        <p style="margin: 5px 0;"><strong>Estado:</strong> ✅ Completado exitosamente</p>
                    </div>
                    
                    <h3 style="color: #4a5568;">¿Qué sigue ahora?</h3>
                    <ul style="color: #2d3748; line-height: 1.6;">
                        <li>Tu equipo médico revisará tus respuestas detalladamente</li>
                        <li>Si requieres atención adicional, nos pondremos en contacto contigo</li>
                        <li>Continúa siguiendo las recomendaciones médicas proporcionadas</li>
                        <li>Mantén tus hábitos saludables y toma tus medicamentos según lo prescrito</li>
                    </ul>
                    
                    <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #2c5aa0; font-weight: bold;">💡 Recuerda:</p>
                        <p style="margin: 5px 0 0 0; color: #2c5aa0;">Tu salud cardiovascular es nuestra prioridad. Si tienes alguna emergencia, contacta inmediatamente a tu médico o dirígete al centro de salud más cercano.</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #718096; font-size: 14px; margin: 0;">
                        Este es un correo automático del Sistema de Campañas de Salud. Por favor no responder a este mensaje.
                        <br>Si tienes preguntas, contacta a tu equipo médico a través de los canales oficiales.
                    </p>
                </div>
            </div>
        `;

        // Enviar SMS (si hay teléfono)
        if (telefono && telefono.trim() !== '') {
            try {
                resultados.smsEnviado = await notificacionesService.enviarSMS(telefono, mensajeSMS);
                console.log("✅ SMS de seguimiento completado enviado correctamente");
            } catch (error) {
                console.error("❌ Error al enviar SMS de seguimiento:", error);
            }
        }

        // Enviar correo (si hay email)
        if (correo && correo.trim() !== '' && correo !== `${telefono}@healink.com`) {
            try {
                resultados.correoEnviado = await notificacionesService.enviarCorreo(correo, asuntoCorreo, contenidoCorreo);
                console.log("✅ Correo de seguimiento completado enviado correctamente");
            } catch (error) {
                console.error("❌ Error al enviar correo de seguimiento:", error);
            }
        }

        console.log("📊 Resultado notificaciones seguimiento:", resultados);
        return resultados;

    } catch (error) {
        console.error("❌ Error general al enviar notificaciones de seguimiento:", error);
        return resultados;
    }
};