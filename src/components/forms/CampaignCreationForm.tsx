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
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { useAuth } from '@/src/providers/auth-provider';
import { CampanaService, CrearCampanaParams } from '@/src/services/CampanaService';
import { ServicioMedico } from '@/src/services/ServicioMedico';
import { FactorRiesgoServicio } from '@/src/services/FactorRiesgo';

import { localizacionesService } from '@/src/services/domain/localizaciones.service';
import { FactorRiesgoModel, Localizacion, ServicioMedicoModel, Usuario } from '@/src/types';
import { ServicioCampanaService } from '@/src/services/ServicioCampana';
import { FactorCampanaService } from '@/src/services/FactorCampana';

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
      className="cursor-pointer"
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
  const { usuario } = useAuth() as { usuario: Usuario | undefined };
  const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([]);
  const [servicios, setServicios] = useState<ServicioMedicoModel[]>([]);
  const [factores, setFactores] = useState<FactorRiesgoModel[]>([]);
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
      localizacionId: undefined,
      fechaInicio: new Date(Date.now() + 86400000), // Mañana
      fechaLimite: new Date(Date.now() + 604800000), // Una semana después
      fechaLimiteInscripcion: new Date(Date.now() + 432000000), // 5 días después
      minParticipantes: 10,
      maxParticipantes: 30,
      serviciosIds: [] as string[],
      factoresIds: [] as string[]
    }
  });

  // Cargar datos necesarios para el formulario - memoized to prevent unnecessary re-creation
  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true);
    try {
      const [localizacionesData, serviciosData, factoresData] = await Promise.all([
        localizacionesService.obtenerLocalizaciones(),
        ServicioMedico.obtenerServiciosMedicos(),
        FactorRiesgoServicio.obtenerFactoresRiesgo()
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
      // Preparar datos para envío (sin servicios ni factores, se asocian después)
      const campanaData: CrearCampanaParams = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fechaInicio: format(data.fechaInicio, 'yyyy-MM-dd'),
        fechaLimite: format(data.fechaLimite, 'yyyy-MM-dd'),
        fechaLimiteInscripcion: format(data.fechaLimiteInscripcion, 'yyyy-MM-dd'),
        minParticipantes: data.minParticipantes,
        maxParticipantes: data.maxParticipantes,
        localizacionId: data.localizacionId,
        estado: "POSTULADA",
        entidadId: usuario?.entidadSaludId
      };
      // Enviar datos al servidor
      let result = await CampanaService.crearCampana(campanaData);

      let campanaID = result?.id;

      onSubmitCampanasFactores(data.serviciosIds, data.factoresIds, campanaID);

      // Resetear formulario
      reset();

      // Notificar éxito
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error al crear campaña:', err);

      // Mensaje de error más específico
      let errorMessage = 'Ocurrió un error al crear la campaña. Por favor, intente nuevamente.';

      if (err.message) {
        if (err.message.includes('servicios médicos')) {
          errorMessage = 'La campaña se creó pero hubo un error al asociar los servicios médicos.';
        } else if (err.message.includes('factores de riesgo')) {
          errorMessage = 'La campaña se creó pero hubo un error al asociar los factores de riesgo.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [usuario, reset, onSuccess, setIsSubmitting, setError]);

  const onSubmitCampanasFactores = async (servicios: string[], factores: string[], campanaID?: number) => {
    // Asociar servicios médicos y factores de riesgo si la campaña se creó exitosamente
    if (campanaID && (servicios.length > 0 || factores.length > 0)) {
      try {
        // Asociar servicios médicos si hay seleccionados
        await ServicioCampanaService.asociarServiciosMedicos(
          campanaID,
          servicios.map(Number)
        );

        await FactorCampanaService.asociarFactoresRiesgo(
          campanaID,
          factores.map(Number)
        );


      } catch (associationError: any) {
        console.warn('Error al asociar servicios o factores de riesgo:', associationError);
        // No lanzamos el error para no fallar la creación de la campaña
        // pero podríamos mostrar una advertencia al usuario
      }
    }

  }

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
        <div className="space-y-4">
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
                    <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 z-10" />
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      onFocus={() => { }}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      className={`w-full rounded-md border ${errors.fechaInicio ? 'border-red-500' : 'border-slate-200'
                        } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                    />
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
                    <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 z-10" />
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      onFocus={() => { }}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      minDate={watch('fechaInicio')}
                      className={`w-full rounded-md border ${errors.fechaLimite ? 'border-red-500' : 'border-slate-200'
                        } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                    />
                  </div>
                )}
              />
              {errors.fechaLimite && (
                <p className="text-sm text-red-500">{errors.fechaLimite.message}</p>
              )}
            </div>
          </div>

          {/* Fecha límite de inscripción */}
          <div className="space-y-2">
            <Label htmlFor="fechaLimiteInscripcion" className={errors.fechaLimiteInscripcion ? 'text-red-500' : ''}>
              Fecha límite de inscripción*
            </Label>
            <Controller
              control={control}
              name="fechaLimiteInscripcion"
              render={({ field }) => (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 z-10" />
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    onFocus={() => { }}
                    locale={es}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    maxDate={watch('fechaLimite')}
                    className={`w-full rounded-md border ${errors.fechaLimiteInscripcion ? 'border-red-500' : 'border-slate-200'
                      } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
                  />
                </div>
              )}
            />
            {errors.fechaLimiteInscripcion && (
              <p className="text-sm text-red-500">{errors.fechaLimiteInscripcion.message}</p>
            )}
            <p className="text-sm text-slate-500">
              Fecha hasta la cual los usuarios pueden inscribirse en la campaña
            </p>
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
          <Label htmlFor="localizacionId" className={errors.localizacionId ? 'text-red-500' : ''}>
            Localización*
          </Label>
          <Controller
            control={control}
            name="localizacionId"
            render={({ field }) => (
              <Select
                value={field.value?.toString() || ""}
                onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
              >
                <SelectTrigger className={errors.localizacionId ? 'border-red-500' : ''}>
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
          {errors.localizacionId && (
            <p className="text-sm text-red-500">{errors.localizacionId.message}</p>
          )}
        </div>

        {/* Servicios médicos */}
        <div className="space-y-2">
          <Label className={errors.serviciosIds ? 'text-red-500' : ''}>
            Servicios médicos ofrecidos
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
                      isChecked={field.value?.some(id => String(id) === String(servicio.id)) || false}
                      onChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value || [], String(servicio.id)]);
                        } else {
                          field.onChange(
                            (field.value || []).filter(id => String(id) !== String(servicio.id))
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
                      isChecked={field.value?.some(id => String(id) === String(factor.id)) || false}
                      onChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, String(factor.id)]);
                        } else {
                          field.onChange(
                            currentValues.filter(id => String(id) !== String(factor.id))
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

      {/* Botones de acción */}
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

