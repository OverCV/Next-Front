import { useState, useEffect, useCallback } from 'react'

import { CampanaService } from '@/src/services/domain/campana.service'
import EmbajadorEntidadService from '@/src/services/domain/embajador-entidad.service'
import { usuariosService } from '@/src/services/domain/usuarios.service'
import { Campana, Embajador, UsuarioAccedido } from '@/src/types'

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

	// Cargar embajadores creados por esta entidad usando creadoPorId
	const cargarEmbajadores = useCallback(async () => {
		const usuario = obtenerUsuarioActual()
		if (!usuario) {
			setError('No hay una sesión activa. Inicie sesión nuevamente')
			return
		}

		try {
			// Obtener todos los usuarios creados por esta entidad (creadoPorId)
			const usuariosCreados = await usuariosService.obtenerUsuariosPorCreador(usuario.id)

			// Filtrar solo los embajadores (rol 7 según el ejemplo)
			const embajadoresIds = usuariosCreados
				.filter(user => user.rolId === 7) // Rol embajador
				.map(user => user.id)

			// Obtener datos completos de embajadores
			const embajadoresData: Embajador[] = []
			for (const userId of embajadoresIds) {
				try {
					const embajadorCompleto = await EmbajadorEntidadService.obtenerEmbajadorPorUsuarioId(userId)
					if (embajadorCompleto) {
						embajadoresData.push(embajadorCompleto)
					}
				} catch (err) {
					console.warn(`No se pudo cargar embajador para usuario ${userId}:`, err)
				}
			}

			setEmbajadores(embajadoresData)
		} catch (err: any) {
			console.error('Error al cargar embajadores:', err)
			setError('No se pudieron cargar los embajadores creados por esta entidad')
		}
	}, [])

	// Cargar campañas creadas por usuarios de esta entidad usando creadoPorId
	const cargarCampanas = useCallback(async () => {
		const usuario = obtenerUsuarioActual()
		if (!usuario) {
			setError('No hay una sesión activa. Inicie sesión nuevamente')
			return
		}

		try {
			// Obtener todas las campañas
			const todasLasCampanas = await CampanaService.obtenerTodasCampanas()

			// Obtener todos los usuarios creados por esta entidad
			const usuariosCreados = await usuariosService.obtenerUsuariosPorCreador(usuario.id)
			const usuariosIds = usuariosCreados.map(user => user.id)

			// Filtrar campañas creadas por usuarios de esta entidad
			// Asumiendo que las campañas tienen un campo creadoPorId o similar
			const campanasDeEntidad = todasLasCampanas.filter(campana =>
				// Aquí debería ser campana.creadoPorId, pero si no existe en la API,
				// usaremos entidadId como fallback temporal
				usuariosIds.includes(campana.entidadId) || campana.entidadId === usuario.id
			)

			setCampanas(campanasDeEntidad)
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