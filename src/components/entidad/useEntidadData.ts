import { useState, useEffect, useCallback } from 'react'

import { CampanaService } from '@/src/services/domain/campana.service'
import EmbajadorEntidadService from '@/src/services/domain/embajador-entidad.service'
import { usuariosService } from '@/src/services/domain/usuarios.service'
import { Campana, Embajador, UsuarioAccedido } from '@/src/types'
import { entidadSaludService } from '@/src/services/domain/entidad-salud.service'

export function useEntidadData() {
	const [embajadores, setEmbajadores] = useState<Embajador[]>([])
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [cargando, setCargando] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Obtener el usuario actual
	const obtenerUsuarioActual = (): UsuarioAccedido | null => {
		try {
			const userStr = localStorage.getItem("usuario")
			if (!userStr) return null
			return JSON.parse(userStr)
		} catch {
			return null
		}
	}

	// Cargar embajadores asociados a la entidad del usuario actual
	const cargarEmbajadores = useCallback(async () => {
		const usuario = obtenerUsuarioActual()
		if (!usuario) {
			setError('No hay una sesión activa. Inicie sesión nuevamente')
			return
		}

		try {
			// PASO 1: Obtener la entidad de salud del usuario actual
			const entidadSalud = await entidadSaludService.obtenerEntidadPorUsuarioId(usuario.id)

			if (!entidadSalud || !entidadSalud.id) {
				setError('No se encontró la entidad de salud asociada al usuario')
				return
			}

			console.log('✅ Entidad de salud encontrada:', entidadSalud.id)

			// PASO 2: Obtener todos los embajadores asociados a esta entidad
			const embajadoresEntidad = await EmbajadorEntidadService.obtenerEmbajadoresPorEntidadId(entidadSalud.id)

			// PASO 3: Obtener datos completos de cada embajador
			const embajadoresData: Embajador[] = []
			for (const embajadorEntidad of embajadoresEntidad) {
				try {
					if (embajadorEntidad.embajador) {
						embajadoresData.push(embajadorEntidad.embajador)
					}
				} catch (err) {
					console.warn(`No se pudo cargar embajador ${embajadorEntidad.embajadorId}:`, err)
				}
			}

			setEmbajadores(embajadoresData)
			console.log('✅ Embajadores cargados:', embajadoresData.length)
		} catch (err: any) {
			console.error('Error al cargar embajadores:', err)
			setError('No se pudieron cargar los embajadores de esta entidad')
		}
	}, [])

	// Cargar campañas de la entidad del usuario actual
	const cargarCampanas = useCallback(async () => {
		const usuario = obtenerUsuarioActual()
		if (!usuario) {
			setError('No hay una sesión activa. Inicie sesión nuevamente')
			return
		}

		try {
			// PASO 1: Obtener la entidad de salud del usuario actual
			const entidadSalud = await entidadSaludService.obtenerEntidadPorUsuarioId(usuario.id)

			if (!entidadSalud || !entidadSalud.id) {
				setError('No se encontró la entidad de salud asociada al usuario')
				return
			}

			// PASO 2: Obtener todas las campañas de esta entidad
			const campanasDeEntidad = await CampanaService.obtenerCampanasPorEntidad(entidadSalud.id)

			setCampanas(campanasDeEntidad)
			console.log('✅ Campañas cargadas:', campanasDeEntidad.length)
		} catch (err: any) {
			console.error('Error al cargar campañas:', err)
			setError('No se pudieron cargar las campañas de esta entidad')
		}
	}, [])

	// Cargar todos los datos
	const cargarDatos = useCallback(async () => {
		setCargando(true)
		setError(null)

		try {
			await Promise.all([cargarEmbajadores(), cargarCampanas()])
		} catch (err) {
			console.error('Error al cargar datos:', err)
		} finally {
			setCargando(false)
		}
	}, [cargarEmbajadores, cargarCampanas])

	// Recargar datos
	const recargarDatos = useCallback(() => {
		cargarDatos()
	}, [cargarDatos])

	// Calcular estadísticas
	const estadisticas = {
		embajadoresRegistrados: embajadores.length,
		campanasPostuladas: campanas.filter(c => c.estado.toLowerCase() === 'postulada').length,
		campanasEnEjecucion: campanas.filter(c => c.estado.toLowerCase() === 'ejecucion').length
	}

	// Cargar datos al montar
	useEffect(() => {
		cargarDatos()
	}, [cargarDatos])

	return {
		embajadores,
		campanas,
		estadisticas,
		cargando,
		error,
		recargarDatos
	}
} 