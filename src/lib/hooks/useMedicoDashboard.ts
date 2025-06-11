import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { Campana } from '@/src/types'

export const useMedicoDashboard = () => {
	const { usuario } = useAuth()

	// Estados principales
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [campanasActivas, setCampanasActivas] = useState<Campana[]>([])
	const [busqueda, setBusqueda] = useState('')
	const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())

	// Estados de carga y error
	const [cargandoCampanas, setCargandoCampanas] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Cargar campañas del médico
	const cargarMisCampanas = useCallback(async () => {
		if (!usuario?.id) {
			console.log("⏳ Esperando datos del médico para cargar campañas...")
			return
		}

		setCargandoCampanas(true)
		setError(null)
		console.log("🔍 Cargando campañas para médico:", usuario.id)

		try {
			// Obtener todas las campañas (necesitamos endpoint específico para médicos)
			const responseCampanas = await apiSpringClient.get(ENDPOINTS.CAMPANAS.TODAS)
			const todasCampanas = responseCampanas.data

			// Filtrar campañas donde el médico está asignado
			// Por ahora mostramos todas, luego se puede filtrar por medicoId
			const campanasDelMedico = todasCampanas.filter((campana: Campana) =>
				campana.estado === 'EJECUCION' || campana.estado === 'POSTULADA'
			)

			setCampanas(campanasDelMedico)
			setCampanasActivas(campanasDelMedico.filter((c: Campana) => c.estado === 'EJECUCION'))

			console.log("✅ Campañas del médico cargadas:", campanasDelMedico.length)
		} catch (err: any) {
			console.error('❌ Error al cargar campañas del médico:', err)
			setError('Error al cargar las campañas. Intente nuevamente.')
		} finally {
			setCargandoCampanas(false)
		}
	}, [usuario?.id])

	// Cargar campañas al montar el componente
	useEffect(() => {
		if (usuario?.id) {
			console.log("🔄 Iniciando carga de campañas del médico...")
			cargarMisCampanas()
		}
	}, [usuario?.id, cargarMisCampanas])

	// Función para ir a la fecha de hoy
	const irAHoy = useCallback(() => {
		setFechaSeleccionada(new Date())
	}, [])

	// Estadísticas calculadas
	const estadisticas = {
		campanasActivas: campanasActivas.length,
		totalCampanas: campanas.length,
		pacientesAtendidosHoy: 0, // TODO: implementar cuando tengamos endpoint
		citasPendientes: 0 // TODO: implementar cuando tengamos endpoint
	}

	return {
		// Estados principales
		campanas,
		campanasActivas,
		busqueda,
		setBusqueda,
		fechaSeleccionada,
		setFechaSeleccionada,

		// Estados de carga
		cargandoCampanas,
		error,

		// Funciones
		cargarMisCampanas,
		irAHoy,

		// Estadísticas
		estadisticas
	}
} 