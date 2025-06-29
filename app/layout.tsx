// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { ThemeToggle } from "@/src/components/ui/theme-toggle";
import { cn } from "@/src/lib/utils";
import { AuthProvider } from "@/src/providers/auth-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sistema de Campañas de Salud",
  description: "Plataforma para la organización y ejecución de campañas de salud enfocadas en el riesgo cardiovascular",
  icons: {
    icon: "/assets/brand/logo-white.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <div className="fixed right-4 top-4 z-50">
              <ThemeToggle />
            </div>

            <div className="min-h-screen pb-16">
              {children}
            </div>

            <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/75 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/75">
              <div className="container mx-auto text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  © Healink 2025 — Campañas de Salud Cardiovascular
                </p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}