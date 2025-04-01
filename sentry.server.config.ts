import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, IS_PRODUCTION } from "@/src/config/env";

Sentry.init({
  dsn: SENTRY_DSN || undefined,

  // Solo activamos el 10% de trazas en producción
  tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,

  // Modo debug solo en desarrollo
  debug: !IS_PRODUCTION,

  // Solo enviamos eventos en producción
  enabled: !!SENTRY_DSN || IS_PRODUCTION,

  // Desactivamos telemetría interna de Sentry
  skipOpenTelemetrySetup: true,
});