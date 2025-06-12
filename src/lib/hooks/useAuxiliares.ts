import { useState, useCallback } from 'react'

import { CampanaService } from '@/src/services/domain/campana.service'
import { inscripcionesService, InscripcionCampana } from '@/src/services/domain/inscripciones.service'
import { usuariosService } from '@/src/services/domain/usuarios.service'
import { Campana, UsuarioAccedido, EstadoCampana } from '@/src/types'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'

export const useAuxiliares = () => {
	const [auxiliares, setAuxiliares] = useState<UsuarioAccedido[]>([])
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [inscripciones, setInscripciones] = useState<InscripcionCampana[]>([])
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Obtener auxiliares creados por la entidad
	const cargarAuxiliares = useCallback(async (entidadUsuarioId: number) => {
		setCargando(true)
		setError(null)
		try {
			console.log('🔍 Cargando auxiliares creados por usuario:', entidadUsuarioId)
			const usuarios = await usuariosService.obtenerUsuariosPorCreador(entidadUsuarioId)

			// Filtrar solo auxiliares (ROL_ID = 5)
			const auxiliaresFiltrados = usuarios.filter(usuario => usuario.rolId === 5)
			setAuxiliares(auxiliaresFiltrados)
			console.log('✅ Auxiliares cargados:', auxiliaresFiltrados.length)
		} catch (err) {
			console.error('❌ Error al cargar auxiliares:', err)
			setError('No se pudieron cargar los auxiliares')
		} finally {
			setCargando(false)
		}
	}, [])

	// Obtener campañas disponibles usando el servicio existente
	const cargarCampanas = useCallback(async () => {
		try {
			console.log('🔍 Cargando campañas disponibles...')

			// Usar apiSpringClient con el endpoint configurado
			const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.BASE)
			const todasCampanas: Campana[] = response.data

			// Filtrar solo campañas activas usando EstadoCampana enum
			const campanasActivas = todasCampanas.filter((c: Campana) =>
				c.estado === EstadoCampana.POSTULADA ||
				c.estado === EstadoCampana.EJECUCION
			)
			setCampanas(campanasActivas)
			console.log('✅ Campañas activas cargadas:', campanasActivas.length)
		} catch (err) {
			console.error('❌ Error al cargar campañas:', err)
			setError('No se pudieron cargar las campañas')
		}
	}, [])

	// Obtener inscripciones de un auxiliar - ya usando inscripciones.service.ts correctamente
	const cargarInscripcionesAuxiliar = useCallback(async (usuarioId: number) => {
		try {
			console.log('🔍 Cargando inscripciones del auxiliar:', usuarioId)
			const inscripcionesAuxiliar = await inscripcionesService.obtenerInscripcionesPorUsuario(usuarioId)
			setInscripciones(inscripcionesAuxiliar)
			console.log('✅ Inscripciones cargadas:', inscripcionesAuxiliar.length)
			return inscripcionesAuxiliar
		} catch (err) {
			console.error('❌ Error al cargar inscripciones:', err)
			setError('No se pudieron cargar las inscripciones')
			return []
		}
	}, [])

	// Inscribir auxiliar a campaña - ya usando inscripciones.service.ts correctamente
	const inscribirAuxiliar = useCallback(async (usuarioId: number, campanaId: number) => {
		try {
			console.log('📝 Inscribiendo auxiliar a campaña:', { usuarioId, campanaId })
			await inscripcionesService.crearInscripcion(usuarioId, campanaId)
			console.log('✅ Auxiliar inscrito exitosamente')

			// Recargar inscripciones del auxiliar
			await cargarInscripcionesAuxiliar(usuarioId)
			return true
		} catch (err) {
			console.error('❌ Error al inscribir auxiliar:', err)
			setError('No se pudo inscribir el auxiliar a la campaña')
			return false
		}
	}, [cargarInscripcionesAuxiliar])

	// Eliminar inscripción de auxiliar - ya usando inscripciones.service.ts correctamente
	const eliminarInscripcion = useCallback(async (inscripcionId: number, usuarioId: number) => {
		try {
			console.log('🗑️ Eliminando inscripción:', inscripcionId)
			await inscripcionesService.eliminarInscripcion(inscripcionId)
			console.log('✅ Inscripción eliminada exitosamente')

			// Recargar inscripciones del auxiliar
			await cargarInscripcionesAuxiliar(usuarioId)
			return true
		} catch (err) {
			console.error('❌ Error al eliminar inscripción:', err)
			setError('No se pudo eliminar la inscripción')
			return false
		}
	}, [cargarInscripcionesAuxiliar])

	// Limpiar estado
	const limpiarEstado = useCallback(() => {
		setError(null)
		setInscripciones([])
	}, [])

	return {
		auxiliares,
		campanas,
		inscripciones,
		cargando,
		error,
		cargarAuxiliares,
		cargarCampanas,
		cargarInscripcionesAuxiliar,
		inscribirAuxiliar,
		eliminarInscripcion,
		limpiarEstado
	}
} 