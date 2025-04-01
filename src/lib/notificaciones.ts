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