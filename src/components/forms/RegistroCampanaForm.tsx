"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { CampaignCreationSchema } from '@/src/lib/validation'
import { useAuth } from '@/src/providers/auth-provider'
import { CampanaService } from '@/src/services/domain/campana.service'
import { FactorCampanaService } from '@/src/services/domain/factor-campana.service'
import { FactorRiesgoServicio } from '@/src/services/domain/factor-riesgo.service'
import { localizacionesService } from '@/src/services/domain/localizaciones.service'
import { ServicioCampanaService } from '@/src/services/domain/servicio-campana.service'
import { ServicioMedicoService } from '@/src/services/domain/servicio-medico.service'
import { FactorRiesgo, Localizacion, ServicioMedico, Usuario, CrearCampanaParams as CrearCampana, EstadoCampana, UsuarioAccedido } from '@/src/types'

import { BasicInformationSection } from './campaign-creation/BasicInformationSection'
import { DatesSection } from './campaign-creation/DatesSection'
import { ParticipantsSection } from './campaign-creation/ParticipantsSection'
import { ServicesAndFactorsSection } from './campaign-creation/ServicesAndFactorsSection'
import { CampanaFormValues } from './campaign-creation/types'

interface CampaignCreationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

function CampaignCreationForm({ onSuccess, onCancel }: CampaignCreationFormProps) {
  const { usuario } = useAuth() as { usuario: UsuarioAccedido | undefined }
  const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([])
  const [servicios, setServicios] = useState<ServicioMedico[]>([])
  const [factores, setFactores] = useState<FactorRiesgo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargandoDatos, setCargandoDatos] = useState(true)

  // Inicializar formulario con react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
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
  })

  // Cargar datos necesarios para el formulario
  const cargarDatos = useCallback(async () => {
    setCargandoDatos(true)
    try {
      const [localizacionesData, serviciosData, factoresData] = await Promise.all([
        localizacionesService.obtenerLocalizaciones(),
        ServicioMedicoService.obtenerServiciosMedicos(),
        FactorRiesgoServicio.obtenerFactoresRiesgo()
      ])

      setLocalizaciones(localizacionesData ?? [])
      setServicios(serviciosData ?? [])
      setFactores(factoresData ?? [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('Error al cargar datos necesarios para el formulario. Por favor, intente más tarde.')
    } finally {
      setCargandoDatos(false)
    }
  }, [])

  // Effect para cargar datos
  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  // Enviar datos asociados (servicios y factores)
  const enviarDatosAsociados = useCallback(async (servicios: string[], factores: string[], campanaID?: number) => {
    if (campanaID && (servicios.length > 0 || factores.length > 0)) {
      try {
        await Promise.all([
          servicios.length > 0 && ServicioCampanaService.asociarServiciosMedicos(
            campanaID,
            servicios.map(Number)
          ),
          factores.length > 0 && FactorCampanaService.asociarFactoresRiesgo(
            campanaID,
            factores.map(Number)
          )
        ])
      } catch (associationError: any) {
        console.warn('Error al asociar servicios o factores de riesgo:', associationError)
        // No lanzamos el error para no fallar la creación de la campaña
      }
    }
  }, [])

  // Manejar envío del formulario
  const onSubmit = useCallback(async (data: CampanaFormValues) => {
    // Validación simple: verificar que existe usuario
    if (!usuario || !usuario.id) {
      setError('No hay una sesión activa. Inicie sesión nuevamente')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Preparar datos para envío
      const campanaData: CrearCampana = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fechaInicio: data.fechaInicio.toISOString().split('T')[0],
        fechaLimite: data.fechaLimite.toISOString().split('T')[0],
        fechaLimiteInscripcion: data.fechaLimiteInscripcion.toISOString().split('T')[0],
        minParticipantes: data.minParticipantes,
        maxParticipantes: data.maxParticipantes,
        localizacionId: data.localizacionId,
        estado: EstadoCampana.POSTULADA,
        entidadId: usuario.id
      }

      // Crear campaña
      const result = await CampanaService.crearCampana(campanaData)

      // Asociar servicios y factores
      await enviarDatosAsociados(data.serviciosIds, data.factoresIds, result?.id)

      // Resetear formulario y notificar éxito
      reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Error al crear campaña:', err)

      let errorMessage = 'Ocurrió un error al crear la campaña. Por favor, intente nuevamente.'
      if (err.message) {
        if (err.message.includes('servicios médicos')) {
          errorMessage = 'La campaña se creó pero hubo un error al asociar los servicios médicos.'
        } else if (err.message.includes('factores de riesgo')) {
          errorMessage = 'La campaña se creó pero hubo un error al asociar los factores de riesgo.'
        } else {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }, [usuario, reset, onSuccess, enviarDatosAsociados])

  // Cancelar formulario
  const handleCancel = useCallback(() => {
    reset()
    if (onCancel) {
      onCancel()
    }
  }, [reset, onCancel])

  // Componente de carga memoizado
  const loadingComponent = useMemo(() => (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="size-10 animate-spin text-slate-400" />
        <p className="mt-4 text-slate-500">Cargando datos del formulario...</p>
      </div>
    </div>
  ), [])

  // Si está cargando datos
  if (cargandoDatos) {
    return loadingComponent
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mensaje de error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Información básica */}
        <BasicInformationSection
          register={register}
          errors={errors}
          control={control}
          localizaciones={localizaciones}
        />

        {/* Fechas */}
        <DatesSection
          errors={errors}
          control={control}
          watch={watch}
        />

        {/* Participantes */}
        <ParticipantsSection
          register={register}
          errors={errors}
          watch={watch}
        />

        {/* Servicios y factores */}
        <ServicesAndFactorsSection
          errors={errors}
          control={control}
          servicios={servicios}
          factores={factores}
        />
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
  )
}

// Exportar como componente memoizado
export default memo(CampaignCreationForm)

