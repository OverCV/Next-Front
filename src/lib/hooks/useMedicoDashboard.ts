import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import { inscripcionesService } from '@/src/services/domain/inscripciones.service'
import { InscripcionCompleta, EstadoCampana } from '@/src/types'

export const useMedicoDashboard = () => {
	const { usuario } = useAuth()

	// Estados principales
	const [campanasInscritas, setCampanasInscritas] = useState<InscripcionCompleta[]>([])
	const [busqueda, setBusqueda] = useState('')
	const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())

	// Estados de carga y error
	const [cargandoCampanas, setCargandoCampanas] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Cargar campañas donde está inscrito el médico
	const cargarMisCampanas = useCallback(async () => {
		if (!usuario?.id) {
			console.log("⏳ Esperando datos del médico para cargar campañas...")
			return
		}

		setCargandoCampanas(true)
		setError(null)
		console.log("🔍 Cargando campañas para médico:", usuario.id)

		try {
			// Obtener inscripciones completas del médico usando el servicio existente
			const inscripcionesData = await inscripcionesService.obtenerInscripcionesCompletas(usuario.id)

			// Filtrar solo campañas activas donde el médico está inscrito
			const campanasActivas = inscripcionesData.filter(item =>
				item.campana.estado === EstadoCampana.POSTULADA ||
				item.campana.estado === EstadoCampana.EJECUCION
			)

			setCampanasInscritas(campanasActivas)
			console.log("✅ Campañas del médico cargadas:", campanasActivas.length)
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

	// Campañas filtradas por búsqueda
	const campanasFiltradas = campanasInscritas.filter(item =>
		item.campana.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
		item.campana.descripcion.toLowerCase().includes(busqueda.toLowerCase())
	)

	// Estadísticas calculadas
	const estadisticas = {
		campanasActivas: campanasInscritas.filter(item =>
			item.campana.estado === EstadoCampana.EJECUCION
		).length,
		totalCampanas: campanasInscritas.length,
		pacientesAtendidosHoy: 0, // TODO: implementar cuando tengamos endpoint
		citasPendientes: 0 // TODO: implementar cuando tengamos endpoint
	}

	return {
		// Estados principales - mantenemos compatibilidad con la interfaz existente
		campanas: campanasFiltradas.map(item => item.campana), // Extraer solo las campañas para compatibilidad
		campanasInscritas: campanasFiltradas,
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