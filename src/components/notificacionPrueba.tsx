"use client";

import { useState } from 'react';
import { notificacionesService } from '@/src/services/notificaciones';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { AlertCircle, Mail, MessageSquare, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/tabs';

export default function NotificacionPrueba() {
    // Estado para SMS
    const [telefono, setTelefono] = useState('');
    const [mensajeSMS, setMensajeSMS] = useState('');
    const [enviandoSMS, setEnviandoSMS] = useState(false);

    // Estado para correo
    const [correo, setCorreo] = useState('');
    const [asunto, setAsunto] = useState('');
    const [cuerpoCorreo, setCuerpoCorreo] = useState('');
    const [enviandoCorreo, setEnviandoCorreo] = useState(false);

    // Estado de resultado
    const [resultado, setResultado] = useState<{ exito: boolean; mensaje: string } | null>(null);

    // Manejar envío de SMS
    const enviarSMS = async () => {
        if (!telefono || !mensajeSMS) {
            setResultado({
                exito: false,
                mensaje: "Por favor complete todos los campos"
            });
            return;
        }

        setEnviandoSMS(true);
        setResultado(null);

        try {
            const enviado = await notificacionesService.enviarSMS(telefono, mensajeSMS);

            setResultado({
                exito: enviado,
                mensaje: enviado
                    ? "SMS enviado correctamente"
                    : "Error al enviar SMS"
            });
        } catch (error) {
            setResultado({
                exito: false,
                mensaje: "Error al enviar SMS: " + (error instanceof Error ? error.message : String(error))
            });
        } finally {
            setEnviandoSMS(false);
        }
    };

    // Manejar envío de correo
    const enviarCorreo = async () => {
        if (!correo || !asunto || !cuerpoCorreo) {
            setResultado({
                exito: false,
                mensaje: "Por favor complete todos los campos"
            });
            return;
        }

        setEnviandoCorreo(true);
        setResultado(null);

        try {
            const enviado = await notificacionesService.enviarCorreo(
                correo,
                asunto,
                cuerpoCorreo
            );

            setResultado({
                exito: enviado,
                mensaje: enviado
                    ? "Correo enviado correctamente"
                    : "Error al enviar correo"
            });
        } catch (error) {
            setResultado({
                exito: false,
                mensaje: "Error al enviar correo: " + (error instanceof Error ? error.message : String(error))
            });
        } finally {
            setEnviandoCorreo(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold">Prueba de Notificaciones</h2>

            {resultado && (
                <Alert
                    variant={resultado.exito ? "default" : "destructive"}
                    className={`mb-6 ${resultado.exito ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50' : ''}`}
                >
                    <AlertCircle className="size-4" />
                    <AlertDescription>{resultado.mensaje}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="sms" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                        <MessageSquare className="size-4" />
                        SMS
                    </TabsTrigger>
                    <TabsTrigger value="correo" className="flex items-center gap-2">
                        <Mail className="size-4" />
                        Correo
                    </TabsTrigger>
                </TabsList>

                {/* Panel SMS */}
                <TabsContent value="sms" className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="telefono" className="mb-2 block text-sm font-medium">
                            Número de teléfono
                        </label>
                        <Input
                            id="telefono"
                            placeholder="Ej. 3101234567"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Ingresa el número sin el código de país. Se asumirá Colombia (+57) si no especificas.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="mensajeSMS" className="mb-2 block text-sm font-medium">
                            Mensaje
                        </label>
                        <Textarea
                            id="mensajeSMS"
                            placeholder="Escriba el mensaje a enviar"
                            rows={3}
                            value={mensajeSMS}
                            onChange={(e) => setMensajeSMS(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={enviarSMS}
                        disabled={enviandoSMS}
                        className="flex w-full items-center justify-center gap-2"
                    >
                        {enviandoSMS ? "Enviando..." : "Enviar SMS"}
                        <Send className="size-4" />
                    </Button>
                </TabsContent>

                {/* Panel Correo */}
                <TabsContent value="correo" className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="correo" className="mb-2 block text-sm font-medium">
                            Correo electrónico
                        </label>
                        <Input
                            id="correo"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="asunto" className="mb-2 block text-sm font-medium">
                            Asunto
                        </label>
                        <Input
                            id="asunto"
                            placeholder="Asunto del correo"
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="cuerpoCorreo" className="mb-2 block text-sm font-medium">
                            Mensaje
                        </label>
                        <Textarea
                            id="cuerpoCorreo"
                            placeholder="Contenido del correo"
                            rows={5}
                            value={cuerpoCorreo}
                            onChange={(e) => setCuerpoCorreo(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={enviarCorreo}
                        disabled={enviandoCorreo}
                        className="flex w-full items-center justify-center gap-2"
                    >
                        {enviandoCorreo ? "Enviando..." : "Enviar Correo"}
                        <Send className="size-4" />
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}