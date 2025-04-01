import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, IS_PRODUCTION } from "@/src/config/env";

// Solo activamos funcionalidades completas de Sentry si tenemos un DSN
// En caso contrario, creamos una inicialización mínima
Sentry.init({
  dsn: SENTRY_DSN || undefined,

  // Solo activamos el 10% de trazas en producción, pero 100% en desarrollo
  tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,

  // Habilitamos debugging solo en desarrollo
  debug: !IS_PRODUCTION,

  // Solo capturamos el 10% de los errores en producción para no saturar
  replaysOnErrorSampleRate: IS_PRODUCTION ? 0.1 : 1.0,

  // Solo habilitamos recolección de datos en producción
  replaysSessionSampleRate: IS_PRODUCTION ? 0.05 : 0,

  // Configuración para proteger datos sensibles
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Solo enviamos eventos en producción
  enabled: !!SENTRY_DSN || IS_PRODUCTION,

  // Desactivamos telemetría interna de Sentry
  skipOpenTelemetrySetup: true,
});