"use client";

import { Calendar, MapPin, Users, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { formatearFecha } from "@/src/lib/utils";
import { Campana } from "@/src/types";

import { StatusBadge } from "./StatusBadge";

interface CampanaCardProps {
    campana: Campana;
    isRegistered: boolean;
    onRegister?: () => void;
    onCancel?: () => void;
    onDetails: () => void;
}

export default function CampanaCard({
    campana,
    isRegistered,
    onRegister,
    onCancel,
    onDetails
}: CampanaCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{campana.nombre}</h3>
                    <StatusBadge estatus={campana.estatus} />
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {campana.descripcion}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Calendar className="size-4" />
                        <span>{formatearFecha(campana.fechaInicio)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="size-4" />
                        <span>
                            {campana.localizacion ?
                                `${campana.localizacion.municipio}, ${campana.localizacion.departamento}` :
                                "Ubicación no disponible"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Users className="size-4" />
                        <span>{campana.minParticipantes}-{campana.maxParticipantes} participantes</span>
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onDetails}
                >
                    Ver Detalles
                </Button>

                {isRegistered ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                        onClick={onCancel}
                    >
                        <X className="mr-1 size-3" />
                        Cancelar
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={onRegister}
                        disabled={campana.estatus !== 'postulada'}
                    >
                        Solicitar Inscripción
                    </Button>
                )}
            </div>
        </div>
    );
}