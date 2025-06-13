import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { seguimientosAutomaticosService } from '@/src/services/domain/seguimientos-automaticos.service'
import { pacientesService } from '@/src/services/domain/pacientes.service'
import { seguimientosService } from '@/src/services/seguimientos'
import { Triaje, Campana } from '@/src/types'

export interface DatosPacienteDashboard {
	paciente: any
	campanasActivas: number
	campanasDisponibles: number
	triagesRealizados: number
	seguimientos: any[]
	campanas: any[]
	estadisticas: {
		campanasInscritas: number
		triagesCompletos: number
		seguimientosPendientes: number
	}
}

export const usePacienteDashboard = (usuarioId: number | null) => {
	const router = useRouter()
	const { usuario } = useAuth()

	// Estados principales
	const [triaje, setTriaje] = useState<Triaje | null>(null)
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([])
	const [pacienteId, setPacienteId] = useState<number | null>(null)
	const [seguimientos, setSeguimientos] = useState<any[]>([])

	// Estados de carga y error
	const [cargandoTriaje, setCargandoTriaje] = useState(true)
	const [cargandoCampanas, setCargandoCampanas] = useState(true)
	const [cargandoPaciente, setCargandoPaciente] = useState(true)
	const [validandoSeguimientos, setValidandoSeguimientos] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Estados adicionales
	const [datos, setDatos] = useState<DatosPacienteDashboard | null>(null)

	// Función para validar seguimientos automáticamente (NUEVA FUNCIONALIDAD)
	const validarSeguimientosAutomaticos = useCallback(async (pacienteId: number) => {
		console.log('🔍 Iniciando validación automática de seguimientos para paciente:', pacienteId)
		setValidandoSeguimientos(true)
		
		try {
			const resultado = await seguimientosAutomaticosService.validarYGenerarSeguimientos(pacienteId)
			
			console.log('📊 Resultado de validación de seguimientos:', resultado)
			
			if (resultado.seguimientos_generados > 0) {
				console.log(`✅ Se generaron ${resultado.seguimientos_generados} nuevos seguimientos automáticamente`)
				
				// Recargar seguimientos después de generar nuevos
				await cargarSeguimientos(pacienteId)
			}
			
			// Notificar al usuario si se generaron seguimientos
			if (resultado.seguimientos_generados > 0) {
				console.log(`🎉 ¡Se activaron ${resultado.seguimientos_generados} nuevos seguimientos de salud para ti!`)
			}
			
		} catch (error) {
			console.error('❌ Error en validación automática de seguimientos:', error)
			// No bloquear la funcionalidad principal si falla
		} finally {
			setValidandoSeguimientos(false)
		}
	}, [])

	// Función para cargar seguimientos del paciente
	const cargarSeguimientos = useCallback(async (pacienteId: number) => {
		try {
			console.log('🔍 Cargando seguimientos para paciente:', pacienteId)
			const seguimientosPaciente = await seguimientosService.obtenerPorPaciente(pacienteId)
			setSeguimientos(seguimientosPaciente)
			console.log('✅ Seguimientos cargados:', seguimientosPaciente.length)
		} catch (error) {
			console.warn('⚠️ Error cargando seguimientos:', error)
			setSeguimientos([])
		}
	}, [])

	// Función para cargar datos del paciente y consolidar información
	const cargarDatosPaciente = useCallback(async (usuarioId: number) => {
		try {
			if (!pacienteId || !triaje || cargandoCampanas || cargandoTriaje) {
				console.log('⏳ Esperando datos completos del paciente...')
				return
			}

			console.log('🔄 Consolidando datos del dashboard...')

			const datosDashboard: DatosPacienteDashboard = {
				paciente: { id: pacienteId, usuario: usuario },
				campanasActivas: campanas.length,
				campanasDisponibles: campanasDisponibles.length,
				triagesRealizados: triaje ? 1 : 0,
				seguimientos: seguimientos,
				campanas: campanas,
				estadisticas: {
					campanasInscritas: campanas.length,
					triagesCompletos: triaje ? 1 : 0,
					seguimientosPendientes: seguimientos.filter(s => s.estado === 'PENDIENTE').length
				}
			}

			setDatos(datosDashboard)
			console.log('✅ Datos del dashboard consolidados:', datosDashboard)

		} catch (error) {
			console.error('❌ Error consolidando datos del paciente:', error)
			setError(error instanceof Error ? error.message : 'Error desconocido')
		}
	}, [pacienteId, triaje, campanas, campanasDisponibles, seguimientos, cargandoCampanas, cargandoTriaje, usuario])

	// Obtener datos del paciente
	useEffect(() => {
		const obtenerPaciente = async () => {
			console.log("Datos usuario:", usuario)

			if (!usuario?.id) {
				console.log("⏳ Esperando datos del usuario...")
				return
			}

			setCargandoPaciente(true)
			console.log("🔍 Obteniendo datos del paciente para usuario:", usuario.id)

			try {
				// Usar servicio de pacientes existente
				const { existe, id: pacienteIdObtenido, datos: pacienteData } = await pacientesService.verificarPaciente(usuario.id)

				if (!existe) {
					console.log("🔄 Redirigiendo al acceso pues no existe el registro de paciente...")
					router.push('/acceso')
					return
				}

				console.log("✅ Paciente encontrado:", pacienteIdObtenido)
				setPacienteId(pacienteIdObtenido!)
			} catch (err: any) {
				console.error("❌ Error al obtener paciente:", err)
				setError("Error al obtener datos del paciente")
			} finally {
				setCargandoPaciente(false)
			}
		}

		obtenerPaciente()
	}, [usuario?.id, router])

	// Cargar campañas del paciente
	const cargarMisCampanas = useCallback(async () => {
		if (!usuario?.id) {
			console.log("⏳ Esperando pacienteId para cargar campañas...")
			return
		}

		setCargandoCampanas(true)
		console.log("🔍 Cargando campañas para paciente:", usuario?.id)

		try {
			// Usar endpoint centralizado para inscripciones
			const responseCampanas = await apiSpringClient.get(ENDPOINTS.CAMPANAS.INSCRIPCIONES.POR_USUARIO(usuario?.id))
			const todasCampanasInscritas = responseCampanas.data

			// Obtener detalles completos de cada campaña
			const campanasDetalladas = await Promise.all(
				todasCampanasInscritas.map(async (inscripcion: any) => {
					try {
						const responseCampana = await apiSpringClient.get(ENDPOINTS.CAMPANAS.POR_ID(inscripcion.campanaId))
						return {
							...responseCampana.data,
							estado: inscripcion.estado,
							fechaInscripcion: inscripcion.fechaInscripcion
						}
					} catch (err) {
						console.error(`❌ Error al obtener detalles de campaña ${inscripcion.campanaId}:`, err)
						return null
					}
				})
			)

			console.log("Inscripciones: ", campanasDetalladas)

			// Filtrar campañas nulas y actualizar el array
			const campanasFiltradas = campanasDetalladas.filter(campana => campana !== null)

			setCampanasDisponibles(campanasFiltradas)
			setCampanas(campanasFiltradas)
		} catch (err: any) {
			console.error('❌ Error al cargar campañas:', err)
		} finally {
			setCargandoCampanas(false)
		}
	}, [usuario?.id])

	// Cargar campañas cuando tengamos usuarioId
	useEffect(() => {
		if (pacienteId && !cargandoPaciente) {
			console.log("🔄 Iniciando carga de campañas...")
			cargarMisCampanas()
		}
	}, [pacienteId, cargandoPaciente, cargarMisCampanas])

	// Cargar triaje inicial del paciente
	useEffect(() => {
		const cargarTriaje = async () => {
			if (!pacienteId || cargandoPaciente) {
				console.log("⏳ Esperando datos para cargar triaje...")
				return
			}

			setCargandoTriaje(true)
			setError(null)
			console.log("🔍 Cargando triaje para paciente:", pacienteId)

			try {
				// Usar servicio de pacientes existente
				const { existe, ultimoTriaje } = await pacientesService.verificarTriaje(pacienteId)
				setTriaje(ultimoTriaje)

				console.log("✅ Triaje cargado:", ultimoTriaje ? "encontrado" : "no encontrado")

				// Si no hay triaje, redirigir a crearlo
				if (!ultimoTriaje) {
					console.log("🔄 Redirigiendo a triaje inicial...")
					router.push('/dashboard/paciente/triaje-inicial')
				}
			} catch (err: any) {
				console.error('❌ Error al cargar triaje:', err)
				setError('No se pudo cargar la información médica. Intente nuevamente.')
			} finally {
				setCargandoTriaje(false)
			}
		}

		if (pacienteId && !cargandoPaciente) {
			console.log("🔄 Iniciando carga de triaje...")
			cargarTriaje()
		}
	}, [pacienteId, cargandoPaciente, router])

	// Cargar seguimientos cuando tengamos pacienteId
	useEffect(() => {
		if (pacienteId && !cargandoPaciente) {
			console.log("🔄 Iniciando carga de seguimientos...")
			cargarSeguimientos(pacienteId)
		}
	}, [pacienteId, cargandoPaciente, cargarSeguimientos])

	// Consolidar datos cuando todo esté cargado
	useEffect(() => {
		if (usuario?.id && !cargandoPaciente) {
			cargarDatosPaciente(usuario.id)
		}
	}, [usuario?.id, cargandoPaciente, cargarDatosPaciente])

	// NUEVA FUNCIONALIDAD: Validar seguimientos automáticamente cuando se cargan los datos del paciente
	// TEMPORALMENTE DESHABILITADO - DESCOMENTAR CUANDO SE SOLUCIONE EL ERROR DE COMPILACIÓN
	// useEffect(() => {
	// 	if (pacienteId && !cargandoPaciente && !cargandoTriaje && triaje) {
	// 		console.log("🔄 Paciente cargado, iniciando validación de seguimientos...")
	// 		
	// 		// Validar con un pequeño delay para no bloquear la UI
	// 		setTimeout(() => {
	// 			validarSeguimientosAutomaticos(pacienteId)
	// 		}, 2000)
	// 	}
	// }, [pacienteId, cargandoPaciente, cargandoTriaje, triaje, validarSeguimientosAutomaticos])

	// Función para recargar datos
	const recargarDatos = useCallback(() => {
		if (usuario?.id) {
			cargarMisCampanas()
			if (pacienteId) {
				cargarSeguimientos(pacienteId)
			}
		}
	}, [usuario?.id, pacienteId, cargarMisCampanas, cargarSeguimientos])

	// Estadísticas calculadas
	const estadisticas = {
		campanasActivas: campanas.length,
		campanasDisponibles: campanasDisponibles.length,
		triagesRealizados: triaje ? 1 : 0
	}

	return {
		// Estados principales
		triaje,
		campanas,
		campanasDisponibles,
		pacienteId,
		seguimientos,

		// Estados de carga
		cargandoTriaje,
		cargandoCampanas,
		cargandoPaciente,
		validandoSeguimientos,
		error,

		// Estados adicionales
		datos,

		// Funciones
		cargarMisCampanas,
		validarSeguimientosAutomaticos,
		cargarDatosPaciente,
		recargarDatos,

		// Estadísticas
		estadisticas
	}
}