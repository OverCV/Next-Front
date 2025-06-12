import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import { CampanaService } from '@/src/services/domain/campana.service'
import { entidadSaludService } from '@/src/services/domain/entidad-salud.service'
import MedicoService from '@/src/services/domain/medico.service'
import { usuariosService } from '@/src/services/domain/usuarios.service'
import { Campana, Embajador, Medico, UsuarioAccedido } from '@/src/types'

export function useEntidadData() {
	const { usuario } = useAuth()
	const [embajadores, setEmbajadores] = useState<Embajador[]>([])
	const [auxiliares, setAuxiliares] = useState<UsuarioAccedido[]>([])
	const [medicos, setMedicos] = useState<Medico[]>([])
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [cargando, setCargando] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Cargar embajadores usando el NIT del usuario actual
	const cargarEmbajadores = useCallback(async () => {
		if (!usuario?.identificacion) {
			setError('No hay una sesión activa o el usuario no tiene NIT')
			return
		}

		try {
			console.log('🔍 Cargando embajadores por NIT:', usuario.identificacion)

			// Usar el endpoint que funciona: /api/entidades-salud/embajadores-nit/{nit}
			const embajadoresData = await entidadSaludService.obtenerEmbajadoresPorNIT(usuario.identificacion)

			setEmbajadores(embajadoresData)
			console.log('✅ Embajadores cargados:', embajadoresData.length)
		} catch (err: any) {
			console.error('Error al cargar embajadores:', err)
			setError('No se pudieron cargar los embajadores de esta entidad')
		}
	}, [usuario?.identificacion])

	// Cargar auxiliares creados por el usuario actual
	const cargarAuxiliares = useCallback(async () => {
		if (!usuario?.id) {
			setError('No hay una sesión activa')
			return
		}

		try {
			console.log('🔍 Cargando auxiliares creados por usuario:', usuario.id)

			// Obtener todos los usuarios creados por esta entidad
			const usuariosCreados = await usuariosService.obtenerUsuariosPorCreador(usuario.id)

			// Filtrar solo auxiliares (ROL_ID = 5)
			const auxiliaresFiltrados = usuariosCreados.filter(u => u.rolId === 5)

			setAuxiliares(auxiliaresFiltrados)
			console.log('✅ Auxiliares cargados:', auxiliaresFiltrados.length)
		} catch (err: any) {
			console.error('Error al cargar auxiliares:', err)
			setError('No se pudieron cargar los auxiliares de esta entidad')
		}
	}, [usuario?.id])

	// Cargar médicos de la entidad del usuario actual
	const cargarMedicos = useCallback(async () => {
		if (!usuario?.id) return;

		try {
			console.log('🔍 Cargando médicos para la entidad del usuario:', usuario.id)

			// 1. Obtener la entidad de salud del usuario
			const entidad = await entidadSaludService.obtenerEntidadPorUsuarioId(usuario.id)
			if (!entidad?.id) {
				throw new Error("No se encontró la entidad de salud del usuario.")
			}

			// 2. Obtener los médicos de esa entidad
			const medicosData = await MedicoService.obtenerMedicosPorEntidad(entidad.id)

			setMedicos(medicosData)
			console.log('✅ Médicos cargados:', medicosData.length)
		} catch (err: any) {
			console.error('Error al cargar médicos:', err)
			setError('No se pudieron cargar los médicos de esta entidad')
		}
	}, [usuario?.id])

	// Cargar campañas de la entidad del usuario actual
	const cargarCampanas = useCallback(async () => {
		if (!usuario?.id) {
			setError('No hay una sesión activa')
			return
		}

		try {
			console.log('🔍 Cargando campañas para usuario ID:', usuario.id)

			// PASO 1: Obtener la entidad de salud del usuario actual
			const entidadSalud = await entidadSaludService.obtenerEntidadPorUsuarioId(usuario.id)

			if (!entidadSalud?.id) {
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
	}, [usuario?.id])

	// Cargar todos los datos
	const cargarDatos = useCallback(async () => {
		setCargando(true)
		setError(null)

		try {
			await Promise.all([cargarEmbajadores(), cargarAuxiliares(), cargarMedicos(), cargarCampanas()])
		} catch (err) {
			console.error('Error al cargar datos:', err)
		} finally {
			setCargando(false)
		}
	}, [cargarEmbajadores, cargarAuxiliares, cargarMedicos, cargarCampanas])

	// Recargar datos
	const recargarDatos = useCallback(() => {
		cargarDatos()
	}, [cargarDatos])

	// Calcular estadísticas
	const estadisticas = {
		embajadoresRegistrados: embajadores.length,
		auxiliaresRegistrados: auxiliares.length,
		medicosRegistrados: medicos.length,
		campanasPostuladas: campanas.filter(c => c.estado.toLowerCase() === 'postulada').length,
		campanasEnEjecucion: campanas.filter(c => c.estado.toLowerCase() === 'ejecucion').length
	}

	// Cargar datos al montar
	useEffect(() => {
		cargarDatos()
	}, [cargarDatos])

	return {
		embajadores,
		auxiliares,
		medicos,
		campanas,
		estadisticas,
		cargando,
		error,
		recargarDatos
	}
} 