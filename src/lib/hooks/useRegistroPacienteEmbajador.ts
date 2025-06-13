import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
	TIPOS_IDENTIFICACION_USUARIO,
	TiposIdentificacionEnum,
	OPCIONES_GENERO,
	TIPOS_SANGRE,
	GeneroBiologicoEnum,
	TipoSangreEnum
} from '@/src/constants'
import { useRegistroPaciente, DatosRegistroCompleto } from '@/src/lib/hooks/useRegistroPaciente'
import { useAuth } from '@/src/providers/auth-provider'
import { localizacionesService } from '@/src/services/domain/localizaciones.service'
import { Localizacion } from '@/src/types'

// Esquema de validación completo
const registroCompletoSchema = z.object({
	// Datos del Usuario
	tipoIdentificacion: z.nativeEnum(TiposIdentificacionEnum, {
		required_error: "Selecciona un tipo de identificación",
	}),
	identificacion: z.string()
		.min(5, "La identificación debe tener al menos 5 caracteres")
		.max(15, "La identificación no puede exceder 15 caracteres"),
	nombres: z.string()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(50, "El nombre no puede exceder 50 caracteres"),
	apellidos: z.string()
		.min(2, "Los apellidos deben tener al menos 2 caracteres")
		.max(50, "Los apellidos no pueden exceder 50 caracteres"),
	celular: z.string()
		.min(7, "El teléfono debe tener al menos 7 dígitos")
		.max(15, "El teléfono no puede exceder 15 dígitos")
		.regex(/^\d+$/, "El teléfono debe contener solo números"),
	correo: z.string()
		.email("Ingresa un correo electrónico válido")
		.optional()
		.or(z.literal('')),

	// Datos del Paciente
	fechaNacimiento: z.date({
		required_error: "La fecha de nacimiento es requerida",
	}),
	genero: z.nativeEnum(GeneroBiologicoEnum, {
		required_error: "Selecciona un género",
	}),
	direccion: z.string()
		.min(5, "La dirección debe tener al menos 5 caracteres")
		.max(100, "La dirección no puede exceder 100 caracteres"),
	tipoSangre: z.nativeEnum(TipoSangreEnum, {
		required_error: "Selecciona un tipo de sangre",
	}),
	localizacion_id: z.string()
		.transform((val) => parseInt(val, 10))
		.pipe(
			z.number()
				.min(1, "Selecciona una localización")
		),

	// Datos de Campaña (opcional)
	campanaId: z.string()
		.optional()
		.transform((val) => {
			if (!val || val === "sin_campana") return undefined
			return parseInt(val, 10)
		})
})

export type RegistroCompletoFormValues = z.infer<typeof registroCompletoSchema>

export const useRegistroPacienteEmbajador = () => {
	const { usuario } = useAuth()

	// Estados para datos
	const [localizaciones, setLocalizaciones] = useState<Localizacion[]>([])
	const [cargandoLocalizaciones, setCargandoLocalizaciones] = useState(true)

	// Hook del registro de paciente
	const {
		registrarPacienteCompleto,
		cargarCampanasDisponibles,
		campanasDisponibles,
		cargandoCampanas,
		cargando,
		error,
		exitoso,
		limpiarEstado
	} = useRegistroPaciente()

	// Configuración del formulario
	const form = useForm<RegistroCompletoFormValues>({
		resolver: zodResolver(registroCompletoSchema),
		defaultValues: {
			tipoIdentificacion: TiposIdentificacionEnum.CC,
			identificacion: "",
			nombres: "",
			apellidos: "",
			celular: "",
			correo: "",
			fechaNacimiento: undefined,
			genero: undefined,
			direccion: "",
			tipoSangre: undefined,
			localizacion_id: undefined,
			campanaId: undefined,
		},
	})

	// Cargar localizaciones
	const cargarLocalizaciones = useCallback(async () => {
		setCargandoLocalizaciones(true)
		try {
			console.log("🌍 Cargando localizaciones...")
			const dataLocalizaciones = await localizacionesService.obtenerLocalizaciones()
			setLocalizaciones(dataLocalizaciones || [])
			console.log("✅ Localizaciones cargadas:", dataLocalizaciones?.length)
		} catch (err) {
			console.error("❌ Error al cargar localizaciones:", err)
			setLocalizaciones([])
		} finally {
			setCargandoLocalizaciones(false)
		}
	}, [])

	// Cargar datos iniciales
	useEffect(() => {
		const cargarDatos = async () => {
			await Promise.all([
				cargarLocalizaciones(),
				cargarCampanasDisponibles()
			])
		}
		cargarDatos()
	}, [cargarLocalizaciones, cargarCampanasDisponibles])

	// Manejar envío del formulario
	const onSubmit = useCallback(async (datos: RegistroCompletoFormValues) => {
		const token = usuario?.token ?? localStorage.getItem('authToken')

		if (!token) {
			console.error("No hay token disponible")
			return
		}

		limpiarEstado()

		try {
			const datosCompletos: DatosRegistroCompleto = {
				// Datos del Usuario
				tipoIdentificacion: datos.tipoIdentificacion,
				identificacion: datos.identificacion,
				nombres: datos.nombres,
				apellidos: datos.apellidos,
				celular: datos.celular,
				correo: datos.correo,

				// Datos del Paciente
				fechaNacimiento: datos.fechaNacimiento,
				genero: datos.genero,
				direccion: datos.direccion,
				tipoSangre: datos.tipoSangre,
				localizacion_id: datos.localizacion_id,

				// Datos de Campaña (opcional)
				campanaId: datos.campanaId,

				// ID de quien crea el paciente
				creadoPorId: usuario?.id ?? 0
			}

			await registrarPacienteCompleto(datosCompletos, token)
			console.log("✅ Registro completado exitosamente")
		} catch (err: any) {
			console.error("❌ Error en el registro:", err)
		}
	}, [usuario?.token, limpiarEstado, registrarPacienteCompleto])

	// Constantes para los formularios
	const constantesFormulario = {
		TIPOS_IDENTIFICACION_PACIENTE: TIPOS_IDENTIFICACION_USUARIO,
		OPCIONES_GENERO,
		TIPOS_SANGRE
	}

	return {
		// Form
		form,
		onSubmit,

		// Estados de datos
		localizaciones,
		campanasDisponibles,

		// Estados de carga
		cargandoLocalizaciones,
		cargandoCampanas,
		cargando,

		// Estados del proceso
		error,
		exitoso,

		// Funciones
		limpiarEstado,

		// Constantes
		constantesFormulario
	}
} 