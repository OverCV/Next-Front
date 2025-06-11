"use client"

import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

import {
    EstadisticasEntidad,
    AccionesEntidad,
    TablaEmbajadores,
    TablaCampanas,
    useEntidadData
} from '@/src/components/entidad'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { DashboardSkeleton } from '@/src/components/ui/skeletons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'

export default function EntidadPage() {
    const [busqueda, setBusqueda] = useState('')

    // Hook personalizado para manejar toda la lógica de datos
    const {
        embajadores,
        campanas,
        estadisticas,
        cargando,
        error,
        recargarDatos
    } = useEntidadData()

    // Mostrar skeleton mientras cargan los datos iniciales
    if (cargando) {
        return (
            <DashboardSkeleton
                showStats
                showCards={false}
                showTable
            />
        )
    }

    return (
        <div className="space-y-8">
            {/* Estadísticas con iconos reales */}
            <EstadisticasEntidad estadisticas={estadisticas} />

            {/* Acciones principales */}
            <AccionesEntidad
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                onRecargar={recargarDatos}
                cargando={cargando}
            />

            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Tabs para Embajadores y Campañas */}
            <Tabs defaultValue="embajadores" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="embajadores">Embajadores</TabsTrigger>
                    <TabsTrigger value="campanas">Campañas</TabsTrigger>
                </TabsList>

                {/* Contenido de Embajadores */}
                <TabsContent value="embajadores" className="mt-4">
                    <TablaEmbajadores
                        embajadores={embajadores}
                        cargando={cargando}
                        busqueda={busqueda}
                    />
                </TabsContent>

                {/* Contenido de Campañas */}
                <TabsContent value="campanas" className="mt-4">
                    <TablaCampanas campanas={campanas} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

