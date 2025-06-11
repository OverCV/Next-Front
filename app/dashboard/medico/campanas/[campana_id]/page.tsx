"use client";

import { AlertCircle, RefreshCw } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import EstadisticasCampana from '@/src/components/medicos/EstadisticasCampana'
import ModalAtencionMedica from '@/src/components/medicos/ModalAtencionMedica'
import TablaCitaciones from '@/src/components/medicos/TablaCitaciones'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import apiSpringClient from '@/src/services/api'
import { ENDPOINTS } from '@/src/services/auth/endpoints'
import { citacionesService } from '@/src/services/domain/citaciones.service'
import { Campana, CitacionMedica } from '@/src/types'

export default function CampanasPage() {
	const params = useParams()
	const router = useRouter()
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
				const response = await apiSpringClient.get(ENDPOINTS.CAMPANAS.POR_ID(campanaId))
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
		cargarCitaciones()
	}, [campanaId])

	const cargarCitaciones = async () => {
		if (!campanaId) return

		setCargandoCitaciones(true)
		try {
			const citacionesData = await citacionesService.obtenerCitacionesPorCampana(campanaId)
			setCitaciones(citacionesData)
			console.log('✅ Citaciones cargadas:', citacionesData.length)
		} catch (err: any) {
			console.error('❌ Error al cargar citaciones:', err)
			setError('No se pudieron cargar las citaciones médicas')
		} finally {
			setCargandoCitaciones(false)
		}
	}

	// Abrir modal de atención médica
	const abrirModalAtencion = (citacion: CitacionMedica) => {
		setCitacionSeleccionada(citacion)
		setModalAbierto(true)
	}

	// Cerrar modal
	const cerrarModal = () => {
		setModalAbierto(false)
		setCitacionSeleccionada(null)
	}

	// Manejar citación atendida
	const manejarCitacionAtendida = (citacionActualizada: CitacionMedica) => {
		// Actualizar la citación en el estado
		setCitaciones(prev =>
			prev.map(c =>
				c.id === citacionActualizada.id ? citacionActualizada : c
			)
		)
		console.log('✅ Citación actualizada en la tabla')
	}

	// Obtener color del estado de campaña
	const obtenerColorEstado = (estado: string) => {
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
						Volver
					</Button>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
						{campana?.nombre ?? 'Campaña Médica'}
					</h1>
					<p className="mt-2 text-slate-600 dark:text-slate-400">
						{campana?.descripcion}
					</p>
					<div className="mt-4 flex items-center gap-4">
						<Badge className={obtenerColorEstado(campana?.estado ?? '')}>
							{campana?.estado}
						</Badge>
						<span className="text-sm text-slate-500">
							Inicio: {campana?.fechaInicio ? new Date(campana.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}
						</span>
					</div>
				</div>
			</div>

			{/* Estadísticas rápidas */}
			<EstadisticasCampana citaciones={citaciones} />

			{/* Lista de citaciones */}
			<div className="rounded-lg border bg-white shadow-sm dark:bg-slate-800">
				<div className="border-b border-slate-200 p-6 dark:border-slate-700">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold">Citaciones Médicas</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Listado de pacientes citados para esta campaña
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={cargarCitaciones}
							disabled={cargandoCitaciones}
							className="gap-2"
						>
							<RefreshCw className={`size-4 ${cargandoCitaciones ? 'animate-spin' : ''}`} />
							Actualizar
						</Button>
					</div>
				</div>

				{/* Tabla de citaciones */}
				<TablaCitaciones
					citaciones={citaciones}
					onAbrirCitacion={abrirModalAtencion}
				/>
			</div>

			{/* Modal de atención médica */}
			<Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
				<DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Atención Médica</DialogTitle>
					</DialogHeader>
					{citacionSeleccionada && (
						<ModalAtencionMedica
							citacion={citacionSeleccionada}
							onCitacionAtendida={manejarCitacionAtendida}
							onCerrar={cerrarModal}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}