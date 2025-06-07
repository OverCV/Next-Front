"use client";

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { number, z } from 'zod';
import { AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { CampaignCreationSchema } from '@/src/lib/validation';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Checkbox,
} from '@/src/components/ui/checkbox';
import { Badge } from '@/src/components/ui/badge';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { useAuth } from '@/src/providers/auth-provider';
import { CrearCampanaParams } from '@/src/services/CampanaService';
import campanasService from '@/src/services/CampanaService';
import { localizacionesService } from '@/src/services/domain/localizaciones.service';
import { FactorRiesgo, Localizacion, ServicioMedico } from '@/src/types';

// Dynamically import DatePicker to reduce initial bundle size
import dynamic from 'next/dynamic';
const DatePicker = dynamic(() => import('react-datepicker'), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
  ),
});

// Import styles in a separate import to avoid bundling issues
import "react-datepicker/dist/react-datepicker.css";

// Memoized checkbox option component for better performance
const CheckboxOption = memo(({
  id,
  name,
  isChecked,
  onChange
}: {
  id: number;
  name: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={`option-${id}`}
      checked={isChecked}
      onCheckedChange={onChange}
    />
    <label
      htmlFor={`option-${id}`}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {name}
    </label>
  </div>
));
CheckboxOption.displayName = 'CheckboxOption';

// Tipo para los valores del formulario
type CampanaFormValues = z.infer<typeof CampaignCreationSchema>;

interface CampaignCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CampaignCreationForm({ onSuccess, onCancel }: CampaignCreationFormProps) {
  const { usuario } = useAuth();
  const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([]);
  const [servicios, setServicios] = useState<ServicioMedico[]>([]);
  const [factores, setFactores] = useState<FactorRiesgo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Inicializar formulario con react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<CampanaFormValues>({
    resolver: zodResolver(CampaignCreationSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      localizacion: 0,
      fechaInicio: new Date(Date.now() + 86400000), // Mañana
      fechaLimite: new Date(Date.now() + 604800000), // Una semana después
      minParticipantes: 10,
      maxParticipantes: 30,
      serviciosIds: [],
      factoresIds: []
    }
  });

  // Cargar datos necesarios para el formulario - memoized to prevent unnecessary re-creation
  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true);
    try {
      const [localizacionesData, serviciosData, factoresData] = await Promise.all([
        localizacionesService.obtenerLocalizaciones(),
        campanasService.obtenerServiciosMedicos(),
        campanasService.obtenerFactoresRiesgo()
      ]);

      setLocalizaciones(localizacionesData ?? []);
      setServicios(serviciosData ?? []);
      setFactores(factoresData ?? []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar datos necesarios para el formulario. Por favor, intente más tarde.');
    } finally {
      setCargandoDatos(false);
    }
  }, []);

  // Effect for loading data
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Manejar envío del formulario con useCallback to prevent re-creation on each render
  const onSubmit = useCallback(async (data: CampanaFormValues) => {
    if (!usuario) {
      setError('No hay una sesión activa. Inicie sesión nuevamente.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar datos para envío
      const campanaData: CrearCampanaParams = {
        ...data,
        fechaInicio: format(data.fechaInicio, 'yyyy-MM-dd\'T\'HH:mm:ss'),
        fechaLimite: format(data.fechaLimite, 'yyyy-MM-dd\'T\'HH:mm:ss'),
        serviciosIds: data.serviciosIds.map(Number),
        factoresIds: data.factoresIds.map(Number),
      };

      // Enviar datos al servidor
      await campanasService.crearCampana(campanaData);

      // Resetear formulario
      reset();

      // Notificar éxito
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error al crear campaña:', err);
      setError(err.message || 'Ocurrió un error al crear la campaña. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [usuario, reset, onSuccess, setIsSubmitting, setError]);

  // Cancelar formulario - memoized with useCallback
  const handleCancel = useCallback(() => {
    reset();
    if (onCancel) {
      onCancel();
    }
  }, [reset, onCancel]);

  // Valores observados - memoize for performance
  const minParticipantes = watch('minParticipantes');

  // Memoize loading component to prevent unnecessary re-renders
  const loadingComponent = useMemo(() => (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="size-10 animate-spin text-slate-400" />
        <p className="mt-4 text-slate-500">Cargando datos del formulario...</p>
      </div>
    </div>
  ), []);

  // Si está cargando datos
  if (cargandoDatos) {
    return loadingComponent;
  }


  const errorAlert = error ? (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mensaje de error - memoized */}
      {errorAlert}

      <div className="space-y-4">
        {/* Nombre de la campaña */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className={errors.nombre ? 'text-red-500' : ''}>
            Nombre de la campaña*
          </Label>
          <Input
            id="nombre"
            placeholder="Ej. Jornada de Salud Cardiovascular"
            {...register('nombre')}
            className={errors.nombre ? 'border-red-500' : ''}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="descripcion" className={errors.descripcion ? 'text-red-500' : ''}>
            Descripción*
          </Label>
          <Textarea
            id="descripcion"
            placeholder="Describa los objetivos y actividades de esta campaña..."
            rows={4}
            {...register('descripcion')}
            className={errors.descripcion ? 'border-red-500' : ''}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-500">{errors.descripcion.message}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Fecha inicio */}
          <div className="space-y-2">
            <Label htmlFor="fechaInicio" className={errors.fechaInicio ? 'text-red-500' : ''}>
              Fecha de inicio*
            </Label>
            <Controller
              control={control}
              name="fechaInicio"
              render={({ field }) => (
                <div className="relative">
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    locale={es}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    className={`w-full rounded-md border ${errors.fechaInicio ? 'border-red-500' : 'border-slate-200'
                      } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                  />
                  <Calendar className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              )}
            />
            {errors.fechaInicio && (
              <p className="text-sm text-red-500">{errors.fechaInicio.message}</p>
            )}
          </div>

          {/* Fecha límite */}
          <div className="space-y-2">
            <Label htmlFor="fechaLimite" className={errors.fechaLimite ? 'text-red-500' : ''}>
              Fecha límite*
            </Label>
            <Controller
              control={control}
              name="fechaLimite"
              render={({ field }) => (
                <div className="relative">
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    locale={es}
                    dateFormat="dd/MM/yyyy"
                    minDate={watch('fechaInicio')}
                    className={`w-full rounded-md border ${errors.fechaLimite ? 'border-red-500' : 'border-slate-200'
                      } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                  />
                  <Calendar className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              )}
            />
            {errors.fechaLimite && (
              <p className="text-sm text-red-500">{errors.fechaLimite.message}</p>
            )}
          </div>
        </div>

        {/* Participantes */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Mínimo de participantes */}
          <div className="space-y-2">
            <Label htmlFor="minParticipantes" className={errors.minParticipantes ? 'text-red-500' : ''}>
              Mínimo de participantes*
            </Label>
            <Input
              id="minParticipantes"
              type="number"
              min={1}
              {...register('minParticipantes', { valueAsNumber: true })}
              className={errors.minParticipantes ? 'border-red-500' : ''}
            />
            {errors.minParticipantes && (
              <p className="text-sm text-red-500">{errors.minParticipantes.message}</p>
            )}
          </div>

          {/* Máximo de participantes */}
          <div className="space-y-2">
            <Label htmlFor="maxParticipantes" className={errors.maxParticipantes ? 'text-red-500' : ''}>
              Máximo de participantes*
            </Label>
            <Input
              id="maxParticipantes"
              type="number"
              min={minParticipantes}
              {...register('maxParticipantes', { valueAsNumber: true })}
              className={errors.maxParticipantes ? 'border-red-500' : ''}
            />
            {errors.maxParticipantes && (
              <p className="text-sm text-red-500">{errors.maxParticipantes.message}</p>
            )}
          </div>
        </div>

        {/* Localización */}
        <div className="space-y-2">
          <Label htmlFor="localizacionId" className={errors.localizacion ? 'text-red-500' : ''}>
            Localización
          </Label>
          <Controller
            control={control}
            name="localizacion"
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger className={errors.localizacion ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione una localización" />
                </SelectTrigger>
                <SelectContent>
                  {localizaciones.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.municipio}, {loc.departamento}
                      {loc.vereda && ` - ${loc.vereda}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.localizacion && (
            <p className="text-sm text-red-500">{errors.localizacion.message}</p>
          )}
        </div>

        {/* Servicios médicos */}
        <div className="space-y-2">
          <Label className={errors.serviciosIds ? 'text-red-500' : ''}>
            Servicios médicos ofrecidos*
          </Label>
          <div className="grid gap-2 sm:grid-cols-2">
            <Controller
              control={control}
              name="serviciosIds"
              render={({ field }) => (
                <>
                  {servicios.map((servicio) => (
                    <CheckboxOption
                      key={servicio.id}
                      id={servicio.id}
                      name={servicio.nombre}
                      isChecked={field.value.includes(servicio.id.toString())}
                      onChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, servicio.id]);
                        } else {
                          field.onChange(
                            field.value.filter((id) => id !== servicio.id.toString())
                          );
                        }
                      }}
                    />
                  ))}
                </>
              )}
            />
          </div>
          {errors.serviciosIds && (
            <p className="text-sm text-red-500">{errors.serviciosIds.message}</p>
          )}
        </div>

        {/* Factores de riesgo */}
        <div className="space-y-2">
          <Label>Factores de riesgo objetivo</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            <Controller
              control={control}
              name="factoresIds"
              render={({ field }) => (
                <>
                  {factores.map((factor) => (
                    <CheckboxOption
                      key={factor.id}
                      id={factor.id}
                      name={factor.nombre}
                      isChecked={field.value.includes(factor.id.toString()) || false}
                      onChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, factor.id]);
                        } else {
                          field.onChange(
                            currentValues.filter((id) => id !== factor.id.toString())
                          );
                        }
                      }}
                    />
                  ))}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Botones de acción - memoized to prevent re-renders */}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Campaña'
          )}
        </Button>
      </div>
    </form>
  );
}

// Export as memoized component to prevent unnecessary re-renders
export default memo(CampaignCreationForm);

