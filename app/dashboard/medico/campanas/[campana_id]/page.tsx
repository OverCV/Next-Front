"use client";

import { Calendar, Clock, User, Activity, AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import DatosClinicosForm from '@/src/components/forms/DatosClinicosForm'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { useAuth } from '@/src/providers/auth-provider'
import apiClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { medicosService, CitacionMedica } from '@/src/services/domain/medicos.service'
import { Campana } from '@/src/types'

export default function CampanasPage() {
	const params = useParams()
	const router = useRouter()
	const { usuario } = useAuth()
	const campanaId = Number(params.campana_id)

	const [campana, setCampana] = useState<Campana | null>(null)
	const [citaciones, setCitaciones] = useState<CitacionMedica[]>([])
	const [citacionSeleccionada, setCitacionSeleccionada] = useState<CitacionMedica | null>(null)
	const [modalAbierto, setModalAbierto] = useState(false)

	const [cargandoCampana, setCargandoCampana] = useState(true)
	const [cargandoCitaciones, setCargandoCitaciones] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Cargar datos de la campaña
	useEffect(() => {
		const cargarCampana = async () => {
			if (!campanaId) return

			setCargandoCampana(true)
			try {
				const response = await apiClient.get(ENDPOINTS.CAMPANAS.POR_ID(campanaId))
				setCampana(response.data)
				console.log('✅ Campaña cargada:', response.data.nombre)
			} catch (err: any) {
				console.error('❌ Error al cargar campaña:', err)
				setError('No se pudo cargar la información de la campaña')
			} finally {
				setCargandoCampana(false)
			}
		}

		cargarCampana()
	}, [campanaId])

	// Cargar citaciones de la campaña
	useEffect(() => {
		const cargarCitaciones = async () => {
			if (!campanaId) return

			setCargandoCitaciones(true)
			try {
				const citacionesData = await medicosService.obtenerCitacionesPorCampana(campanaId)
				setCitaciones(citacionesData)
				console.log('✅ Citaciones cargadas:', citacionesData.length)
			} catch (err: any) {
				console.error('❌ Error al cargar citaciones:', err)
				setError('No se pudieron cargar las citaciones médicas')
			} finally {
				setCargandoCitaciones(false)
			}
		}

		cargarCitaciones()
	}, [campanaId])

	// Abrir modal con datos clínicos del paciente
	const abrirDatosClinicos = (citacion: CitacionMedica) => {
		setCitacionSeleccionada(citacion)
		setModalAbierto(true)
	}

	// Obtener color del estado
	const obtenerColorEstado = (estado: string) => {
		switch (estado) {
			case 'PROGRAMADA':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
			case 'ATENDIDA':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			case 'CANCELADA':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
			case 'NO_ASISTIO':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
			default:
				return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
		}
	}

	// Si está cargando, mostrar indicador
	if (cargandoCampana || cargandoCitaciones) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<div className="text-center">
					<RefreshCw className="mx-auto size-8 animate-spin text-slate-400" />
					<p className="mt-2 text-slate-500">Cargando información de la campaña...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto space-y-6 p-4">
			{/* Mensaje de error */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Header de la campaña */}
			<div className="flex items-start justify-between">
				<div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => router.back()}
						className="mb-4"
					>
						← Volver
					</Button>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
						{campana?.nombre || 'Campaña Médica'}
					</h1>
					<p className="mt-2 text-slate-600 dark:text-slate-400">
						{campana?.descripcion}
					</p>
					<div className="mt-4 flex items-center gap-4">
						<Badge className={obtenerColorEstado(campana?.estado || '')}>
							{campana?.estado}
						</Badge>
						<span className="text-sm text-slate-500">
							Inicio: {campana?.fechaInicio ? new Date(campana.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}
						</span>
					</div>
				</div>
			</div>

			{/* Estadísticas rápidas */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
					<div className="flex items-center gap-2">
						<Calendar className="size-5 text-blue-500" />
						<span className="text-sm font-medium">Total Citas</span>
					</div>
					<p className="mt-1 text-2xl font-bold">{citaciones.length}</p>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
					<div className="flex items-center gap-2">
						<Clock className="size-5 text-yellow-500" />
						<span className="text-sm font-medium">Programadas</span>
					</div>
					<p className="mt-1 text-2xl font-bold">
						{citaciones.filter(c => c.estado === 'PROGRAMADA').length}
					</p>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
					<div className="flex items-center gap-2">
						<Activity className="size-5 text-green-500" />
						<span className="text-sm font-medium">Atendidas</span>
					</div>
					<p className="mt-1 text-2xl font-bold">
						{citaciones.filter(c => c.estado === 'ATENDIDA').length}
					</p>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-800">
					<div className="flex items-center gap-2">
						<User className="size-5 text-purple-500" />
						<span className="text-sm font-medium">Pacientes Únicos</span>
					</div>
					<p className="mt-1 text-2xl font-bold">
						{new Set(citaciones.map(c => c.pacienteId)).size}
					</p>
				</div>
			</div>

			{/* Lista de citaciones */}
			<div className="rounded-lg border bg-white shadow-sm dark:bg-slate-800">
				<div className="border-b border-slate-200 p-6 dark:border-slate-700">
					<h2 className="text-xl font-semibold">Citaciones Médicas</h2>
					<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
						Listado de pacientes citados para esta campaña
					</p>
				</div>

				{citaciones.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-slate-50 dark:bg-slate-700/50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
										Paciente
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
										Fecha/Hora
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
										Código
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
										Estado
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
										Duración
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 dark:divide-slate-700">
								{citaciones.map(citacion => (
									<tr key={citacion.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
										<td className="whitespace-nowrap px-6 py-4">
											<div className="text-sm font-medium text-slate-900 dark:text-slate-100">
												Paciente #{citacion.pacienteId}
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="text-sm text-slate-900 dark:text-slate-100">
												{new Date(citacion.horaProgramada).toLocaleString('es-ES')}
											</div>
											{citacion.horaAtencion && (
												<div className="text-xs text-slate-500">
													Atendido: {new Date(citacion.horaAtencion).toLocaleString('es-ES')}
												</div>
											)}
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<code className="rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-700">
												{citacion.codigoTicket}
											</code>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<Badge className={obtenerColorEstado(citacion.estado)}>
												{citacion.estado}
											</Badge>
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
											{citacion.duracionEstimada} min
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm">
											<Dialog open={modalAbierto && citacionSeleccionada?.id === citacion.id} onOpenChange={(open) => {
												if (!open) {
													setModalAbierto(false)
													setCitacionSeleccionada(null)
												}
											}}>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														onClick={() => abrirDatosClinicos(citacion)}
														className="gap-2"
													>
														<FileText className="size-4" />
														Datos Clínicos
													</Button>
												</DialogTrigger>
												<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
													<DialogHeader>
														<DialogTitle>
															Datos Clínicos - Paciente #{citacion.pacienteId}
														</DialogTitle>
													</DialogHeader>
													{citacionSeleccionada && (
														<DatosClinicosForm
															pacienteId={citacionSeleccionada.pacienteId}
															onGuardar={() => {
																setModalAbierto(false)
																setCitacionSeleccionada(null)
															}}
														/>
													)}
												</DialogContent>
											</Dialog>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="p-8 text-center">
						<Calendar className="mx-auto size-12 text-slate-400" />
						<h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
							No hay citaciones programadas
						</h3>
						<p className="mt-2 text-sm text-slate-500">
							Cuando se programen citas para esta campaña, aparecerán aquí.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}