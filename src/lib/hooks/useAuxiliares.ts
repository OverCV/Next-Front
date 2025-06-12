import { useState, useCallback } from 'react'
import { inscripcionesService } from '@/src/services/domain/inscripciones.service'
import { Campana, InscripcionCampana, UsuarioAccedido, EstadoCampana } from '@/src/types'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'

export const useAuxiliares = () => {
	const [auxiliares, setAuxiliares] = useState<UsuarioAccedido[]>([])
	const [campanas, setCampanas] = useState<Campana[]>([])
	const [inscripciones, setInscripciones] = useState<InscripcionCampana[]>([])
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const cargarCampanas = useCallback(async () => {
		try {
			const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.BASE)
			const todasCampanas: Campana[] = response.data
			const campanasActivas = todasCampanas.filter((c: Campana) =>
				c.estado === EstadoCampana.POSTULADA ||
				c.estado === EstadoCampana.EJECUCION
			)
			setCampanas(campanasActivas)
		} catch (err) {
			setError('No se pudieron cargar las campañas')
		}
	}, [])

	const cargarInscripcionesAuxiliar = useCallback(async (usuarioId: number) => {
		try {
			const inscripcionesAuxiliar = await inscripcionesService.obtenerInscripcionesPorUsuario(usuarioId)
			setInscripciones(inscripcionesAuxiliar)
		} catch (err) {
			setError('No se pudieron cargar las inscripciones')
		}
	}, [])

	const inscribirAuxiliar = useCallback(async (usuarioId: number, campanaId: number) => {
		try {
			await inscripcionesService.crearInscripcion(usuarioId, campanaId)
			await cargarInscripcionesAuxiliar(usuarioId)
			return true
		} catch (err) {
			setError('No se pudo inscribir el auxiliar a la campaña')
			return false
		}
	}, [cargarInscripcionesAuxiliar])

	const eliminarInscripcion = useCallback(async (inscripcionId: number, usuarioId: number) => {
		try {
			await inscripcionesService.eliminarInscripcion(inscripcionId)
			await cargarInscripcionesAuxiliar(usuarioId)
			return true
		} catch (err) {
			setError('No se pudo eliminar la inscripción')
			return false
		}
	}, [cargarInscripcionesAuxiliar])

	const limpiarEstado = useCallback(() => {
		setInscripciones([])
		setError(null)
	}, [])

	return {
		auxiliares,
		campanas,
		inscripciones,
		cargando,
		error,
		cargarCampanas,
		cargarInscripcionesAuxiliar,
		inscribirAuxiliar,
		eliminarInscripcion,
		setAuxiliares,
		limpiarEstado,
	}
} 