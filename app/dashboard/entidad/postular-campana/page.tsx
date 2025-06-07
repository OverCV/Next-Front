"use client";

import { useState, useCallback, Suspense, lazy, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Megaphone, Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';

// Lazy load the CampaignCreationForm component
const CampaignCreationForm = lazy(() =>
  import('@/src/components/forms/CampaignCreationForm')
);

// Loading component for Suspense fallback
const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 w-full max-w-md rounded bg-slate-200 dark:bg-slate-700"></div>
    <div className="h-32 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
    </div>
    <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="h-6 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-6 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-6 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-6 rounded bg-slate-200 dark:bg-slate-700"></div>
    </div>
    <div className="flex justify-end gap-2">
      <div className="h-9 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-9 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
    </div>
  </div>
);

export default function PostularCampanaPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manejar navegación de regreso al dashboard
  const handleBack = useCallback(() => {
    if (!isLoading) {
      router.push('/dashboard/entidad');
    }
  }, [router, isLoading]);

  // Manejar éxito en la creación de campaña
  const handleSuccess = useCallback(() => {
    // Mostrar mensaje de éxito
    setSuccess(true);
    setIsLoading(true);

    // Redireccionar después de 2 segundos
    setTimeout(() => {
      router.push('/dashboard/entidad');
    }, 2000);
  }, [router]);

  // Memoize the header content to prevent unnecessary re-renders
  const headerContent = useMemo(() => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
          aria-label="Volver al dashboard"
          disabled={isLoading}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Postular Nueva Campaña</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Megaphone className="size-4" />
        <span>Complete el formulario para postular una nueva campaña de salud</span>
      </div>
    </div>
  ), [handleBack, isLoading]);

  // Memoize the information section
  const informationSection = useMemo(() => (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="font-medium">Información importante</h3>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-500 dark:text-slate-400">
        <li>Las campañas postuladas serán revisadas por el equipo administrativo antes de ser aprobadas.</li>
        <li>Una vez aprobada, la campaña pasará al estado "En Ejecución".</li>
        <li>Podrá monitorear el estado de su campaña desde el dashboard de entidad.</li>
        <li>Para modificar una campaña después de postulada, deberá contactar al soporte técnico.</li>
      </ul>
    </div>
  ), []);

  return (
    <div className="space-y-6">
      {/* Cabecera (memoizada) */}
      {headerContent}

      {/* Mensaje de éxito o cargando */}
      {success && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300">
          <Check className="size-4" />
          <AlertDescription className="flex items-center gap-2">
            Campaña creada exitosamente. Redireccionando al dashboard...
            <Loader2 className="ml-2 size-4 animate-spin" />
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido principal */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Detalles de la Campaña</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ingrese los detalles de la campaña de salud que desea postular. Los campos marcados con * son obligatorios.
          </p>
        </div>

        {/* Formulario de creación de campaña con lazy loading */}
        <Suspense fallback={<FormSkeleton />}>
          <CampaignCreationForm
            onSuccess={handleSuccess}
            onCancel={handleBack}
          />
        </Suspense>
      </div>

      {/* Información adicional (memoizada) */}
      {informationSection}
    </div>
  );
}

