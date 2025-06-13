import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import { inscripcionesService, InscripcionCompleta } from '@/src/services/domain/inscripciones.service'
import { EstadoCampana } from '@/src/types'

export interface EstadisticasAuxiliar {
	campanasActivas: number
	totalCampanas: number
	campanasEnEjecucion: number
}

export const useAuxiliarDashboard = () => {
	const { usuario } = useAuth()

	// Estados principales
	const [campanasInscritas, setCampanasInscritas] = useState<InscripcionCompleta[]>([])
	const [busqueda, setBusqueda] = useState('')

	// Estados de carga y error
	const [cargandoCampanas, setCargandoCampanas] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Cargar campañas donde está inscrito el auxiliar
	const cargarMisCampanas = useCallback(async () => {
		if (!usuario?.id) {
			console.log("⏳ Esperando datos del auxiliar para cargar campañas...")
			return
		}

		setCargandoCampanas(true)
		setError(null)
		console.log("🔍 Cargando campañas para auxiliar:", usuario.id)

		try {
			// Obtener inscripciones completas del auxiliar
			const inscripcionesData = await inscripcionesService.obtenerInscripcionesCompletas(usuario.id)

			// Filtrar solo campañas activas donde el auxiliar está inscrito
			const campanasActivas = inscripcionesData.filter(item =>
				item.campana.estado === EstadoCampana.POSTULADA ||
				item.campana.estado === EstadoCampana.EJECUCION
			)

			setCampanasInscritas(campanasActivas)
			console.log("✅ Campañas del auxiliar cargadas:", campanasActivas.length)
		} catch (err: any) {
			console.error('❌ Error al cargar campañas del auxiliar:', err)
			setError('Error al cargar las campañas. Intente nuevamente.')
		} finally {
			setCargandoCampanas(false)
		}
	}, [usuario?.id])

	// Cargar campañas al montar el componente
	useEffect(() => {
		if (usuario?.id) {
			console.log("🔄 Iniciando carga de campañas del auxiliar...")
			cargarMisCampanas()
		}
	}, [usuario?.id, cargarMisCampanas])

	// Estadísticas calculadas
	const estadisticas: EstadisticasAuxiliar = {
		totalCampanas: campanasInscritas.length,
		campanasActivas: campanasInscritas.filter(item =>
			item.campana.estado === EstadoCampana.POSTULADA ||
			item.campana.estado === EstadoCampana.EJECUCION
		).length,
		campanasEnEjecucion: campanasInscritas.filter(item =>
			item.campana.estado === EstadoCampana.EJECUCION
		).length
	}

	// Filtrar campañas por búsqueda
	const campanasFiltradas = campanasInscritas.filter(item =>
		item.campana.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
		item.campana.descripcion.toLowerCase().includes(busqueda.toLowerCase())
	)

	return {
		// Estados principales
		campanasInscritas: campanasFiltradas,
		busqueda,
		setBusqueda,

		// Estados de carga
		cargandoCampanas,
		error,

		// Funciones
		cargarMisCampanas,

		// Estadísticas
		estadisticas
	}
} 