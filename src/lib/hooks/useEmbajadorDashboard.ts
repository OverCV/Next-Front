import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/src/providers/auth-provider'
import { inscripcionesService, InscripcionCompleta } from '@/src/services/domain/inscripciones.service'
import { usuariosService } from '@/src/services/usuarios'
import { ROLES } from '@/src/constants'
import { UsuarioAccedido } from '@/src/types'

export interface EstadisticasEmbajador {
	totalPacientes: number
	campanasActivas: number
	campanasEnEjecucion: number
	totalInscripciones: number
}

export const useEmbajadorDashboard = () => {
	const { usuario } = useAuth()

	// Estados para pacientes
	const [pacientes, setPacientes] = useState<UsuarioAccedido[]>([])
	const [cargandoPacientes, setCargandoPacientes] = useState(true)

	// Estados para campañas
	const [campanasInscritas, setCampanasInscritas] = useState<InscripcionCompleta[]>([])
	const [cargandoCampanas, setCargandoCampanas] = useState(true)

	// Estados generales
	const [error, setError] = useState<string | null>(null)
	const [estadisticas, setEstadisticas] = useState<EstadisticasEmbajador>({
		totalPacientes: 0,
		campanasActivas: 0,
		campanasEnEjecucion: 0,
		totalInscripciones: 0
	})

	// Cargar pacientes registrados
	const cargarPacientes = useCallback(async () => {
		setCargandoPacientes(true)
		setError(null)

		try {
			// Obtener usuarios con rol de paciente
			const pacientesData = await usuariosService.obtenerUsuariosPorRol(ROLES.PACIENTE)
			setPacientes(pacientesData)

			console.log('✅ Pacientes cargados:', pacientesData.length)
		} catch (err: any) {
			console.error('❌ Error al cargar pacientes:', err)
			setError('No se pudieron cargar los pacientes')
		} finally {
			setCargandoPacientes(false)
		}
	}, [])

	// Cargar campañas inscritas
	const cargarCampanasInscritas = useCallback(async () => {
		if (!usuario?.id) return

		setCargandoCampanas(true)
		setError(null)

		try {
			// Obtener inscripciones completas del usuario
			const inscripcionesData = await inscripcionesService.obtenerInscripcionesCompletas(usuario.id)
			setCampanasInscritas(inscripcionesData)

			console.log('✅ Campañas inscritas cargadas:', inscripcionesData.length)
		} catch (err: any) {
			console.error('❌ Error al cargar campañas inscritas:', err)
			setError('No se pudieron cargar las campañas')
		} finally {
			setCargandoCampanas(false)
		}
	}, [usuario?.id])

	// Calcular estadísticas
	const calcularEstadisticas = useCallback(() => {
		const totalPacientes = pacientes.length
		const totalInscripciones = campanasInscritas.length

		// Filtrar campañas activas (POSTULADA o EJECUCION)
		const campanasActivas = campanasInscritas.filter(
			item => item.campana.estado === 'POSTULADA' || item.campana.estado === 'EJECUCION'
		).length

		// Campañas en ejecución
		const campanasEnEjecucion = campanasInscritas.filter(
			item => item.campana.estado === 'EJECUCION'
		).length

		setEstadisticas({
			totalPacientes,
			campanasActivas,
			campanasEnEjecucion,
			totalInscripciones
		})

		console.log('📊 Estadísticas actualizadas:', {
			totalPacientes,
			campanasActivas,
			campanasEnEjecucion,
			totalInscripciones
		})
	}, [pacientes, campanasInscritas])

	// Recargar todos los datos
	const recargarDatos = useCallback(async () => {
		await Promise.all([
			cargarPacientes(),
			cargarCampanasInscritas()
		])
	}, [cargarPacientes, cargarCampanasInscritas])

	// Filtrar pacientes por búsqueda
	const filtrarPacientes = useCallback((busqueda: string) => {
		if (!busqueda.trim()) return pacientes

		return pacientes.filter(p =>
			p.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
			p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
			p.identificacion.includes(busqueda)
		)
	}, [pacientes])

	// Obtener color del estado de campaña
	const obtenerColorEstadoCampana = useCallback((estado: string) => {
		switch (estado) {
			case 'POSTULADA':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
			case 'EJECUCION':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			case 'FINALIZADA':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
			case 'CANCELADA':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
			default:
				return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
		}
	}, [])

	// Formatear información de localización
	const formatearLocalizacion = useCallback((localizacion: any) => {
		if (!localizacion) return 'Ubicación no especificada'

		const partes = [localizacion.municipio]
		if (localizacion.vereda) partes.push(localizacion.vereda)
		if (localizacion.localidad) partes.push(localizacion.localidad)
		partes.push(localizacion.departamento)

		return partes.join(', ')
	}, [])

	// Cargar datos iniciales
	useEffect(() => {
		recargarDatos()
	}, [recargarDatos])

	// Recalcular estadísticas cuando cambien los datos
	useEffect(() => {
		calcularEstadisticas()
	}, [calcularEstadisticas])

	return {
		// Estados
		pacientes,
		campanasInscritas,
		estadisticas,
		error,

		// Estados de carga
		cargandoPacientes,
		cargandoCampanas,
		cargando: cargandoPacientes || cargandoCampanas,

		// Funciones
		cargarPacientes,
		cargarCampanasInscritas,
		recargarDatos,
		filtrarPacientes,
		obtenerColorEstadoCampana,
		formatearLocalizacion,

		// Utilidades
		setError
	}
} 