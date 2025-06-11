import React from 'react'

import { Card, CardContent, CardHeader } from '@/src/components/ui/card'

import { Skeleton } from '../skeleton'

interface ProfileSkeletonProps {
    showBanner?: boolean
    showTabs?: boolean
    showBio?: boolean
    className?: string
}

export default function ProfileSkeleton({
    showBanner = true,
    showTabs = true,
    showBio = true,
    className
}: ProfileSkeletonProps) {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Banner superior */}
            {showBanner && (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            {/* Avatar grande */}
                            <Skeleton className="size-24 shrink-0 rounded-full" />

                            {/* Info del perfil */}
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs de navegación */}
            {showTabs && (
                <div className="flex gap-1 border-b">
                    {Array.from({ length: 4 }, (_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-t" />
                    ))}
                </div>
            )}

            {/* Contenido del perfil */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Columna izquierda - Bio */}
                <div className="space-y-6">
                    {showBio && (
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    )}

                    {/* Información adicional */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 5 }, (_, i) => (
                                <div key={i} className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Columna derecha - Actividad */}
                <div className="space-y-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 6 }, (_, i) => (
                                <div key={i} className="flex items-start gap-3 rounded border p-3">
                                    <Skeleton className="size-8 shrink-0 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 