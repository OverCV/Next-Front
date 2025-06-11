import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { Triaje, Campana } from '@/src/types'

export const usePacienteDashboard = () => {
	const router = useRouter()
	const { usuario } = useAuth()

	// Estados principales
	const [triaje, setTriaje] = useState<Triaje | null>(null)
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [campanasDisponibles, setCampanasDisponibles] = useState<Campana[]>([])
	const [usuarioId, setPacienteId] = useState<number | null>(null)

	// Estados de carga y error
	const [cargandoTriaje, setCargandoTriaje] = useState(true)
	const [cargandoCampanas, setCargandoCampanas] = useState(true)
	const [cargandoPaciente, setCargandoPaciente] = useState(true)
	const [error, setError] = useState<string | null>(null)

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
				// Usar endpoint centralizado
				const response = await apiSpringClient.get(ENDPOINTS.PACIENTES.PERFIL(usuario.id))

				console.log("✅ Paciente encontrado:", response.data.id)
				setPacienteId(response.data.id)
			} catch (err: any) {
				console.error("❌ Error al obtener paciente:", err)
				if (err.response?.status === 404) {
					console.log("🔄 Redirigiendo al acceso pues no existe el registro de paciente...")
					router.push('/acceso')
					return
				}
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
							...responseCampana,
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
		if (usuarioId && !cargandoPaciente) {
			console.log("🔄 Iniciando carga de campañas...")
			cargarMisCampanas()
		}
	}, [usuarioId, cargandoPaciente, cargarMisCampanas])

	// Cargar triaje inicial del paciente
	useEffect(() => {
		const cargarTriaje = async () => {
			if (!usuarioId || cargandoPaciente) {
				console.log("⏳ Esperando datos para cargar triaje...")
				return
			}

			setCargandoTriaje(true)
			setError(null)
			console.log("🔍 Cargando triaje para paciente:", usuarioId)

			try {
				// Usar endpoint centralizado para triajes
				const response = await apiSpringClient.get(ENDPOINTS.TRIAJES.POR_PACIENTE(usuarioId))

				const triajes = response.data
				// Tomamos el triaje más reciente
				const ultimoTriaje = triajes.length > 0 ? triajes[0] : null
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

		if (usuarioId && !cargandoPaciente) {
			console.log("🔄 Iniciando carga de triaje...")
			cargarTriaje()
		}
	}, [usuarioId, cargandoPaciente, router])

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
		usuarioId,

		// Estados de carga
		cargandoTriaje,
		cargandoCampanas,
		cargandoPaciente,
		error,

		// Funciones
		cargarMisCampanas,

		// Estadísticas
		estadisticas
	}
} 