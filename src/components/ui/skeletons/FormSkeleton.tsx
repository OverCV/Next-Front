import React from 'react'

import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { Skeleton } from '@/src/components/ui/skeleton'

interface FormSkeletonProps {
    sections?: number
    fieldsPerSection?: number
    showHeader?: boolean
    showButton?: boolean
    className?: string
}

export default function FormSkeleton({
    sections = 3,
    fieldsPerSection = 4,
    showHeader = true,
    showButton = true,
    className
}: FormSkeletonProps) {
    return (
        <Card className={className}>
            {showHeader && (
                <CardHeader>
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
            )}
            <CardContent className="space-y-8">
                {Array.from({ length: sections }, (_, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4">
                        {/* Título de la sección */}
                        <Skeleton className="h-5 w-48" />

                        {/* Campos del formulario */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {Array.from({ length: fieldsPerSection }, (_, fieldIndex) => (
                                <div key={fieldIndex} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-11 w-full rounded-md" />
                                </div>
                            ))}
                        </div>

                        {/* Separador */}
                        {sectionIndex < sections - 1 && (
                            <div className="border-t border-slate-200 dark:border-slate-700" />
                        )}
                    </div>
                ))}

                {/* Botón de envío */}
                {showButton && (
                    <Skeleton className="h-12 w-full rounded-md" />
                )}
            </CardContent>
        </Card>
    )
} 