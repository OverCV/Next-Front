// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cloud.appwrite.io', 'spring-logic.onrender.com'],
  },
  env: {
    // Detecta automáticamente el entorno
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
      ? 'https://spring-logic.onrender.com/api'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api',
  },
  experimental: {
    // Habilita la instrumentación para Sentry
    instrumentationHook: true
  }
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "javascript-mastery",
  project: "care-pulse",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  automaticVercelMonitors: true,
});