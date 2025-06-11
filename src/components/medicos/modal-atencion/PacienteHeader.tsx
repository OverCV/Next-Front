"use client"

import { User, Calendar, Activity } from 'lucide-react'

import { Badge } from '@/src/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card'
import { CitacionMedica, UsuarioInfo } from '@/src/types'

interface PacienteHeaderProps {
    usuario: UsuarioInfo
    citacion: CitacionMedica
}

export function PacienteHeader({ usuario, citacion }: PacienteHeaderProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            {usuario.nombres} {usuario.apellidos}
                        </CardTitle>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                            <p className="flex items-center gap-2">
                                <User className="size-4" />
                                {usuario.tipoIdentificacion}: {usuario.identificacion}
                            </p>
                            <p className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                Citación: {new Date(citacion.horaProgramada).toLocaleString('es-ES')}
                            </p>
                            <p className="flex items-center gap-2">
                                <Activity className="size-4" />
                                Código: {citacion.codigoTicket}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge
                            className={
                                citacion.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-800' :
                                    citacion.estado === 'ATENDIDA' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                            }
                        >
                            {citacion.estado}
                        </Badge>
                        <p className="mt-2 text-sm text-slate-500">
                            Duración: {citacion.duracionEstimada} min
                        </p>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
} 